package handlers

import (
	"net/http"
	"time"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func ChangePassword(c *gin.Context) {

	var body struct {
		Username    string `json:"Username"`
		OldPassword string `json:"OldPassword"`
		NewPassword string `json:"NewPassword"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format data tidak valid",
		})
		return
	}

	// =========================
	// VALIDASI
	// =========================

	if body.Username == "" ||
		body.OldPassword == "" ||
		body.NewPassword == "" {

		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Username, password lama dan password baru wajib diisi",
		})
		return
	}

	// =========================
	// AMBIL USER
	// =========================

	var (
		userID   int64
		password string
	)

	err := database.DB.QueryRow(c, `
		SELECT
			"ID",
			"Password"
		FROM "UserID"
		WHERE "Username" = $1
	`, body.Username).Scan(
		&userID,
		&password,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User tidak ditemukan",
		})
		return
	}

	// =========================
	// CEK PASSWORD LAMA
	// =========================

	err = bcrypt.CompareHashAndPassword(
		[]byte(password),
		[]byte(body.OldPassword),
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Password lama salah",
		})
		return
	}

	// =========================
	// HASH PASSWORD BARU
	// =========================

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(body.NewPassword),
		bcrypt.DefaultCost,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal melakukan hash password",
		})
		return
	}

	// =========================
	// UPDATE PASSWORD
	// =========================

	_, err = database.DB.Exec(c, `
		UPDATE "UserID"
		SET
			"Password" = $1,
			"MustChangePassword" = false,
			"WaktuDiubah" = $2
		WHERE "ID" = $3
	`,
		string(hashedPassword),
		time.Now(),
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengubah password",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"message":     "Password berhasil diganti",
		"forceLogout": true,
	})
}
