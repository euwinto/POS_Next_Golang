package handlers

import (
	"net/http"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
)

func GetMenu(c *gin.Context) {

	rows, err := database.DB.Query(
		c.Request.Context(),
		`
		SELECT
			"ID",
			"MenuCode",
			"MenuName",
			"Url",
			"Icon",
			"ParentID",
			"Sort",
			"IsActive",
			"WaktuDibuat",
			"DibuatOleh"
		FROM "MsMenu"
		ORDER BY
			"ParentID" ASC,
			"Sort" ASC
		`,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
			"data":    []interface{}{},
		})
		return
	}

	defer rows.Close()

	menus := []map[string]interface{}{}

	for rows.Next() {

		var (
			id          int64
			menuCode    string
			menuName    string
			url         *string
			icon        *string
			parentID    *int64
			sort        int
			isActive    bool
			waktuDibuat interface{}
			dibuatOleh  *string
		)

		err := rows.Scan(
			&id,
			&menuCode,
			&menuName,
			&url,
			&icon,
			&parentID,
			&sort,
			&isActive,
			&waktuDibuat,
			&dibuatOleh,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": err.Error(),
				"data":    []interface{}{},
			})
			return
		}

		menus = append(menus, map[string]interface{}{
			"ID":          id,
			"MenuCode":    menuCode,
			"MenuName":    menuName,
			"Url":         url,
			"Icon":        icon,
			"ParentID":    parentID,
			"Sort":        sort,
			"IsActive":    isActive,
			"WaktuDibuat": waktuDibuat,
			"DibuatOleh":  dibuatOleh,
		})
	}

	// =========================
	// PARENT NAME
	// =========================

	menuMap := make(map[int64]string)

	for _, menu := range menus {

		id := menu["ID"].(int64)
		name := menu["MenuName"].(string)

		menuMap[id] = name
	}

	for _, menu := range menus {

		parentID, ok := menu["ParentID"].(*int64)

		if ok && parentID != nil {
			if parentName, exists := menuMap[*parentID]; exists {
				menu["ParentName"] = parentName
			} else {
				menu["ParentName"] = nil
			}
		} else {
			menu["ParentName"] = nil
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    menus,
	})
}

func GetSidebarMenu(c *gin.Context) {

	// =========================
	// USER LOGIN
	// =========================

	username := c.GetString("username")

	if username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User belum login",
			"data":    []interface{}{},
		})
		return
	}

	// =========================
	// AMBIL ROLE DARI JWT
	// =========================

	role := c.GetString("role")

	if role == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Role user tidak ditemukan",
			"data":    []interface{}{},
		})
		return
	}

	// =========================
	// AMBIL MENU SESUAI VIEW
	// =========================

	rows, err := database.DB.Query(
		c.Request.Context(),
		`
		SELECT
			m."ID",
			m."MenuCode",
			m."MenuName",
			m."Url",
			m."Icon",
			m."ParentID",
			m."Sort",
			m."IsActive",
			 rm."CanView",
    rm."CanAdd",
    rm."CanEdit",
    rm."CanDelete"
		FROM "MsMenu" m
		INNER JOIN "RoleMenu" rm
			ON rm."MenuCode" = m."MenuCode"
		WHERE rm."RoleName" = $1
		  AND rm."CanView" = true
		  AND m."IsActive" = true
		ORDER BY
			CASE
				WHEN m."ParentID" IS NULL THEN 0
				ELSE 1
			END,
			m."ParentID" ASC,
			m."Sort" ASC
		`,
		role,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
			"data":    []interface{}{},
		})
		return
	}

	defer rows.Close()

	menus := []map[string]interface{}{}

	for rows.Next() {

		var (
			id       int64
			menuCode string
			menuName string
			url      *string
			icon     *string
			parentID *int64
			sort     int
			isActive bool

			canView   bool
			canAdd    bool
			canEdit   bool
			canDelete bool
		)

		err := rows.Scan(
			&id,
			&menuCode,
			&menuName,
			&url,
			&icon,
			&parentID,
			&sort,
			&isActive,
			&canView,
			&canAdd,
			&canEdit,
			&canDelete,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": err.Error(),
				"data":    []interface{}{},
			})
			return
		}

		menus = append(menus, map[string]interface{}{
			"ID":       id,
			"MenuCode": menuCode,
			"MenuName": menuName,
			"Url":      url,
			"Icon":     icon,
			"ParentID": parentID,
			"Sort":     sort,
			"IsActive": isActive,

			"CanView":   canView,
			"CanAdd":    canAdd,
			"CanEdit":   canEdit,
			"CanDelete": canDelete,
		})
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
			"data":    []interface{}{},
		})
		return
	}

	// =========================
	// RESPONSE
	// =========================

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"username": username,
		"role":     role,
		"data":     menus,
	})
}
