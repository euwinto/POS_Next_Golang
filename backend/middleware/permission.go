package middleware

import (
	"net/http"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
)

func Permission(menuCode string, permission string) gin.HandlerFunc {
	return func(c *gin.Context) {

		role := c.GetString("role")

		if role == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Role tidak ditemukan",
			})
			c.Abort()
			return
		}

		var column string

		switch permission {
		case "view":
			column = `"CanView"`
		case "add":
			column = `"CanAdd"`
		case "edit":
			column = `"CanEdit"`
		case "delete":
			column = `"CanDelete"`
		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Permission tidak valid",
			})
			c.Abort()
			return
		}

		query := `
			SELECT EXISTS (
				SELECT 1
				FROM "RoleMenu"
				WHERE "RoleName" = $1
				  AND "MenuCode" = $2
				  AND ` + column + ` = true
			)
		`

		var allowed bool

		err := database.DB.QueryRow(
			c.Request.Context(),
			query,
			role,
			menuCode,
		).Scan(&allowed)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": err.Error(),
			})
			c.Abort()
			return
		}

		if !allowed {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "Anda tidak memiliki permission untuk aksi ini",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
