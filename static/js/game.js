export default {
    data() {
        return {
            viewSide: true,
            chosenPiece: null,
            win: null,
        };
    },
    mounted() {
        if (this.myColor === 1) {
            this.viewSide = false
        }
    },
    computed: {
        user() {
            return this.$store.state.userName
        },
        gameInfo() {
            return this.$store.state.gameInfo
        },
        myColor() {
            if (!this.gameInfo || !this.user) return null

            if (this.gameInfo.hostPlayer.name === this.user) {
                return this.gameInfo.hostPlayer.color
            }
            if (this.gameInfo.secondPlayer && this.gameInfo.secondPlayer.name === this.user) {
                return this.gameInfo.secondPlayer.color
            }
            return null
        },
        canMove() {
            return this.myColor === this.turn
        },
        board() {
            return this.$store.state.board
        },
        turn() {
            return this.$store.state.turn
        },
    },
    methods: {
        getAssetPath(piece) {
            if (!piece) return ''

            const colorMap = {
                0: 'w', // White
                1: 'b', // Black
            }

            const typeMap = {
                1: 'K', // King
                2: 'Q', // Queen
                3: 'B', // Bishop
                4: 'N', // Knight
                5: 'R', // Rook
                6: 'P', // Pawn
            }

            const color = colorMap[piece.color] || 'w'
            const type = typeMap[piece.pieceType] || 'P'
            return `/static/media/${color}${type}.svg`
        },
        getPieceClass(row, col) {
            if (this.chosenPiece != null &&
                this.chosenPiece.row === row &&
                this.chosenPiece.col === col) {
                return 'chosen'
            }
            return ''
        },
        toggleView() {
            this.viewSide = !this.viewSide
        },
        choosePiece(piece, row, col) {
            if (!this.canMove) {
                return
            }

            if (piece.color !== this.myColor) {
                return
            }

            this.chosenPiece = {
                piece: piece,
                row: row,
                col: col,
            }
        },
        async movePiece(rowTo, colTo) {
            if (this.chosenPiece == null) {
                return
            }

            console.log(`rowTo: ${rowTo}, colTo: ${colTo}`)

            const { row, col } = this.chosenPiece

            if (row == rowTo && col == colTo) {
                this.chosenPiece = null
                return
            }

            const targetPiece = this.board.pieces[rowTo][colTo]
            if (targetPiece != null && targetPiece.pieceType === 1) {
                this.win = targetPiece.color === 1 ? 0 : 1
            }

            await this.$store.dispatch('sendMove', {
                from: { row, col },
                to: { row: rowTo, col: colTo }
            })

            this.chosenPiece = null
        },
        handleClick(piece, row, col) {
            if (this.chosenPiece == null) {
                this.choosePiece(piece, row, col)
            } else {
                this.movePiece(row, col)
            }
        },
        getRow(row) {
            if (!this.board.pieces) return []
            return this.viewSide ?
                this.board.pieces[row - 1] :
                this.board.pieces[this.board.pieces.length - row]
        },
        getRowIndex(row) {
            if (!this.board.pieces) return 0
            return this.viewSide ? row - 1 : this.board.pieces.length - row
        },
        async refreshBoard() {
            if (!this.gameInfo) return
            this.$store.dispatch('refreshBoard')
        }
    },
    template: `
        <div id="board">
            <p class="win" v-if="win != null">
                {{ win === 0 ? "Победили белые!" : "Победили черные!" }}
            </p>

            <button @click="toggleView">{{ viewSide ? "Переключить на черные" : "Переключить на белые" }}</button>
            <button @click="refreshBoard" :disabled="!gameInfo">Обновить доску</button>

            <table v-if="gameInfo && board.pieces">
                <tbody>
                    <tr v-for="row in 8" :key="row">
                        <td v-for="(piece, col) in getRow(row)" :key="col"
                            :class="getPieceClass(getRowIndex(row), col)">
                            <img v-if="piece != null && piece.pieceType != 0"
                                :src="getAssetPath(piece)" :alt="piece.pieceType"
                                @click="handleClick(piece, getRowIndex(row), col)"/>
                            <div v-else class="cell"
                                @click="movePiece(getRowIndex(row), col)"></div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p>Ход: {{ turn === 0 ? "Белые" : "Черные" }}<span v-if="myColor !== null && !canMove">| Ожидайте ход соперника...</span></p>
            <p v-if="myColor !== null">Ваш цвет: {{ myColor === 0 ? "Белые" : "Черные" }}</p>
            <p v-if="!gameInfo">Нет активной игры. Создайте или подключитесь к игре на главной странице.</p>
        </div>
    `
}


