package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		// =========================
		// AMBIL AUTHORIZATION
		// =========================

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Token tidak ditemukan",
			})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)

		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Format token tidak valid",
			})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// =========================
		// JWT SECRET
		// =========================

		secret := os.Getenv("JWT_SECRET")

		if secret == "" {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "JWT secret belum dikonfigurasi",
			})
			c.Abort()
			return
		}

		// =========================
		// PARSE TOKEN
		// =========================

		token, err := jwt.Parse(
			tokenString,
			func(token *jwt.Token) (interface{}, error) {

				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrTokenSignatureInvalid
				}

				return []byte(secret), nil
			},
		)

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Token tidak valid atau sudah expired",
			})
			c.Abort()
			return
		}

		// =========================
		// CLAIMS
		// =========================

		claims, ok := token.Claims.(jwt.MapClaims)

		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Claims token tidak valid",
			})
			c.Abort()
			return
		}

		// =========================
		// USERNAME
		// =========================

		username, ok := claims["username"].(string)

		if !ok || username == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "User tidak valid atau belum login",
			})
			c.Abort()
			return
		}

		// =========================
		// ROLE
		// =========================

		role, ok := claims["role"].(string)

		if !ok || role == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Role user tidak ditemukan di token",
			})
			c.Abort()
			return
		}

		// =========================
		// SIMPAN KE GIN CONTEXT
		// =========================

		c.Set("username", username)
		c.Set("role", role)
		// Optional
		if nama, ok := claims["nama"].(string); ok {
			c.Set("nama", nama)
		}

		// if role, ok := claims["role"].(string); ok {
		// 	c.Set("role", role)
		// }

		if sessionToken, ok := claims["sessionToken"].(string); ok {
			c.Set("sessionToken", sessionToken)
		}

		c.Next()
	}
}
