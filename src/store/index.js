import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const HORI = 0
const VERT = 1
const INITIAL_WIDTH = 15
const INITIAL_HEIGHT = 15

const store = new Vuex.Store({
  state: {
    words: [],
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
    cells: Array.from(
      { length: INITIAL_WIDTH },
      (row, rowIdx) => Array.from(
        { length: INITIAL_HEIGHT },
        (cell, colIdx) => ({
          live: true,
          letter: '',
          row: rowIdx,
          col: colIdx,
          number: null,
        }),
      ),
    ),
  },

  getters: {
    cell: (state) => (row, col) => state.cells[row][col],
    cells: (state) => state.cells,
    numbers: (state) => [
      ...new Set(
        state.words
          .sort((one, two) => one.row - two.row || one.col - two.col)
          .map(({ row, col }) => [row, col]),
      ),
    ],
    verticals: (state) => state.words.filter(({ direction }) => direction),
    horizontals: (state) => state.words.filter(({ direction }) => !direction),
  },

  mutations: {
    setCellProp (state, { row, col, prop, value }) {
      Vue.set(state.cells[row][col], prop, value)
    },

    setLastWordProp (state, { prop, value }) {
      Vue.set(
        state.words[state.words.length - 1],
        prop,
        state.words[state.words.length - 1][prop] + value
      )
    },

    addWord (state, word) {
      Vue.set(state.words, state.words.length, word)
    },

    toggleLive (state, { col, row }) {
      Vue.set(state.cells[row][col], 'live', !state.cells[row][col].live)
    },

    clearWords (state) {
      state.words = []
    },

    setLetter (state, { cell: { row, col }, value }) {
      Vue.set(state.cells[row][col], 'letter', value)
    },
  },

  actions: {
    horizontalWords ({ state, commit, getters }) {
      for (let row = 0; row < state.width; row += 1) {
        for (let col = 0; col < state.height; col += 1) {
          const curr = getters.cell(row, col)

          if (curr.live) {
            const prev = col === 0
              ? false
              : getters.cell(curr.row, curr.col - 1)
            const next = col === (state.height - 1)
              ? false
              : getters.cell(curr.row, curr.col + 1)

            if ((col === 0 && !next.live) ||
              (col > 0 && !prev.live && !next.live) ||
              (!next && !prev.live)) {
              continue
            }

            if ((col === 0 && next.live) || (col > 0 && !prev.live)) {
              commit(
                'addWord',
                { direction: HORI, col, row, length: 1, letters: ' ' },
              )
            } else {
              commit('setLastWordProp', { prop: 'length', value: 1 })
              commit('setLastWordProp', { prop: 'letters', value: ' ' })
            }
          }
        }
      }
    },

    verticalWords ({ state, commit, getters }) {
      for (let col = 0; col < state.height; col += 1) {
        for (let row = 0; row < state.width; row += 1) {
          const curr = getters.cell(row, col)

          if (curr.live) {
            const prev = row === 0
              ? false
              : getters.cell(curr.row - 1, curr.col)
            const next = row === (state.width - 1)
              ? false
              : getters.cell(curr.row + 1, curr.col)

            if ((row === 0 && !next.live) ||
              (row > 0 && !prev.live && !next.live) ||
              (!next && !prev.live)) {
              continue
            }

            if ((row === 0 && next.live) || (row > 0 && !prev.live)) {
              commit(
                'addWord',
                { direction: VERT, row, col, length: 1, letters: ' ' },
              )
            } else {
              commit('setLastWordProp', { prop: 'length', value: 1 })
              commit('setLastWordProp', { prop: 'letters', value: ' ' })
            }
          }
        }
      }
    },

    addNumbers ({ state, commit, getters }) {
      for (let row = 0; row < state.cells.length; row += 1) {
        for (let col = 0; col < state.cells[row].length; col += 1) {
          commit('setCellProp', { row, col, prop: 'number', value: null })
        }
      }

      getters.numbers.forEach(([row, col], index) => {
        commit('setCellProp', { row, col, prop: 'number', value: index })
      })
    },

    toggleLive ({ commit, dispatch }, cell) {
      commit('toggleLive', cell)
      commit('clearWords')
      dispatch('horizontalWords')
      dispatch('verticalWords')
      dispatch('addNumbers')
    },

    setLetter ({ commit }, { event, cell }) {
      commit('setLetter', { cell, value: event.target.value })
    },
  },
})

export { store }
