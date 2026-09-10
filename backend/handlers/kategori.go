package handlers

import (
	"net/http"
	"strconv"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
)

func GetKategori(c *gin.Context) {

	rows, err := database.DB.Query(
		c.Request.Context(),
		`
		SELECT
			"ID",
			"KodeKategori",
			"NamaKategori",
			"Status",
			"WaktuDibuat"
		FROM "MsKategori"
		ORDER BY "ID" DESC
		`,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	defer rows.Close()

	kategori := []map[string]interface{}{}

	for rows.Next() {

		var (
			id           int64
			kodeKategori string
			namaKategori string
			status       bool
			waktuDibuat  interface{}
		)

		err := rows.Scan(
			&id,
			&kodeKategori,
			&namaKategori,
			&status,
			&waktuDibuat,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": err.Error(),
			})
			return
		}

		kategori = append(kategori, map[string]interface{}{
			"ID":           id,
			"KodeKategori": kodeKategori,
			"NamaKategori": namaKategori,
			"Status":       status,
			"WaktuDibuat":  waktuDibuat,
		})
	}

	c.JSON(http.StatusOK, kategori)
}

func CreateKategori(c *gin.Context) {

	var body struct {
		NamaKategori string `json:"namaKategori"`
		Status       bool   `json:"status"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data kategori tidak valid",
		})
		return
	}

	ctx := c.Request.Context()

	// =========================
	// AMBIL KATEGORI TERAKHIR
	// =========================

	var lastKode *string

	err := database.DB.QueryRow(
		ctx,
		`
		SELECT "KodeKategori"
		FROM "MsKategori"
		ORDER BY "ID" DESC
		LIMIT 1
		`,
	).Scan(&lastKode)

	if err != nil {
		lastKode = nil
	}

	// =========================
	// GENERATE KODE
	// =========================

	kodeKategori := "KTG0001"

	if lastKode != nil {

		angka := lastKodeKategori(*lastKode)

		if angka > 0 {
			kodeKategori = "KTG" + padNumber(angka+1, 4)
		}
	}

	// =========================
	// INSERT
	// =========================

	_, err = database.DB.Exec(
		ctx,
		`
		INSERT INTO "MsKategori"
		(
			"KodeKategori",
			"NamaKategori",
			"Status",
			"WaktuDibuat"
		)
		VALUES
		(
			$1,
			$2,
			$3,
			NOW()
		)
		`,
		kodeKategori,
		body.NamaKategori,
		body.Status,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"kodeKategori": kodeKategori,
	})
}

func lastKodeKategori(kode string) int {

	if len(kode) <= 3 {
		return 0
	}

	angka, err := strconv.Atoi(kode[3:])

	if err != nil {
		return 0
	}

	return angka
}
