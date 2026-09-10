package handlers

import (
	"net/http"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
)

// =========================
// GET ROLE MENU
// GET /api/role-menu?role=OWNER
// =========================
func GetRoleMenu(c *gin.Context) {

	role := c.Query("role")

	if role == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Role wajib dipilih",
			"data":    []any{},
		})
		return
	}

	ctx := c.Request.Context()

	rows, err := database.DB.Query(ctx, `
		SELECT
			m."ID",
			m."MenuCode",
			m."MenuName",
			m."ParentID",
			m."Sort",

			COALESCE(r."CanView", false) AS "CanView",
			COALESCE(r."CanAdd", false) AS "CanAdd",
			COALESCE(r."CanEdit", false) AS "CanEdit",
			COALESCE(r."CanDelete", false) AS "CanDelete"

		FROM "MsMenu" m

		LEFT JOIN "RoleMenu" r
			ON r."MenuCode" = m."MenuCode"
			AND r."RoleName" = $1

		WHERE m."IsActive" = true

		ORDER BY
			m."ParentID" ASC,
			m."Sort" ASC
	`, role)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil data role menu",
			"error":   err.Error(),
			"data":    []any{},
		})
		return
	}

	defer rows.Close()

	data := []gin.H{}

	for rows.Next() {

		var (
			id        int64
			menuCode  string
			menuName  string
			parentID  *int64
			sort      int
			canView   bool
			canAdd    bool
			canEdit   bool
			canDelete bool
		)

		err := rows.Scan(
			&id,
			&menuCode,
			&menuName,
			&parentID,
			&sort,
			&canView,
			&canAdd,
			&canEdit,
			&canDelete,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca data role menu",
				"error":   err.Error(),
				"data":    []any{},
			})
			return
		}

		data = append(data, gin.H{
			"ID":        id,
			"MenuCode":  menuCode,
			"MenuName":  menuName,
			"ParentID":  parentID,
			"Sort":      sort,
			"CanView":   canView,
			"CanAdd":    canAdd,
			"CanEdit":   canEdit,
			"CanDelete": canDelete,
		})
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membaca data role menu",
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
// POST ROLE MENU
// POST /api/role-menu
// =========================
func CreateRoleMenu(c *gin.Context) {

	var body struct {
		RoleName    string `json:"RoleName"`
		Permissions []struct {
			MenuCode  string `json:"MenuCode"`
			CanView   bool   `json:"CanView"`
			CanAdd    bool   `json:"CanAdd"`
			CanEdit   bool   `json:"CanEdit"`
			CanDelete bool   `json:"CanDelete"`
		} `json:"permissions"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data request tidak valid",
		})
		return
	}

	if body.RoleName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Role wajib dipilih",
		})
		return
	}

	if body.Permissions == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data permission tidak valid",
		})
		return
	}

	ctx := c.Request.Context()

	// =========================
	// TRANSACTION
	// =========================
	tx, err := database.DB.Begin(ctx)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal memulai transaction",
			"error":   err.Error(),
		})
		return
	}

	// Kalau terjadi error di tengah proses,
	// transaction akan di-rollback.
	defer tx.Rollback(ctx)

	// =========================
	// DELETE PERMISSION LAMA
	// =========================
	_, err = tx.Exec(
		ctx,
		`
		DELETE FROM "RoleMenu"
		WHERE "RoleName" = $1
		`,
		body.RoleName,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menghapus permission lama",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// INSERT PERMISSION BARU
	// =========================
	for _, item := range body.Permissions {

		// Skip MenuCode kosong
		if item.MenuCode == "" {
			continue
		}

		_, err = tx.Exec(
			ctx,
			`
			INSERT INTO "RoleMenu"
			(
				"RoleName",
				"MenuCode",
				"CanView",
				"CanAdd",
				"CanEdit",
				"CanDelete"
			)
			VALUES
			(
				$1,
				$2,
				$3,
				$4,
				$5,
				$6
			)
			`,
			body.RoleName,
			item.MenuCode,
			item.CanView,
			item.CanAdd,
			item.CanEdit,
			item.CanDelete,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal menyimpan permission",
				"error":   err.Error(),
			})
			return
		}
	}

	// =========================
	// COMMIT
	// =========================
	if err := tx.Commit(ctx); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal commit permission",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Permission berhasil disimpan",
	})
}
