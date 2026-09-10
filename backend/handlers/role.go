package handlers

import (
	"context"
	"net/http"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
)

// =========================
// GET ROLE
// =========================
func GetRole(c *gin.Context) {
	rows, err := database.DB.Query(
		context.Background(),
		`
		SELECT
			"ID",
			"RoleCode",
			"RoleName",
			"IsActive"
		FROM "MsRole"
		ORDER BY "RoleCode" ASC
		`,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    []any{},
			"message": "Gagal mengambil data role",
			"error":   err.Error(),
		})
		return
	}

	defer rows.Close()

	roles := []gin.H{}

	for rows.Next() {
		var (
			id       int64
			roleCode string
			roleName string
			isActive bool
		)

		err := rows.Scan(
			&id,
			&roleCode,
			&roleName,
			&isActive,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"data":    []any{},
				"message": "Gagal membaca data role",
				"error":   err.Error(),
			})
			return
		}

		roles = append(roles, gin.H{
			"ID":       id,
			"RoleCode": roleCode,
			"RoleName": roleName,
			"IsActive": isActive,
		})
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    []any{},
			"message": "Gagal membaca data role",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    roles,
	})
}

// =========================
// POST ROLE
// =========================
func CreateRole(c *gin.Context) {
	var body struct {
		RoleCode string `json:"RoleCode"`
		RoleName string `json:"RoleName"`
		IsActive *bool  `json:"IsActive"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format request tidak valid",
		})
		return
	}

	if body.RoleCode == "" || body.RoleName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Role Code dan Role Name wajib diisi",
		})
		return
	}

	// Default IsActive = true
	isActive := true

	if body.IsActive != nil {
		isActive = *body.IsActive
	}

	// =========================
	// CHECK DUPLICATE
	// =========================

	var existingID int64

	err := database.DB.QueryRow(
		context.Background(),
		`
		SELECT "ID"
		FROM "MsRole"
		WHERE "RoleCode" = $1
		LIMIT 1
		`,
		body.RoleCode,
	).Scan(&existingID)

	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Role sudah ada",
		})
		return
	}

	// =========================
	// INSERT
	// =========================

	var newID int64

	err = database.DB.QueryRow(
		context.Background(),
		`
		INSERT INTO "MsRole"
		(
			"RoleCode",
			"RoleName",
			"IsActive"
		)
		VALUES
		(
			$1,
			$2,
			$3
		)
		RETURNING "ID"
		`,
		body.RoleCode,
		body.RoleName,
		isActive,
	).Scan(&newID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menyimpan role",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Role berhasil disimpan",
		"data": gin.H{
			"ID":       newID,
			"RoleCode": body.RoleCode,
			"RoleName": body.RoleName,
			"IsActive": isActive,
		},
	})
}
