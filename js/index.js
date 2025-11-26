// const store = Vuex.createStore({
//     state: {
//         game: {
//             turn: 0,
//             players: [],
//             board: {
//                 pieces: [],
//                 eaten_pieces: [],
//             },
//             chosen_piece: null,
//         },
//         user: {
//             name: "",
//             color: null,
//         },
//     },
//     mutations: {
//         set_user(state, user) {
//             state.user = user;
//         },
//         set_game(state, game) {
//             state.game = game;
//         },
//         set_chosen_piece(state, piece) {
//             state.game.chosen_piece = {
//                 x: piece.x, y: piece.y,
//             }
//         },
//         set_piece(state, piece) {
//             state.game.board[piece.y][piece.x] = piece;
//         }
//     },
//     actions: {
//         choosePiece({commit}, x, y) {
//             if (!currentUserTurn()) {
//                 return;
//             }
//             const piece = getPiece({ x: x, y: y });
//             if (piece && piece.color === userColor()) {
//                 commit("set_chosen_piece", { x: piece.x, y: piece.y });
//             } else {
//                 commit("set_chosen_piece", null);
//             }
//         },
//         movePiece({commit}, x, y) {
//             if (!currentUserTurn()) {
//                 return;
//             }
//             const piece = getPiece({x: x, y: y});
//             if (piece && piece.color !== userColor()) {
//                 commit("set_chosen_piece", { x: piece.x, y: piece.y });
//             } else {
//                 commit("set_chosen_piece", null);
//             }
//         },
//         exit({commit}) {
//             commit("SET_USER", null);
//             commit("SET_GAME", null);
//             commit("SET_CHOSEN_PIECE", null);
//         },
//     },
//     getters: {
//         userColor: state => state.user.color,
//         isCurrentUserTurn: state => state.user.color === state.game.turn,
//         getPiece: state => coord => state.board.pieces[coord.y][coord.x],
//     },
// });

import game from "./components/game.js";

const app = Vue.createApp({
    data() {
        return {
            
        };
    },
    components: {
        game,
    },
    template: `
        <game></game>
    `,
});

app.mount("#app");
