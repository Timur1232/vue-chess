const store = Vuex.createStore({
    state() {
        return {
            board: {
                pieces: [],
                eaten_pieces: [],
                turn: 0,
            },
        };
    },
});
