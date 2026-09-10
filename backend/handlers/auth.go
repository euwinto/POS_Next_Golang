package handlers

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {

	var body LoginRequest

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Username dan password wajib diisi",
		})
		return
	}

	username := body.Username

	// =========================
	// CARI USER
	// =========================

	var (
		id                 int64
		nama               string
		role               *string
		password           *string
		isActive           bool
		mustChangePassword bool
	)

	err := database.DB.QueryRow(
		c.Request.Context(),
		`
		SELECT
			"ID",
			"Nama",
			"Role",
			"Password",
			"IsActive",
			"MustChangePassword"
		FROM "UserID"
		WHERE "Username" = $1
		`,
		username,
	).Scan(
		&id,
		&nama,
		&role,
		&password,
		&isActive,
		&mustChangePassword,
	)

	// =========================
	// USER TIDAK DITEMUKAN
	// =========================

	if err != nil {

		recordLoginHistory(
			c,
			username,
			"",
			"",
			"LOGIN FAILED USER NOT FOUND",
			"",
		)

		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User tidak ditemukan",
		})
		return
	}

	// =========================
	// USER NON AKTIF
	// =========================

	if !isActive {

		recordLoginHistory(
			c,
			username,
			nama,
			getRole(role),
			"LOGIN FAILED USER NON ACTIVE",
			"",
		)

		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User non aktif",
		})
		return
	}

	// =========================
	// PASSWORD KOSONG
	// =========================

	if password == nil || *password == "" {

		recordLoginHistory(
			c,
			username,
			nama,
			getRole(role),
			"LOGIN FAILED",
			"",
		)

		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Password belum tersedia",
		})
		return
	}

	// =========================
	// CEK PASSWORD
	// =========================

	if err := bcrypt.CompareHashAndPassword(
		[]byte(*password),
		[]byte(body.Password),
	); err != nil {

		recordLoginHistory(
			c,
			username,
			nama,
			getRole(role),
			"LOGIN FAILED",
			"",
		)

		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Password salah",
		})
		return
	}

	// =========================
	// SESSION TOKEN
	// =========================

	sessionToken := uuid.New().String()

	roleName := getRole(role)

	// =========================
	// LOGIN HISTORY
	// =========================

	recordLoginHistory(
		c,
		username,
		nama,
		roleName,
		"LOGIN SUCCESS",
		sessionToken,
	)

	// =========================
	// JWT
	// =========================

	secret := os.Getenv("JWT_SECRET")

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username":           username,
			"nama":               nama,
			"role":               roleName,
			"sessionToken":       sessionToken,
			"mustChangePassword": mustChangePassword,
			"exp":                time.Now().Add(8 * time.Hour).Unix(),
		},
	)

	signedToken, err := token.SignedString([]byte(secret))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membuat session",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"token":   signedToken,
		"user": gin.H{
			"id":                 id,
			"username":           username,
			"nama":               nama,
			"role":               roleName,
			"sessionToken":       sessionToken,
			"mustChangePassword": mustChangePassword,
		},
	})
}

func getRole(role *string) string {

	if role == nil || *role == "" {
		return "KASIR"
	}

	return *role
}

func recordLoginHistory(
	c *gin.Context,
	username string,
	nama string,
	role string,
	status string,
	sessionToken string,
) {

	ip := c.ClientIP()

	_, err := database.DB.Exec(
		c.Request.Context(),
		`
		INSERT INTO "HsUserID"
		(
			"Username",
			"Nama",
			"Role",
			"LoginTime",
			"StatusLogin",
			"IPAddress",
			"SessionToken"
		)
		VALUES
		(
			$1,
			$2,
			$3,
			NOW(),
			$4,
			$5,
			$6
		)
		`,
		username,
		nama,
		role,
		status,
		ip,
		sessionToken,
	)

	if err != nil {
		c.Error(err)
	}
}

func Logout(c *gin.Context) {

	var body struct {
		Username     string `json:"username"`
		SessionToken string `json:"sessionToken"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data session tidak valid",
		})
		return
	}

	if body.Username == "" || body.SessionToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data session tidak lengkap",
		})
		return
	}

	// =========================
	// UPDATE LOGOUT
	// =========================

	result, err := database.DB.Exec(
		c.Request.Context(),
		`
		UPDATE "HsUserID"
		SET "LogoutTime" = NOW()
		WHERE "Username" = $1
		  AND "SessionToken" = $2
		  AND "LogoutTime" IS NULL
		`,
		body.Username,
		body.SessionToken,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	if result.RowsAffected() == 0 {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "Session tidak ditemukan",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logout berhasil",
	})
}

func ResetPassword(c *gin.Context) {

	// =========================
	// USER LOGIN
	// =========================

	currentUsername := c.GetString("username")
	currentRole := c.GetString("role")

	// =========================
	// OWNER ONLY
	// =========================

	if currentUsername == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User tidak valid atau belum login",
		})
		return
	}

	if currentRole != "OWNER" {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"message": "Akses ditolak",
		})
		return
	}

	// =========================
	// REQUEST
	// =========================

	var body struct {
		Username string `json:"username"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format data tidak valid",
		})
		return
	}

	if body.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Username wajib diisi",
		})
		return
	}

	// =========================
	// CEK USER
	// =========================

	var (
		id   int64
		nama string
		role *string
	)

	err := database.DB.QueryRow(
		c,
		`
		SELECT
			"ID",
			"Nama",
			"Role"
		FROM "UserID"
		WHERE "Username" = $1
		`,
		body.Username,
	).Scan(
		&id,
		&nama,
		&role,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User tidak ditemukan",
		})
		return
	}

	// =========================
	// DEFAULT PASSWORD
	// =========================

	defaultPassword := "POS1234"

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(defaultPassword),
		bcrypt.DefaultCost,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membuat password",
		})
		return
	}

	// =========================
	// UPDATE PASSWORD
	// =========================

	_, err = database.DB.Exec(
		c,
		`
		UPDATE "UserID"
		SET
			"Password" = $1,
			"MustChangePassword" = TRUE
		WHERE "Username" = $2
		`,
		string(hashedPassword),
		body.Username,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mereset password",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// HISTORY
	// =========================

	_, err = database.DB.Exec(
		c,
		`
		INSERT INTO "HsUserID"
		(
			"Username",
			"Nama",
			"Role",
			"LoginTime",
			"StatusLogin"
		)
		VALUES
		(
			$1,
			$2,
			$3,
			NOW(),
			'RESET PASSWORD'
		)
		`,
		body.Username,
		currentUsername,
		currentRole,
	)

	if err != nil {
		// Password sudah berhasil direset.
		// History gagal tidak perlu membatalkan reset.
		log.Println("RESET PASSWORD HISTORY ERROR:", err)
	}

	// =========================
	// SUCCESS
	// =========================

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password berhasil direset",
	})
}
