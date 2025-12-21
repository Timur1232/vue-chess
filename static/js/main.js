import GameList from './game_list.js';
import Game from './game.js';

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;
const { createStore } = Vuex;

const Rules = {
    template: `
        <div>
            <h1>Правила</h1>
            <p>Кто победил, тот лох</p>
        </div>
    `
};

const store = createStore({
    state() {
        return {
            userName: '',
            gameInfo: null,
            currentGameId: null,
            board: null,
            turn: 0,
        }
    },
    mutations: {
        setUserName(state, name) {
            state.userName = name
        },
        setCurrentGame(state, gameId) {
            state.currentGameId = gameId
        },
        setGameInfo(state, gameInfo) {
            state.gameInfo = gameInfo
        },
        setBoard(state, board) {
            state.board = board
        },
        setTurn(state, turn) {
            state.turn = turn
        },
        updateBoard(state, data) {
            state.board = data.board
            if (data.gameInfo) {
                state.turn = data.gameInfo.turn
            }
        },
        setGameData(state, data) {
            state.gameInfo = data.gameInfo
            state.board = data.board
            state.turn = data.gameInfo.turn || 0
            state.currentGameId = data.gameInfo.gameId
            state.userName = data.gameInfo.hostPlayer.name
            if (data.gameInfo.secondPlayer) {
                state.userName = data.gameInfo.secondPlayer.name
            }
        },
    },
    actions: {
        async sendMove({ state, commit }, { from, to }) {
            if (!state.currentGameId) {
                alert('нет активной игры')
                return
            }

            console.log(`form: ${from}, to: ${to}`)

            try {
                const response = await fetch('/api/move', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        gameId: state.currentGameId,
                        from: { row: from.row, col: from.col },
                        to: { row: to.row, col: to.col }
                    })
                })

                if (response.ok) {
                    const data = await response.json()
                    console.log(data)
                    commit('updateBoard', data)
                } else {
                    console.error('ошибка отправки хода')
                    alert('ошибка отправки хода')
                }
            } catch (error) {
                console.error('ошибка отправки хода:', error)
                alert('ошибка соединения')
            }
        },
        async refreshBoard({ state, commit }) {
            if (!state.currentGameId) {
                alert('нет активной игры')
                return
            }

            try {
                const response = await fetch(`/api/game/${state.currentGameId}`)
                if (response.ok) {
                    const data = await response.json()
                    if (data && data.board) {
                        commit('updateBoard', data)
                    } else {
                        console.error('неверный формат ответа от сервера')
                    }
                } else {
                    console.error('ошибка обновления доски')
                }
            } catch (error) {
                console.error('ошибка обновления доски:', error)
            }
        }
    }
})

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: GameList },
        { path: '/game', component: Game },
        { path: '/rules', component: Rules }
    ]
})

const App = {
    template: `
        <div>
            <nav>
                <router-link to="/">Список игр</router-link> |
                <router-link to="/game">Игра</router-link> |
                <router-link to="/rules">Правила</router-link>
            </nav>
            <router-view></router-view>
        </div>
    `
}

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
