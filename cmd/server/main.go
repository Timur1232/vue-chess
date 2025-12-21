package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type PieceType = int

const (
	None PieceType = iota
	King
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
	PieceType PieceType `json:"pieceType"`
	Color     Color     `json:"color"`
}

type Player struct {
	Name  string `json:"name"`
	Color Color  `json:"color"`
}

type Board struct {
	Pieces [][]Piece `json:"pieces"`
}

type GameInfo struct {
	GameID       uint    `json:"gameId"`
	HostPlayer   Player  `json:"hostPlayer"`
	SecondPlayer *Player `json:"secondPlayer"`
	Turn         Color   `json:"turn"`
}

type Games struct {
	GameInfos []GameInfo
	Boards    []Board
}

var games Games
var nextGameID uint = 1

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())

	api := e.Group("/api")
	api.GET("/games", GetGames)
	api.POST("/create", CreateGame)
	api.POST("/connect/:id", ConnectGame)
	api.POST("/move", MakeMove)
	api.GET("/game/:id", GetGame)

	e.Static("/static", "./static")

	e.GET("/*", func(c echo.Context) error {
		return c.File("./static/views/index.html")
	})

	e.Logger.Fatal(e.Start(":42069"))
}

func GetGames(c echo.Context) error {
	return c.JSON(http.StatusOK, games.GameInfos)
}

func CreateGame(c echo.Context) error {
	var req struct {
		PlayerName string `json:"playerName"`
		Color      Color  `json:"color"`
	}
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	gameID := nextGameID
	nextGameID++

	board := createInitialBoard()

	hostPlayer := Player{
		Name:  req.PlayerName,
		Color: req.Color,
	}

	gameInfo := GameInfo{
		GameID:       gameID,
		HostPlayer:   hostPlayer,
		SecondPlayer: nil,
		Turn:         White,
	}

	games.GameInfos = append(games.GameInfos, gameInfo)
	games.Boards = append(games.Boards, board)

	return c.JSON(http.StatusOK, map[string]any{
		"gameInfo": gameInfo,
		"board":    board,
	})
}

func ConnectGame(c echo.Context) error {
	gameID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.String(http.StatusBadRequest, "game id is required")
	}

	var req struct {
		PlayerName string `json:"playerName"`
	}

	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	for i, game := range games.GameInfos {
		if game.GameID == uint(gameID) {
			if game.SecondPlayer != nil {
				return c.String(http.StatusBadRequest, "game is full")
			}

			var secondPlayerColor Color
			if game.HostPlayer.Color == White {
				secondPlayerColor = Black
			} else {
				secondPlayerColor = White
			}

			secondPlayer := Player{
				Name:  req.PlayerName,
				Color: secondPlayerColor,
			}

			games.GameInfos[i].SecondPlayer = &secondPlayer

			return c.JSON(http.StatusOK, map[string]any{
				"gameInfo": games.GameInfos[i],
				"board":    games.Boards[i],
			})
		}
	}

	return c.String(http.StatusNotFound, "game not found")
}

func MakeMove(c echo.Context) error {
	type Position struct {
		Row int `json:"row"`
		Col int `json:"col"`
	}

	var req struct {
		GameID uint     `json:"gameId"`
		From   Position `json:"from"`
		To     Position `json:"to"`
	}

	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	for i, game := range games.GameInfos {
		if game.GameID == req.GameID {
			if req.From.Row < 0 || req.From.Row >= 8 || req.From.Col < 0 || req.From.Col >= 8 {
				return c.String(http.StatusBadRequest, "invalid from position")
			}
			if req.To.Row < 0 || req.To.Row >= 8 || req.To.Col < 0 || req.To.Col >= 8 {
				return c.String(http.StatusBadRequest, "invalid to position")
			}

			piece := games.Boards[i].Pieces[req.From.Row][req.From.Col]
			games.Boards[i].Pieces[req.From.Row][req.From.Col] = Piece{
				PieceType: None,
			}
			games.Boards[i].Pieces[req.To.Row][req.To.Col] = piece

			games.GameInfos[i].Turn = 1 - games.GameInfos[i].Turn

			return c.JSON(http.StatusOK, map[string]any{
				"board":    games.Boards[i],
				"gameInfo": games.GameInfos[i],
			})
		}
	}

	return c.String(http.StatusNotFound, "game not found")
}

func GetGame(c echo.Context) error {
	gameID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.String(http.StatusBadRequest, "game id incorrect")
	}

	for i, game := range games.GameInfos {
		if game.GameID == uint(gameID) {
			return c.JSON(http.StatusOK, map[string]any{
				"gameInfo": games.GameInfos[i],
				"board":    games.Boards[i],
			})
		}
	}

	return c.String(http.StatusNotFound, "game not found")
}

func createInitialBoard() Board {
	board := Board{
		Pieces: make([][]Piece, 8),
	}

	for i := range 8 {
		board.Pieces[i] = make([]Piece, 8)
	}

	board.Pieces[0][0] = Piece{PieceType: Rook, Color: Black}
	board.Pieces[0][1] = Piece{PieceType: Knight, Color: Black}
	board.Pieces[0][2] = Piece{PieceType: Bishop, Color: Black}
	board.Pieces[0][3] = Piece{PieceType: Queen, Color: Black}
	board.Pieces[0][4] = Piece{PieceType: King, Color: Black}
	board.Pieces[0][5] = Piece{PieceType: Bishop, Color: Black}
	board.Pieces[0][6] = Piece{PieceType: Knight, Color: Black}
	board.Pieces[0][7] = Piece{PieceType: Rook, Color: Black}

	for i := range 8 {
		board.Pieces[1][i] = Piece{PieceType: Pawn, Color: Black}
	}

	for i := range 8 {
		board.Pieces[6][i] = Piece{PieceType: Pawn, Color: White}
	}

	board.Pieces[7][0] = Piece{PieceType: Rook, Color: White}
	board.Pieces[7][1] = Piece{PieceType: Knight, Color: White}
	board.Pieces[7][2] = Piece{PieceType: Bishop, Color: White}
	board.Pieces[7][3] = Piece{PieceType: Queen, Color: White}
	board.Pieces[7][4] = Piece{PieceType: King, Color: White}
	board.Pieces[7][5] = Piece{PieceType: Bishop, Color: White}
	board.Pieces[7][6] = Piece{PieceType: Knight, Color: White}
	board.Pieces[7][7] = Piece{PieceType: Rook, Color: White}

	return board
}
