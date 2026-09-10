// package main

// import (
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// )

// func main() {
// 	r := gin.Default()

// 	r.GET("/api/hello", func(c *gin.Context) {
// 		c.JSON(http.StatusOK, gin.H{
// 			"success": true,
// 			"message": "Hello from Go Backend",
// 		})
// 	})

// 	r.Run(":8080")
// }

package main

import (
	"log"
	"net/http"

	"github.com/euwinto/POS_Next_Golang/backend/database"
	"github.com/euwinto/POS_Next_Golang/backend/handlers"
	"github.com/euwinto/POS_Next_Golang/backend/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Connect PostgreSQL
	database.Connect()

	// Gin
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.Static("/uploads", "./uploads")

	// PUBLIC
	r.GET("/api/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Hello from Go Backend",
		})
	})

	r.GET("/api/dashboard", handlers.GetDashboard)

	// Auth
	r.POST("/api/auth/login", handlers.Login)
	r.POST("/api/auth/logout", middleware.AuthMiddleware(), handlers.Logout)
	r.POST(
		"/api/auth/reset-password",
		middleware.AuthMiddleware(),
		handlers.ResetPassword,
	)
	r.POST(
		"/api/auth/change-password",
		middleware.AuthMiddleware(),
		handlers.ChangePassword,
	)

	// Menu
	r.GET(
		"/api/menu/sidebar",
		middleware.AuthMiddleware(),
		handlers.GetSidebarMenu,
	)

	// Products
	// r.GET("/api/produk", handlers.GetProducts)
	// r.POST("/api/produk", handlers.CreateProduct)
	// view
	r.GET(
		"/api/produk",
		middleware.AuthMiddleware(),
		middleware.Permission("PRODUK", "view"),
		handlers.GetProducts,
	)

	// add
	r.POST(
		"/api/produk",
		middleware.AuthMiddleware(),
		middleware.Permission("PRODUK", "add"),
		handlers.CreateProduct,
	)

	// KATEGORI
	// View Kategori
	r.GET(
		"/api/kategori",
		middleware.AuthMiddleware(),
		middleware.Permission("KATEGORI", "view"),
		handlers.GetKategori,
	)

	// Add Kategori
	r.POST(
		"/api/kategori",
		middleware.AuthMiddleware(),
		middleware.Permission("KATEGORI", "add"),
		handlers.CreateKategori,
	)

	// Menu
	r.GET(
		"/api/menu",
		middleware.AuthMiddleware(),
		middleware.Permission("MENU", "view"),
		handlers.GetMenu,
	)

	// Role
	// View Role
	r.GET(
		"/api/role",
		middleware.AuthMiddleware(),
		middleware.Permission("ROLE", "view"),
		handlers.GetRole,
	)

	// Add Role
	r.POST(
		"/api/role",
		middleware.AuthMiddleware(),
		middleware.Permission("ROLE", "add"),
		handlers.CreateRole,
	)

	// Role Menu
	// View Role Menu
	r.GET(
		"/api/role-menu",
		middleware.AuthMiddleware(),
		middleware.Permission("ROLEMENU", "view"),
		handlers.GetRoleMenu,
	)

	// Add / Save Role Menu
	r.POST(
		"/api/role-menu",
		middleware.AuthMiddleware(),
		middleware.Permission("ROLEMENU", "add"),
		handlers.CreateRoleMenu,
	)

	// User
	// View User
	r.GET(
		"/api/user",
		middleware.AuthMiddleware(),
		middleware.Permission("USER", "view"),
		handlers.GetUsers,
	)

	// Add User
	r.POST(
		"/api/user",
		middleware.AuthMiddleware(),
		middleware.Permission("USER", "add"),
		handlers.CreateUser,
	)

	// Edit User
	r.PUT(
		"/api/user",
		middleware.AuthMiddleware(),
		middleware.Permission("USER", "edit"),
		handlers.UpdateUser,
	)

	// Change User Status
	r.POST(
		"/api/user/status",
		middleware.AuthMiddleware(),
		middleware.Permission("USER", "edit"),
		handlers.UpdateUserStatus,
	)

	r.GET(
		"/api/user/profile",
		middleware.AuthMiddleware(),
		handlers.GetMyProfile,
	)

	r.POST(
		"/api/user/profile/photo",
		middleware.AuthMiddleware(),
		handlers.UploadProfilePhoto,
	)

	// TRANSACTION
	transaction := r.Group(
		"/api/transaction",
	)

	// ---------------------------------------------------------
	// Transaction - Kategori
	// ---------------------------------------------------------

	transaction.GET(
		"/kategori",
		middleware.AuthMiddleware(),
		middleware.Permission("POS", "view"),
		handlers.GetTransactionKategori,
	)

	// ---------------------------------------------------------
	// Transaction - Produk
	// ---------------------------------------------------------

	transaction.GET(
		"/produk",
		middleware.AuthMiddleware(),
		middleware.Permission("POS", "view"),
		handlers.GetTransactionProducts,
	)

	// ---------------------------------------------------------
	// Transaction - Create
	// ---------------------------------------------------------

	transaction.POST(
		"",
		middleware.AuthMiddleware(),
		middleware.Permission("POS", "add"),
		handlers.CreateTransaction,
	)

	// ---------------------------------------------------------
	// Transaction - List
	// ---------------------------------------------------------

	transaction.GET(
		"/list",
		middleware.AuthMiddleware(),
		middleware.Permission("LISTTRANSAKSI", "view"),
		handlers.GetTransactionlist,
	)

	// ---------------------------------------------------------
	// Transaction - Detail
	// ---------------------------------------------------------

	transaction.GET(
		"/:noTransaksi",
		middleware.AuthMiddleware(),
		middleware.Permission("POS", "view"),
		handlers.GetTransactionByNo,
	)

	transaction.GET(
		"/:noTransaksi/detail",
		middleware.AuthMiddleware(),
		middleware.Permission("LISTTRANSAKSI", "view"),
		handlers.GetTransactionListByNo,
	)

	// {
	// 	transaction.GET("/kategori", handlers.GetTransactionKategori)
	// 	transaction.GET("/produk", handlers.GetTransactionProducts)
	// 	transaction.POST("", middleware.AuthMiddleware(), handlers.CreateTransaction)
	// 	transaction.GET("/list", handlers.GetTransactionlist)
	// 	transaction.GET("/:noTransaksi", middleware.AuthMiddleware(), handlers.GetTransactionByNo)
	// 	transaction.GET("/:noTransaksi/detail", handlers.GetTransactionListByNo)
	// 	transaction.PUT("/:noTransaksi/void", handlers.VoidTransaction)
	// }

	transaction.PUT(
		"/:noTransaksi/void",
		middleware.AuthMiddleware(),
		middleware.Permission("LISTTRANSAKSI", "delete"),
		handlers.VoidTransaction,
	)

	// =========================================================
	// START SERVER
	// =========================================================

	// Start server
	// r.Run(":8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
