package main

import (
	// "net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type PieceType = int

const (
	King PieceType = iota
	Queen
	Bishop
	Knight
	Rook
	Pawn
)

type Color = int

const (
	White Color = iota
	Black
)

type Piece struct {
	PieceType PieceType `json:"piece_type"`
	X int				`json:"x"`
	Y int				`json:"y"`
	Color Color			`json:"color"`
}

type Player struct {
	UserName string		`json:"user_name"`
	Color Color			`json:"color"`
}

type Board struct {
	Pieces []Piece		`json:"pieces"`
	EatenPieces []Piece	`json:"eaten_pieces"`
}

func init_board() *Board {
	b := Board {
		Pieces: []Piece {
			{PieceType: Rook, X: 0, Y: 0, Color: White},
			{PieceType: Knight, X: 1, Y: 0, Color: White},
			{PieceType: Bishop, X: 2, Y: 0, Color: White},
			{PieceType: Queen, X: 3, Y: 0, Color: White},
			{PieceType: King, X: 4, Y: 0, Color: White},
			{PieceType: Bishop, X: 5, Y: 0, Color: White},
			{PieceType: Knight, X: 6, Y: 0, Color: White},
			{PieceType: Rook, X: 7, Y: 0, Color: White},

			{PieceType: Pawn, X: 0, Y: 1, Color: White},
			{PieceType: Pawn, X: 1, Y: 1, Color: White},
			{PieceType: Pawn, X: 2, Y: 1, Color: White},
			{PieceType: Pawn, X: 3, Y: 1, Color: White},
			{PieceType: Pawn, X: 4, Y: 1, Color: White},
			{PieceType: Pawn, X: 5, Y: 1, Color: White},
			{PieceType: Pawn, X: 6, Y: 1, Color: White},
			{PieceType: Pawn, X: 7, Y: 1, Color: White},

			{PieceType: Rook, X: 0, Y: 0, Color: Black},
			{PieceType: Knight, X: 1, Y: 0, Color: Black},
			{PieceType: Bishop, X: 2, Y: 0, Color: Black},
			{PieceType: Queen, X: 3, Y: 0, Color: Black},
			{PieceType: King, X: 4, Y: 0, Color: Black},
			{PieceType: Bishop, X: 5, Y: 0, Color: Black},
			{PieceType: Knight, X: 6, Y: 0, Color: Black},
			{PieceType: Rook, X: 7, Y: 0, Color: Black},

			{PieceType: Pawn, X: 0, Y: 6, Color: Black},
			{PieceType: Pawn, X: 1, Y: 6, Color: Black},
			{PieceType: Pawn, X: 2, Y: 6, Color: Black},
			{PieceType: Pawn, X: 3, Y: 6, Color: Black},
			{PieceType: Pawn, X: 4, Y: 6, Color: Black},
			{PieceType: Pawn, X: 5, Y: 6, Color: Black},
			{PieceType: Pawn, X: 6, Y: 6, Color: Black},
			{PieceType: Pawn, X: 7, Y: 6, Color: Black},
		},
	}
	return &b
}

type Game struct {
	Board Board			`json:"board"`
	Turn Color			`json:"color"`
	Players [2]Player	`json:"players"`
}

var games = []Game{}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())

	e.Static("/styles", "styles")
	e.Static("/media", "media")
	e.Static("/fonts", "fonts")
	e.Static("/js", "js")

	e.GET("/", index)

	// e.POST("/api/create_game/:hostname", create_game)

	e.Logger.Fatal(e.Start(":42069"))
}

func index(c echo.Context) error {
	return c.File("views/index.html")
}

// func create_game(c echo.Context) error {
// 	hp := Player {
// 		UserName: c.Param("hostname"),
// 		Color: White,
// 	}
// 
// 	b := init_board()
// 
// 	g := Game {
// 		Board: *b,
// 		Players: [2]Player {
// 			hp,
// 		},
// 	}
// 
// 	games = append(games, g)
// 
// 	return c.JSON(http.StatusOK, &g)
// }

// func connect_to_game(c echo.Context) error {
// 	index := strconv.Atoi(c.Params("id"))
// 	if index < 0 || index >= game.len() {
// 		return c.JSON(400, "fuck")
// 	}
// 
// 	game = remove(game, index)
// 	return c.Redirect(http.StatusRedirect, "/", nil)
// }
