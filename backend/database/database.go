package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func Connect() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		user,
		password,
		host,
		port,
		dbname,
	)

	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Fatal("Database config error:", err)
	}

	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = time.Hour

	DB, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatal("Database connection error:", err)
	}

	if err := DB.Ping(context.Background()); err != nil {
		log.Fatal("Database ping error:", err)
	}

	log.Println("PostgreSQL connected")
}
