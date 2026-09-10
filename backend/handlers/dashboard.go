package handlers

import (
	"net/http"
	"time"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
)

func GetDashboard(c *gin.Context) {

	// =====================================================
	// VARIABLE SUMMARY
	// =====================================================

	var (
		totalProduk      int64
		totalProdukAktif int64
		totalProdukNon   int64

		totalUser      int64
		totalUserAktif int64
		totalUserNon   int64

		totalPenjualanHariIni int64
		totalTransaksiHariIni int64
	)

	// =====================================================
	// TOTAL PRODUK
	// =====================================================

	err := database.DB.QueryRow(c, `
		SELECT COUNT(*)
		FROM "MsProduk"
	`).Scan(&totalProduk)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil total produk",
			"error":   err.Error(),
		})
		return
	}

	// =====================================================
	// PRODUK AKTIF
	// =====================================================

	err = database.DB.QueryRow(c, `
		SELECT COUNT(*)
		FROM "MsProduk"
		WHERE "Status" = true
	`).Scan(&totalProdukAktif)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil produk aktif",
			"error":   err.Error(),
		})
		return
	}

	// =====================================================
	// PRODUK NON AKTIF
	// =====================================================

	err = database.DB.QueryRow(c, `
		SELECT COUNT(*)
		FROM "MsProduk"
		WHERE "Status" = false
	`).Scan(&totalProdukNon)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil produk nonaktif",
			"error":   err.Error(),
		})
		return
	}

	// =====================================================
	// TOTAL USER
	// =====================================================

	err = database.DB.QueryRow(c, `
		SELECT COUNT(*)
		FROM "UserID"
	`).Scan(&totalUser)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil total user",
			"error":   err.Error(),
		})
		return
	}

	// =====================================================
	// USER AKTIF
	// =====================================================

	err = database.DB.QueryRow(c, `
		SELECT COUNT(*)
		FROM "UserID"
		WHERE "IsActive" = true
	`).Scan(&totalUserAktif)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil user aktif",
			"error":   err.Error(),
		})
		return
	}

	// =====================================================
	// USER NON AKTIF
	// =====================================================

	err = database.DB.QueryRow(c, `
		SELECT COUNT(*)
		FROM "UserID"
		WHERE "IsActive" = false
	`).Scan(&totalUserNon)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil user nonaktif",
			"error":   err.Error(),
		})
		return
	}

	// =====================================================
	// PENJUALAN HARI INI
	// =====================================================

	err = database.DB.QueryRow(c, `
		SELECT
			COALESCE(SUM("TotalHarga"), 0),
			COUNT(*)
		FROM "TrTransactionHdr"
		WHERE
			"Status" = 'SELESAI'
			AND "Tanggal" >= CURRENT_DATE
			AND "Tanggal" < CURRENT_DATE + INTERVAL '1 day'
	`).Scan(
		&totalPenjualanHariIni,
		&totalTransaksiHariIni,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil penjualan hari ini",
			"error":   err.Error(),
		})
		return
	}

	// =====================================================
	// PRODUK PER KATEGORI
	// =====================================================

	type CategoryData struct {
		Name  string `json:"name"`
		Value int64  `json:"value"`
	}

	categoryData := []CategoryData{}

	rows, err := database.DB.Query(c, `
		SELECT
			COALESCE(NULLIF("KategoriBarang", ''), 'Lainnya') AS "Kategori",
			COUNT(*) AS "Total"
		FROM "MsProduk"
		GROUP BY
			COALESCE(NULLIF("KategoriBarang", ''), 'Lainnya')
		ORDER BY "Total" DESC
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil kategori produk",
			"error":   err.Error(),
		})
		return
	}

	defer rows.Close()

	var totalKategori int64

	for rows.Next() {

		var item CategoryData

		err := rows.Scan(
			&item.Name,
			&item.Value,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca kategori produk",
				"error":   err.Error(),
			})
			return
		}

		totalKategori += item.Value

		categoryData = append(categoryData, item)
	}

	// =====================================================
	// UBAH MENJADI PERSENTASE
	// =====================================================

	if totalKategori > 0 {

		for i := range categoryData {

			categoryData[i].Value = int64(
				float64(categoryData[i].Value) /
					float64(totalKategori) *
					100,
			)
		}
	}

	// =====================================================
	// PRODUK TERBARU
	// =====================================================

	type ProductData struct {
		ID          int64      `json:"id"`
		KodeBarang  string     `json:"kodeBarang"`
		NamaBarang  string     `json:"namaBarang"`
		Kategori    string     `json:"category"`
		HargaJual   float64    `json:"hargaJual"`
		Status      bool       `json:"status"`
		WaktuDibuat *time.Time `json:"waktuDibuat"`
	}

	recentProducts := []ProductData{}

	productRows, err := database.DB.Query(c, `
		SELECT
			"ID",
			"KodeBarang",
			"NamaBarang",
			COALESCE("KategoriBarang", 'Lainnya'),
			"HargaJual",
			"Status",
			"WaktuDibuat"
		FROM "MsProduk"
		ORDER BY "WaktuDibuat" DESC
		LIMIT 5
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil produk terbaru",
			"error":   err.Error(),
		})
		return
	}

	defer productRows.Close()

	for productRows.Next() {

		var item ProductData

		err := productRows.Scan(
			&item.ID,
			&item.KodeBarang,
			&item.NamaBarang,
			&item.Kategori,
			&item.HargaJual,
			&item.Status,
			&item.WaktuDibuat,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca produk terbaru",
				"error":   err.Error(),
			})
			return
		}

		recentProducts = append(
			recentProducts,
			item,
		)
	}

	// =====================================================
	// PENJUALAN 7 HARI
	// =====================================================

	type SalesChart struct {
		Day   string  `json:"day"`
		Date  string  `json:"date"`
		Value float64 `json:"value"`
	}

	salesChart := []SalesChart{}

	chartRows, err := database.DB.Query(c, `
	SELECT
		TO_CHAR(d.tanggal, 'Dy') AS "Day",
		TO_CHAR(d.tanggal, 'YYYY-MM-DD') AS "Date",
		COALESCE(SUM(h."TotalHarga"), 0) AS "Value"
	FROM (
		SELECT generate_series(
			(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date - INTERVAL '6 days',
			(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::date,
			INTERVAL '1 day'
		)::date AS tanggal
	) d
	LEFT JOIN "TrTransactionHdr" h
		ON h."Tanggal" >= d.tanggal
		AND h."Tanggal" < d.tanggal + INTERVAL '1 day'
		AND h."Status" = 'SELESAI'
	GROUP BY d.tanggal
	ORDER BY d.tanggal
`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil chart penjualan",
			"error":   err.Error(),
		})
		return
	}

	defer chartRows.Close()

	for chartRows.Next() {

		var item SalesChart

		err := chartRows.Scan(
			&item.Day,
			&item.Date,
			&item.Value,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca chart penjualan",
				"error":   err.Error(),
			})
			return
		}

		// PostgreSQL:
		// Mon Tue Wed Thu Fri Sat Sun
		//
		// Ubah ke Indonesia.

		switch item.Day {
		case "Mon":
			item.Day = "Sen"
		case "Tue":
			item.Day = "Sel"
		case "Wed":
			item.Day = "Rab"
		case "Thu":
			item.Day = "Kam"
		case "Fri":
			item.Day = "Jum"
		case "Sat":
			item.Day = "Sab"
		case "Sun":
			item.Day = "Min"
		}

		salesChart = append(
			salesChart,
			item,
		)
	}

	// =====================================================
	// PRODUK TERLARIS
	// =====================================================

	type TopProduct struct {
		KodeBarang string  `json:"kodeBarang"`
		Name       string  `json:"name"`
		Category   string  `json:"category"`
		Sold       int64   `json:"sold"`
		Total      float64 `json:"total"`
	}

	topProducts := []TopProduct{}

	topProductRows, err := database.DB.Query(c, `
		SELECT
			d."KodeBarang",
			COALESCE(p."NamaBarang", d."KodeBarang") AS "NamaBarang",
			COALESCE(p."KategoriBarang", 'Lainnya') AS "Kategori",
			SUM(d."Qty") AS "Sold",
			COALESCE(SUM(d."Subtotal"), 0) AS "Total"
		FROM "TrTransactionDtl" d
		INNER JOIN "TrTransactionHdr" h
			ON h."NoTransaksi" = d."NoTransaksi"
		LEFT JOIN "MsProduk" p
			ON p."KodeBarang" = d."KodeBarang"
		WHERE
			h."Status" = 'SELESAI'
		GROUP BY
			d."KodeBarang",
			p."NamaBarang",
			p."KategoriBarang"
		ORDER BY
			SUM(d."Qty") DESC,
			SUM(d."Subtotal") DESC
		LIMIT 5
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil produk terlaris",
			"error":   err.Error(),
		})
		return
	}

	defer topProductRows.Close()

	for topProductRows.Next() {

		var item TopProduct

		err := topProductRows.Scan(
			&item.KodeBarang,
			&item.Name,
			&item.Category,
			&item.Sold,
			&item.Total,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca produk terlaris",
				"error":   err.Error(),
			})
			return
		}

		topProducts = append(
			topProducts,
			item,
		)
	}

	// =====================================================
	// TRANSAKSI TERBARU
	// =====================================================

	type RecentTransaction struct {
		Invoice  string    `json:"invoice"`
		Customer string    `json:"customer"`
		Cashier  string    `json:"cashier"`
		Total    float64   `json:"total"`
		Status   string    `json:"status"`
		Time     string    `json:"time"`
		Tanggal  time.Time `json:"tanggal"`
	}

	recentTransactions := []RecentTransaction{}

	transactionRows, err := database.DB.Query(c, `
		SELECT
			"NoTransaksi",
			'Walk In Customer' AS "Customer",
			"UserId",
			"TotalHarga",
			"Status",
			TO_CHAR("Tanggal", 'HH24:MI') AS "Time",
			"Tanggal"
		FROM "TrTransactionHdr"
		ORDER BY
			"Tanggal" DESC
		LIMIT 5
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil transaksi terbaru",
			"error":   err.Error(),
		})
		return
	}

	defer transactionRows.Close()

	for transactionRows.Next() {

		var item RecentTransaction

		err := transactionRows.Scan(
			&item.Invoice,
			&item.Customer,
			&item.Cashier,
			&item.Total,
			&item.Status,
			&item.Time,
			&item.Tanggal,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca transaksi terbaru",
				"error":   err.Error(),
			})
			return
		}

		recentTransactions = append(
			recentTransactions,
			item,
		)
	}

	// =====================================================
	// RESPONSE
	// =====================================================

	c.JSON(http.StatusOK, gin.H{

		"success": true,

		"data": gin.H{

			// =================================================
			// SUMMARY
			// =================================================

			"summary": gin.H{

				// Total penjualan HARI INI
				"totalPenjualan": totalPenjualanHariIni,

				// Total transaksi HARI INI
				"totalTransaksi": totalTransaksiHariIni,

				"totalProduk": totalProduk,

				// Customer belum ada tabel customer
				"totalCustomer": 0,

				// Stok belum ada di MsProduk
				"produkStokRendah": 0,
			},

			// =================================================
			// PRODUK
			// =================================================

			"produk": gin.H{

				"total": totalProduk,

				"aktif": totalProdukAktif,

				"nonaktif": totalProdukNon,

				"perKategori": categoryData,

				"terbaru": recentProducts,
			},

			// =================================================
			// USER
			// =================================================

			"user": gin.H{

				"total": totalUser,

				"aktif": totalUserAktif,

				"nonaktif": totalUserNon,
			},

			// =================================================
			// PENJUALAN
			// =================================================

			"penjualan": gin.H{

				// Penjualan hari ini
				"hariIni": gin.H{

					"transaksi": totalTransaksiHariIni,

					"omzet": totalPenjualanHariIni,
				},

				// Bulan berjalan
				"bulanIni": gin.H{

					"transaksi": 0,

					"omzet": 0,
				},

				// Chart 7 hari
				"chart": salesChart,
			},

			// =================================================
			// KATEGORI
			// =================================================

			"kategori": categoryData,

			// =================================================
			// PRODUK TERLARIS
			// =================================================

			"produkTerlaris": topProducts,

			// =================================================
			// TRANSAKSI TERBARU
			// =================================================

			"transaksiTerbaru": recentTransactions,
		},
	})
}
