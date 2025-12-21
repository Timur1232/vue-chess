export default {
    data() {
        return {
            games: [],
            playerName: '',
            selectedColor: 0,
            isLoading: false,
            error: null
        }
    },
    mounted() {
        this.fetchGames()
        this.playerName = this.$store.state.userName
    },
    methods: {
        async fetchGames() {
            this.isLoading = true
            this.error = null

            try {
                const response = await fetch('/api/games')
                if (!response.ok) {
                    console.error(`ошибка сервера: ${response.status}`)
                    return
                }

                const gamesArray = await response.json()
                this.games = gamesArray

            } catch (error) {
                console.error('ошибка загрузки игр:', error)
                this.error = error.message
                this.games = []
            } finally {
                this.isLoading = false
            }
        },
        async createGame() {
            if (!this.playerName.trim()) {
                this.error = 'введите имя игрока'
                return
            }

            this.isLoading = true
            this.error = null

            try {
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        playerName: this.playerName,
                        color: this.selectedColor
                    })
                })

                if (response.ok) {
                    const gameData = await response.json()
                    this.$store.commit('setGameData', gameData)
                    this.$router.push('/game')
                } else {
                    const errorText = await response.text()
                    this.error = `ошибка создания игры: ${errorText}`
                }
            } catch (error) {
                console.error('ошибка создания игры:', error)
                this.error = 'ошибка соединения'
            } finally {
                this.isLoading = false
            }
        },
        async connectToGame(gameId) {
            if (!this.playerName.trim()) {
                this.error = 'введите имя игрока'
                return
            }

            this.isLoading = true
            this.error = null

            try {
                const response = await fetch(`/api/connect/${gameId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ playerName: this.playerName })
                })

                if (response.status === 200) {
                    const gameData = await response.json()
                    this.$store.commit('setGameData', gameData)
                    this.$router.push('/game')
                } else {
                    const errorText = await response.text()
                    this.error = `ошибка подключения: ${errorText}`
                }
            } catch (error) {
                console.error('ошибка подключения:', error)
                this.error = 'ошибка соединения'
            } finally {
                this.isLoading = false
            }
        },
        canConnect(game) {
            return !game.secondPlayer
        }
    },
    template: `
        <div>
            <h1>Список игр</h1>

            <div class="game-controls">
                <div>
                    <input v-model="playerName" placeholder="Ваше имя">
                    <div>
                        <label>
                            <input type="radio" v-model="selectedColor" :value="0"> Белые
                        </label>
                        <label>
                            <input type="radio" v-model="selectedColor" :value="1"> Черные
                        </label>
                    </div>
                    <button
                        @click="createGame"
                        :disabled="!playerName.trim() || isLoading">
                        Создать игру
                    </button>
                    <button
                        @click="fetchGames"
                        :disabled="isLoading">
                        Обновить список
                    </button>
                </div>

                <div v-if="error" class="error">
                    {{ error }}
                </div>

                <div v-if="isLoading">
                    Загрузка...
                </div>
            </div>

            <div v-if="games && games.length > 0">
                <h2>Доступные игры ({{ games.length }}):</h2>
                <ul>
                    <li v-for="game in games" :key="game.gameId">
                        <div class="game-info">
                            <div>
                                <strong>Игра #{{ game.gameId }}</strong><br>
                                Хост: {{ game.hostPlayer.name }}
                                ({{ game.hostPlayer.color === 0 ? 'Белые' : 'Черные' }})
                            </div>
                            <div v-if="game.secondPlayer">
                                Второй игрок: {{ game.secondPlayer.name }}
                                ({{ game.secondPlayer.color === 0 ? 'Белые' : 'Черные' }})
                            </div>
                            <div v-else>
                                Ожидание второго игрока
                            </div>
                            <button
                                @click="connectToGame(game.gameId)"
                                :disabled="!canConnect(game) || !playerName.trim() || isLoading">
                                Подключиться
                            </button>
                        </div>
                    </li>
                </ul>
            </div>

            <div v-else-if="!isLoading">
                <p>Нет доступных игр. Создайте новую игру!</p>
            </div>
        </div>
    `
}
