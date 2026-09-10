package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func GetTransactionKategori(c *gin.Context) {

	aktif := c.Query("aktif")

	// Kalau aktif=1, hanya ambil kategori aktif
	query := `
		SELECT
			"KodeKategori",
			"NamaKategori"
		FROM "MsKategori"
	`

	if aktif == "1" {
		query += `
			WHERE "Status" = true
		`
	}

	query += `
		ORDER BY "NamaKategori" ASC
	`

	rows, err := database.DB.Query(c, query)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil data kategori",
			"error":   err.Error(),
			"data":    []any{},
		})
		return
	}

	defer rows.Close()

	data := []gin.H{}

	for rows.Next() {

		var (
			kodeKategori string
			namaKategori string
		)

		err := rows.Scan(
			&kodeKategori,
			&namaKategori,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca data kategori",
				"error":   err.Error(),
				"data":    []any{},
			})
			return
		}

		data = append(data, gin.H{
			"KodeKategori": kodeKategori,
			"NamaKategori": namaKategori,
		})
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membaca data kategori",
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
// GET PRODUK TRANSAKSI
// =========================
func GetTransactionProducts(c *gin.Context) {

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

	args := []any{}

	// Jika ?aktif=1 maka hanya produk aktif
	if aktif == "1" {
		query += ` WHERE "Status" = true`
	}

	query += ` ORDER BY "NamaBarang" ASC`

	rows, err := database.DB.Query(c, query, args...)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil data produk",
			"error":   err.Error(),
			"data":    []any{},
		})
		return
	}

	defer rows.Close()

	data := []gin.H{}

	for rows.Next() {

		var (
			id             int64
			kodeBarang     string
			namaBarang     string
			hargaJual      float64
			status         bool
			kategoriBarang string
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
				"message": "Gagal membaca data produk",
				"error":   err.Error(),
				"data":    []any{},
			})
			return
		}

		data = append(data, gin.H{
			"ID":             id,
			"KodeBarang":     kodeBarang,
			"NamaBarang":     namaBarang,
			"HargaJual":      hargaJual,
			"Status":         status,
			"KategoriBarang": kategoriBarang,
		})
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membaca data produk",
			"error":   err.Error(),
			"data":    []any{},
		})
		return
	}

	c.JSON(http.StatusOK, data)
}

// =========================
// CREATE TRANSACTION
// =========================
func CreateTransaction(c *gin.Context) {
	username := c.GetString("username")
	if username == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User tidak valid atau belum login",
		})
		return
	}
	var body struct {
		Cart []struct {
			KodeBarang string  `json:"KodeBarang"`
			NamaBarang string  `json:"NamaBarang"`
			HargaJual  float64 `json:"HargaJual"`
			Qty        int     `json:"qty"`
		} `json:"cart"`

		Total     float64 `json:"total"`
		Bayar     float64 `json:"bayar"`
		Kembalian float64 `json:"kembalian"`
		Payment   string  `json:"payment"`
	}

	// =========================
	// BIND JSON
	// =========================

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format data transaksi tidak valid",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// VALIDASI CART
	// =========================

	if len(body.Cart) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Cart masih kosong",
		})
		return
	}

	// =========================
	// VALIDASI PEMBAYARAN
	// =========================

	if body.Bayar < body.Total {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Uang bayar kurang",
		})
		return
	}

	// =========================
	// WAKTU TRANSAKSI
	// =========================

	tanggal := time.Now()

	tahun := tanggal.Format("2006")
	bulan := tanggal.Format("01")
	hari := tanggal.Format("02")

	prefix := "TRX" + tahun + bulan + hari

	// =========================
	// BEGIN TRANSACTION
	// =========================

	tx, err := database.DB.Begin(c)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal memulai transaksi database",
			"error":   err.Error(),
		})
		return
	}

	defer tx.Rollback(c)

	// =========================
	// GENERATE NO TRANSAKSI
	// =========================

	var lastNo *string

	err = tx.QueryRow(c, `
		SELECT "NoTransaksi"
		FROM "TrTransactionHdr"
		WHERE "NoTransaksi" LIKE $1
		ORDER BY "ID" DESC
		LIMIT 1
	`, prefix+"%").Scan(&lastNo)

	// if err != nil {
	// 	// Kalau belum ada transaksi hari ini
	// 	lastNo = nil
	// }

	if err != nil && err != pgx.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil nomor transaksi terakhir",
			"error":   err.Error(),
		})
		return
	}

	noTransaksi := prefix + "0001"

	if lastNo != nil && *lastNo != "" {
		lastNumber := strings.TrimPrefix(*lastNo, prefix)
		urut, err := strconv.Atoi(lastNumber)
		if err == nil {
			noTransaksi = fmt.Sprintf(
				"%s%04d",
				prefix,
				urut+1,
			)
		}
	}

	// =========================
	// USER
	// =========================
	//
	// Sementara mengikuti API lama:
	// UserId = ADMIN
	// DibuatOleh = ADMIN
	//
	// Nanti bisa kita ambil dari JWT/token login.
	//

	userID := username

	// =========================
	// INSERT HEADER
	// =========================

	_, err = tx.Exec(c, `
		INSERT INTO "TrTransactionHdr"
		(
			"NoTransaksi",
			"Tanggal",
			"UserId",
			"TotalHarga",
			"Bayar",
			"Kembalian",
			"JenisPembayaran",
			"Status",
			"WaktuDibuat",
			"DibuatOleh"
		)
		VALUES
		(
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
			$9,
			$10
		)
	`,
		noTransaksi,
		tanggal,
		userID,
		body.Total,
		body.Bayar,
		body.Kembalian,
		body.Payment,
		"SELESAI",
		tanggal,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menyimpan header transaksi",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// INSERT DETAIL
	// =========================

	for _, item := range body.Cart {

		if item.KodeBarang == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Kode barang tidak boleh kosong",
			})
			return
		}

		if item.Qty <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Qty barang harus lebih dari 0",
			})
			return
		}

		subtotal := float64(item.Qty) * item.HargaJual

		_, err = tx.Exec(c, `
			INSERT INTO "TrTransactionDtl"
			(
				"NoTransaksi",
				"KodeBarang",
				"Qty",
				"Harga",
				"Subtotal",
				"WaktuDibuat",
				"DibuatOleh"
			)
			VALUES
			(
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7
			)
		`,
			noTransaksi,
			item.KodeBarang,
			item.Qty,
			item.HargaJual,
			subtotal,
			tanggal,
			userID,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal menyimpan detail transaksi",
				"error":   err.Error(),
			})
			return
		}
	}

	// =========================
	// COMMIT
	// =========================

	if err := tx.Commit(c); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal commit transaksi",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// SUCCESS
	// =========================

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"noTransaksi": noTransaksi,
		"message":     "Transaksi berhasil disimpan",
	})
}

// =========================
// GET TRANSACTION BY NO
// =========================
func GetTransactionByNo(c *gin.Context) {

	noTransaksi := c.Param("noTransaksi")

	if noTransaksi == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "No transaksi wajib diisi",
			"data":    nil,
		})
		return
	}

	// =========================
	// HEADER
	// =========================

	var header struct {
		ID              int64
		NoTransaksi     string
		Tanggal         time.Time
		UserID          string
		TotalHarga      float64
		Bayar           float64
		Kembalian       float64
		JenisPembayaran string
		Status          string
		Nama            string
	}

	err := database.DB.QueryRow(c, `
		SELECT
			a."ID",
			a."NoTransaksi",
			a."Tanggal",
			COALESCE(a."UserId", ''),
			COALESCE(a."TotalHarga", 0),
			COALESCE(a."Bayar", 0),
			COALESCE(a."Kembalian", 0),
			COALESCE(a."JenisPembayaran", ''),
			COALESCE(a."Status", ''),
			COALESCE(b."Nama", '')
		FROM "TrTransactionHdr" a
		LEFT JOIN "UserID" b ON a."UserId" = b."Username"
		WHERE a."NoTransaksi" = $1
	`, noTransaksi).Scan(
		&header.ID,
		&header.NoTransaksi,
		&header.Tanggal,
		&header.UserID,
		&header.TotalHarga,
		&header.Bayar,
		&header.Kembalian,
		&header.JenisPembayaran,
		&header.Status,
		&header.Nama,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Transaksi tidak ditemukan",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// DETAIL
	// =========================

	rows, err := database.DB.Query(c, `
		SELECT
			d."KodeBarang",
			COALESCE(p."NamaBarang", ''),
			d."Qty",
			COALESCE(d."Harga", 0),
			COALESCE(d."Subtotal", 0)
		FROM "TrTransactionDtl" d

		LEFT JOIN "MsProduk" p
			ON p."KodeBarang" = d."KodeBarang"

		WHERE d."NoTransaksi" = $1

		ORDER BY d."ID" ASC
	`, noTransaksi)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil detail transaksi",
			"error":   err.Error(),
		})
		return
	}

	defer rows.Close()

	detail := []gin.H{}

	for rows.Next() {

		var (
			kodeBarang string
			namaBarang string
			qty        int
			harga      float64
			subtotal   float64
		)

		err := rows.Scan(
			&kodeBarang,
			&namaBarang,
			&qty,
			&harga,
			&subtotal,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca detail transaksi",
				"error":   err.Error(),
			})
			return
		}

		detail = append(detail, gin.H{
			"KodeBarang": kodeBarang,
			"NamaBarang": namaBarang,
			"Qty":        qty,
			"Harga":      harga,
			"Subtotal":   subtotal,
		})
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membaca detail transaksi",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// RESPONSE
	// =========================

	c.JSON(http.StatusOK, gin.H{
		"success": true,

		"header": gin.H{
			"ID":              header.ID,
			"NoTransaksi":     header.NoTransaksi,
			"Tanggal":         header.Tanggal,
			"UserId":          header.UserID,
			"TotalHarga":      header.TotalHarga,
			"Bayar":           header.Bayar,
			"Kembalian":       header.Kembalian,
			"JenisPembayaran": header.JenisPembayaran,
			"Status":          header.Status,
			"Nama":            header.Nama,
		},

		"detail": detail,
	})
}

func GetTransactionlist(c *gin.Context) {

	rows, err := database.DB.Query(c, `
		SELECT
			"NoTransaksi",
			"Tanggal",
			"JenisPembayaran",
			COALESCE("TotalHarga", 0),
			COALESCE("Bayar", 0),
			COALESCE("Kembalian", 0),
			"Status"
		FROM "TrTransactionHdr"
		ORDER BY "ID" DESC
	`)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil data transaksi",
			"error":   err.Error(),
		})
		return
	}

	defer rows.Close()

	data := []gin.H{}

	for rows.Next() {

		var (
			noTransaksi     string
			tanggal         time.Time
			jenisPembayaran string
			totalHarga      float64
			bayar           float64
			kembalian       float64
			status          string
		)

		err := rows.Scan(
			&noTransaksi,
			&tanggal,
			&jenisPembayaran,
			&totalHarga,
			&bayar,
			&kembalian,
			&status,
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca data transaksi",
				"error":   err.Error(),
			})
			return
		}

		data = append(data, gin.H{
			"NoTransaksi":     noTransaksi,
			"Tanggal":         tanggal,
			"JenisPembayaran": jenisPembayaran,
			"TotalHarga":      totalHarga,
			"Bayar":           bayar,
			"Kembalian":       kembalian,
			"Status":          status,
		})
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal membaca data transaksi",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}

func GetTransactionListByNo(c *gin.Context) {

	noTransaksi := c.Param("noTransaksi")

	if noTransaksi == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "No transaksi wajib diisi",
		})
		return
	}

	// =========================
	// HEADER
	// =========================

	var header struct {
		ID              int64
		NoTransaksi     string
		Tanggal         time.Time
		UserID          string
		TotalHarga      float64
		Bayar           float64
		Kembalian       float64
		JenisPembayaran string
		Status          string
		Nama            string
	}

	err := database.DB.QueryRow(c, `
		SELECT
			a."ID",
			a."NoTransaksi",
			a."Tanggal",
			COALESCE(a."UserId", ''),
			COALESCE(a."TotalHarga", 0),
			COALESCE(a."Bayar", 0),
			COALESCE(a."Kembalian", 0),
			COALESCE(a."JenisPembayaran", ''),
			COALESCE(a."Status", ''),
			COALESCE(b."Nama", '')
		FROM "TrTransactionHdr" a
		LEFT JOIN "UserID" b ON a."UserId" = b."Username"
		WHERE a."NoTransaksi" = $1
	`, noTransaksi).Scan(
		&header.ID,
		&header.NoTransaksi,
		&header.Tanggal,
		&header.UserID,
		&header.TotalHarga,
		&header.Bayar,
		&header.Kembalian,
		&header.JenisPembayaran,
		&header.Status,
		&header.Nama,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Transaksi tidak ditemukan",
		})
		return
	}

	// =========================
	// DETAIL
	// =========================

	rows, err := database.DB.Query(c, `
		SELECT
			d."KodeBarang",
			COALESCE(p."NamaBarang", ''),
			d."Qty",
			COALESCE(d."Harga", 0),
			COALESCE(d."Subtotal", 0)
		FROM "TrTransactionDtl" d
		LEFT JOIN "MsProduk" p
			ON p."KodeBarang" = d."KodeBarang"
		WHERE d."NoTransaksi" = $1
		ORDER BY d."ID" ASC
	`, noTransaksi)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil detail transaksi",
			"error":   err.Error(),
		})
		return
	}

	defer rows.Close()

	detail := []gin.H{}

	for rows.Next() {

		var (
			kodeBarang string
			namaBarang string
			qty        int
			harga      float64
			subtotal   float64
		)

		if err := rows.Scan(
			&kodeBarang,
			&namaBarang,
			&qty,
			&harga,
			&subtotal,
		); err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal membaca detail transaksi",
				"error":   err.Error(),
			})
			return
		}

		detail = append(detail, gin.H{
			"KodeBarang": kodeBarang,
			"NamaBarang": namaBarang,
			"Qty":        qty,
			"Harga":      harga,
			"Subtotal":   subtotal,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"header": gin.H{
			"ID":              header.ID,
			"NoTransaksi":     header.NoTransaksi,
			"Tanggal":         header.Tanggal,
			"UserId":          header.UserID,
			"TotalHarga":      header.TotalHarga,
			"Bayar":           header.Bayar,
			"Kembalian":       header.Kembalian,
			"JenisPembayaran": header.JenisPembayaran,
			"Status":          header.Status,
		},
		"detail": detail,
	})
}

func VoidTransaction(c *gin.Context) {

	noTransaksi := c.Param("noTransaksi")

	if noTransaksi == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "No transaksi wajib diisi",
		})
		return
	}

	// =========================
	// CEK TRANSAKSI
	// =========================

	var status string

	err := database.DB.QueryRow(
		c,
		`
		SELECT COALESCE("Status", '')
		FROM "TrTransactionHdr"
		WHERE "NoTransaksi" = $1
		`,
		noTransaksi,
	).Scan(&status)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Transaksi tidak ditemukan",
		})
		return
	}

	// =========================
	// CEK SUDAH VOID
	// =========================

	if status == "VOID" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Transaksi sudah VOID",
		})
		return
	}

	// =========================
	// UPDATE VOID
	// =========================

	_, err = database.DB.Exec(
		c,
		`
		UPDATE "TrTransactionHdr"
		SET
			"Status" = 'VOID',
			"WaktuDiubah" = NOW()
		WHERE "NoTransaksi" = $1
		`,
		noTransaksi,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal melakukan VOID transaksi",
			"error":   err.Error(),
		})
		return
	}

	// =========================
	// SUCCESS
	// =========================

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Transaksi berhasil di-VOID",
	})
}
