export default {
    data() {
        return {
            viewSide: true,
            turn: true,
            board: [
                [
                    { color: false, assetName: "bR" },
                    { color: false, assetName: "bN" },
                    { color: false, assetName: "bB" },
                    { color: false, assetName: "bQ" },
                    { color: false, assetName: "bK" },
                    { color: false, assetName: "bB" },
                    { color: false, assetName: "bN" },
                    { color: false, assetName: "bR" },
                ],
                [
                    { color: false, assetName: "bP" },
                    { color: false, assetName: "bP" },
                    { color: false, assetName: "bP" },
                    { color: false, assetName: "bP" },
                    { color: false, assetName: "bP" },
                    { color: false, assetName: "bP" },
                    { color: false, assetName: "bP" },
                    { color: false, assetName: "bP" },
                ],
                [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                ],
                [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                ],
                [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                ],
                [
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                ],
                [
                    { color: true, assetName: "wP" },
                    { color: true, assetName: "wP" },
                    { color: true, assetName: "wP" },
                    { color: true, assetName: "wP" },
                    { color: true, assetName: "wP" },
                    { color: true, assetName: "wP" },
                    { color: true, assetName: "wP" },
                    { color: true, assetName: "wP" },
                ],
                [
                    { color: true, assetName: "wR" },
                    { color: true, assetName: "wN" },
                    { color: true, assetName: "wB" },
                    { color: true, assetName: "wQ" },
                    { color: true, assetName: "wK" },
                    { color: true, assetName: "wB" },
                    { color: true, assetName: "wN" },
                    { color: true, assetName: "wR" },
                ],
            ],
            user: null,
            chosenPiece: null,
            win: null,
        };
    },
    methods: {
        getAssetPath(str) {
            return `/media/${str}.svg`;
        },
        getPieceClass(piece) {
            return (this.chosenPiece != null && this.chosenPiece.piece === piece) ? 'chosen' : '' 
        },
        toggleView() {
            this.viewSide = !this.viewSide;
        },
        choosePiece(piece, row, col) {
            if (this.turn != piece.color) {
                return;
            }
            this.chosenPiece = {
                piece: piece,
                row: row,
                col: col,
            };
            console.log(this.chosenPiece);
        },
        movePiece(rowTo, colTo) {
            if (this.chosenPiece == null) {
                return;
            }

            const { piece, row, col } = this.chosenPiece;

            if (row == rowTo && col == colTo) {
                this.chosenPiece = null;
                return;
            }

            if (this.board[rowTo][colTo] != null && this.board[rowTo][colTo].assetName[1] === "K") {
                this.win = this.turn;
            }

            this.board[row][col] = null;
            this.board[rowTo][colTo] = piece;
            this.chosenPiece = null;
            this.turn = !this.turn;
        },
        handleClick(piece, row, col) {
            if (this.chosenPiece == null) {
                this.choosePiece(piece, row, col);
            } else {
                this.movePiece(row, col);
            }
        },
        getRow(row) {
            return this.viewSide ? this.board[row-1] : this.board[this.board.length - row];
        },
        getRowIndex(row) {
            return this.viewSide ? row-1 : this.board.length - row;
        },
    },
    template: `
        <div id="board">
            <button @click="toggleView">{{ viewSide ? "Переключить на черные" : "Переключить на белые" }}</button>
            <p>Ход: {{ turn ? ("Белые") : ("Черные") }}</p>
            <table>
                <tbody>
                    <tr v-for="row in 8" :key="row">
                        <td v-for="(piece, col) in getRow(row)" :key="col"
                            :class="getPieceClass(piece)">
                            <img v-if="piece != null"
                                :src="getAssetPath(piece.assetName)" :alt="piece.assetName"
                                @click="handleClick(piece, getRowIndex(row), col)"/>
                            <div v-else class="cell"
                                @click="movePiece(getRowIndex(row), col)"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p class="win" v-if="win != null">
                {{ win ? "Победили белые!" : "Победили черные!" }}
            </p>
        </div>
    `,
}
