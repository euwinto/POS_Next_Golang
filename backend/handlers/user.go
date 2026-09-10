package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// =========================
// GET USER
// =========================
func GetUsers(c *gin.Context) {

	rows, err := database.DB.Query(c, `
		SELECT
			"ID",
			"Username",
			"Nama",
			COALESCE("Role", '') AS "Role",
			COALESCE("IsActive", false) AS "IsActive",
			 COALESCE("ProfilePhoto", '') AS "ProfilePhoto",
			"WaktuDibuat",
			COALESCE("DibuatOleh", '') AS "DibuatOleh"
		FROM "UserID"
		ORDER BY "Username" ASC
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil data user",
			"error":   err.Error(),
			"data":    []any{},
		})
		return
	}

	defer rows.Close()

	data := []gin.H{}

	for rows.Next() {

		var (
			id           int64
			username     string
			nama         string
			role         string
			isActive     bool
			profilePhoto string
			waktuDibuat  *time.Time
			dibuatOleh   string
		)

		err := rows.Scan(
			&id,
			&username,
			&nama,
			&role,
			&isActive,
			&profilePhoto,
			&waktuDibuat,
			&dibuatOleh,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca data user",
				"error":   err.Error(),
				"data":    []any{},
			})
			return
		}

		data = append(data, gin.H{
			"ID":           id,
			"Username":     username,
			"Nama":         nama,
			"Role":         role,
			"IsActive":     isActive,
			"ProfilePhoto": profilePhoto,
			"WaktuDibuat":  waktuDibuat,
			"DibuatOleh":   dibuatOleh,
		})
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membaca data user",
			"error":   err.Error(),
			"data":    []any{},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}

// =========================
// POST USER
// =========================
func CreateUser(c *gin.Context) {

	var body struct {
		Username string `json:"Username"`
		Nama     string `json:"Nama"`
		Role     string `json:"Role"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format data tidak valid",
		})
		return
	}

	if body.Username == "" || body.Nama == "" || body.Role == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data belum lengkap",
		})
		return
	}

	// =========================
	// CHECK USERNAME
	// =========================

	var existingID int64

	err := database.DB.QueryRow(c, `
		SELECT "ID"
		FROM "UserID"
		WHERE "Username" = $1
	`, body.Username).Scan(&existingID)

	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Username sudah digunakan",
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
	// INSERT
	// =========================

	_, err = database.DB.Exec(c, `
		INSERT INTO "UserID"
		(
			"Username",
			"Password",
			"Nama",
			"Role",
			"IsActive",
			"MustChangePassword",
			"WaktuDibuat",
			"DibuatOleh"
		)
		VALUES
		(
			$1,
			$2,
			$3,
			$4,
			true,
			true,
			$5,
			$6
		)
	`,
		body.Username,
		string(hashedPassword),
		body.Nama,
		body.Role,
		time.Now(),
		"SYSTEM",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menyimpan user",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User berhasil ditambahkan",
	})
}

// =========================
// PUT USER
// AKTIF / NONAKTIF
// =========================
func UpdateUser(c *gin.Context) {

	var body struct {
		ID       int64 `json:"ID"`
		IsActive bool  `json:"IsActive"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format data tidak valid",
		})
		return
	}

	_, err := database.DB.Exec(c, `
		UPDATE "UserID"
		SET "IsActive" = $1
		WHERE "ID" = $2
	`,
		body.IsActive,
		body.ID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengubah status user",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Status user berhasil diubah",
	})
}

// =========================
// UPDATE USER STATUS
// =========================
func UpdateUserStatus(c *gin.Context) {

	var body struct {
		Username string `json:"Username"`
		IsActive *bool  `json:"IsActive"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format data tidak valid",
		})
		return
	}

	// IsActive menggunakan pointer supaya false tetap dianggap valid
	if body.Username == "" || body.IsActive == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data belum lengkap",
		})
		return
	}

	result, err := database.DB.Exec(c, `
		UPDATE "UserID"
		SET
			"IsActive" = $1,
			"WaktuDiubah" = $2
		WHERE "Username" = $3
	`,
		*body.IsActive,
		time.Now(),
		body.Username,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengubah status user",
			"error":   err.Error(),
		})
		return
	}

	if result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User tidak ditemukan",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Status user berhasil diubah",
	})
}

// =========================
// GET MY PROFILE
// =========================
func GetMyProfile(c *gin.Context) {

	username := c.GetString("username")

	if username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User tidak ditemukan",
		})
		return
	}

	var (
		id                 int64
		dbUsername         string
		nama               string
		role               string
		isActive           bool
		mustChangePassword bool
		profilePhoto       *string
		waktuDibuat        *time.Time
		dibuatOleh         string
	)

	err := database.DB.QueryRow(c, `
		SELECT
			"ID",
			"Username",
			"Nama",
			COALESCE("Role", ''),
			COALESCE("IsActive", false),
			COALESCE("MustChangePassword", false),
			"ProfilePhoto",
			"WaktuDibuat",
			COALESCE("DibuatOleh", '')
		FROM "UserID"
		WHERE "Username" = $1
	`,
		username,
	).Scan(
		&id,
		&dbUsername,
		&nama,
		&role,
		&isActive,
		&mustChangePassword,
		&profilePhoto,
		&waktuDibuat,
		&dibuatOleh,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Data user tidak ditemukan",
			"error":   err.Error(),
		})
		return
	}

	photo := ""

	if profilePhoto != nil {
		photo = *profilePhoto
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"ID":                 id,
			"Username":           dbUsername,
			"Nama":               nama,
			"Role":               role,
			"IsActive":           isActive,
			"MustChangePassword": mustChangePassword,
			"ProfilePhoto":       photo,
			"WaktuDibuat":        waktuDibuat,
			"DibuatOleh":         dibuatOleh,
		},
	})
}

// =========================
// UPLOAD PROFILE PHOTO
// =========================
func UploadProfilePhoto(c *gin.Context) {

	username := c.GetString("username")

	if username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User tidak ditemukan",
		})
		return
	}

	// =========================
	// AMBIL FILE
	// =========================

	file, err := c.FormFile("photo")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Foto tidak ditemukan",
		})
		return
	}

	// =========================
	// VALIDASI UKURAN
	// Maksimal 2 MB
	// =========================

	const maxSize = 2 * 1024 * 1024

	if file.Size > maxSize {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Ukuran foto maksimal 2 MB",
		})
		return
	}

	// =========================
	// VALIDASI EXTENSION
	// =========================

	ext := strings.ToLower(filepath.Ext(file.Filename))

	allowedExtensions := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
	}

	if !allowedExtensions[ext] {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format foto harus JPG, JPEG, PNG, atau WEBP",
		})
		return
	}

	// =========================
	// BUAT FOLDER
	// =========================

	uploadDir := "./uploads/profile"

	err = os.MkdirAll(uploadDir, 0755)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membuat folder upload",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// AMBIL DATA FOTO LAMA
	// =========================

	var oldPhoto *string

	err = database.DB.QueryRow(c, `
		SELECT "ProfilePhoto"
		FROM "UserID"
		WHERE "Username" = $1
	`,
		username,
	).Scan(&oldPhoto)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User tidak ditemukan",
		})
		return
	}

	// =========================
	// NAMA FILE BARU
	// =========================

	filename := fmt.Sprintf(
		"%d_%d%s",
		time.Now().UnixNano(),
		time.Now().Unix(),
		ext,
	)

	filePath := filepath.Join(uploadDir, filename)

	// =========================
	// SIMPAN FILE
	// =========================

	err = c.SaveUploadedFile(file, filePath)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menyimpan foto",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// PATH YANG DISIMPAN DB
	// =========================

	profilePhoto := "/uploads/profile/" + filename

	// =========================
	// UPDATE DATABASE
	// =========================

	result, err := database.DB.Exec(c, `
		UPDATE "UserID"
		SET
			"ProfilePhoto" = $1,
			"WaktuDiubah" = $2
		WHERE "Username" = $3
	`,
		profilePhoto,
		time.Now(),
		username,
	)

	if err != nil {

		// Kalau DB gagal, hapus file yang baru
		os.Remove(filePath)

		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menyimpan data foto",
			"error":   err.Error(),
		})
		return
	}

	if result.RowsAffected() == 0 {

		os.Remove(filePath)

		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User tidak ditemukan",
		})
		return
	}

	// =========================
	// HAPUS FOTO LAMA
	// =========================

	if oldPhoto != nil && *oldPhoto != "" {

		oldPath := "." + *oldPhoto

		// Jangan sampai menghapus file aneh di luar folder upload
		if strings.HasPrefix(*oldPhoto, "/uploads/profile/") {
			os.Remove(oldPath)
		}
	}

	// =========================
	// RESPONSE
	// =========================

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Foto profile berhasil diperbarui",
		"data": gin.H{
			"ProfilePhoto": profilePhoto,
		},
	})
}
