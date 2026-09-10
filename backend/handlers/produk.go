package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {

	aktif := c.Query("aktif")

	query := `
		SELECT
			"ID",
			"KodeBarang",
			"NamaBarang",
			"HargaJual",
			"Status",
			"KategoriBarang"
		FROM "MsProduk"
	`

	if aktif == "1" {
		query += ` WHERE "Status" = true`
	}

	query += ` ORDER BY "NamaBarang" ASC`

	rows, err := database.DB.Query(
		c.Request.Context(),
		query,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	defer rows.Close()

	products := []map[string]interface{}{}

	for rows.Next() {

		var (
			id             int64
			kodeBarang     string
			namaBarang     string
			hargaJual      *float64
			status         bool
			kategoriBarang *string
		)

		err := rows.Scan(
			&id,
			&kodeBarang,
			&namaBarang,
			&hargaJual,
			&status,
			&kategoriBarang,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": err.Error(),
			})
			return
		}

		harga := 0.0

		if hargaJual != nil {
			harga = *hargaJual
		}

		products = append(products, map[string]interface{}{
			"ID":             id,
			"KodeBarang":     kodeBarang,
			"NamaBarang":     namaBarang,
			"HargaJual":      harga,
			"Status":         status,
			"KategoriBarang": kategoriBarang,
		})
	}

	c.JSON(http.StatusOK, products)
}

func CreateProduct(c *gin.Context) {

	var body struct {
		NamaBarang     string  `json:"namaBarang"`
		KategoriBarang string  `json:"kategoriBarang"`
		HargaBeli      float64 `json:"hargaBeli"`
		HargaJual      float64 `json:"hargaJual"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Data produk tidak valid",
		})
		return
	}

	ctx := c.Request.Context()

	// =========================
	// AMBIL PRODUK TERAKHIR
	// =========================

	var lastKode *string

	err := database.DB.QueryRow(
		ctx,
		`
		SELECT "KodeBarang"
		FROM "MsProduk"
		ORDER BY "ID" DESC
		LIMIT 1
		`,
	).Scan(&lastKode)

	if err != nil {
		// Tidak ada produk
		lastKode = nil
	}

	// =========================
	// GENERATE KODE BARANG
	// =========================

	kodeBarang := "BRG0001"

	if lastKode != nil {

		angka := lastKodeString(*lastKode)

		if angka > 0 {
			kodeBarang = "BRG" + padNumber(angka+1, 4)
		}
	}

	// =========================
	// INSERT
	// =========================

	_, err = database.DB.Exec(
		ctx,
		`
		INSERT INTO "MsProduk"
		(
			"KodeBarang",
			"NamaBarang",
			"KategoriBarang",
			"HargaBeli",
			"HargaJual",
			"Status",
			"WaktuDibuat"
		)
		VALUES
		(
			$1,
			$2,
			$3,
			$4,
			$5,
			true,
			NOW()
		)
		`,
		kodeBarang,
		body.NamaBarang,
		body.KategoriBarang,
		body.HargaBeli,
		body.HargaJual,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"kodeBarang": kodeBarang,
	})
}

func lastKodeString(kode string) int {
	if len(kode) <= 3 {
		return 0
	}

	angka, err := strconv.Atoi(kode[3:])

	if err != nil {
		return 0
	}

	return angka
}

func padNumber(number int, length int) string {
	return fmt.Sprintf("%0*d", length, number)
}
