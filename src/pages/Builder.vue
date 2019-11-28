<template>
  <div class="wrapper">
    <div class="form">
      <div class="horizontal">
        <div
          v-for="(word, idx) in horizontalWords"
          :key="idx"
          class="word-field"
        >
          <div class="number">{{ cells[word.row][word.col].number }}</div>
          <input
            v-for="(letter, index) in Array.from(word.letters)"
            v-model="cells[word.row][word.col + index].letter"
            :key="index"
            type="text"
            maxlength="1"
            size="1"
          />
        </div>
      </div>
      <div class="vertical">
        <div
          v-for="(word, idx) in verticalWords"
          :key="idx"
          class="word-field"
        >
          <div class="number">{{ cells[word.row][word.col].number }}</div>
          <input
            v-for="(letter, index) in Array.from(word.letters)"
            v-model="cells[word.row + index][word.col].letter"
            :key="index"
            type="text"
            maxlength="1"
            size="1"
          />
        </div>
      </div>
    </div>
    <div>
      <div v-for="(row, rowIdx) in cells" :key="rowIdx" class="row">
        <div
          @click.ctrl="toggleLive($event, cell)"
          @click.alt="toggleLive($event, cell)"
          v-for="(cell, colIdx) in row"
          :key="colIdx"
          :class="cell.live ? '' : 'blank'"
          class="cell"
        >
          <div class="number">
            {{ cell.number || '' }}
          </div>
          <input
            v-show="cell.live"
            v-model="cell.letter"
            type="text"
            size="1"
            maxlength="1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const HORI = 0
const VERT = 1

export default {
  name: 'Builder',

  data () {
    const width = 15
    const height = 15

    return {
      width,
      height,
      cells: Array.from(
        { length: width },
        (row, rowIdx) => Array.from(
          { length: height },
          (cell, colIdx) => ({
            live: true,
            letter: '',
            row: rowIdx,
            col: colIdx,
            number: null,
          }),
        ),
      ),
    }
  },

  computed: {
    horizontalWords () {
      return this.words.filter(({ direction }) => !direction)
    },

    verticalWords () {
      return this.words.filter(({ direction }) => direction)
    },

    words () {
      const words = []

      for (let col = 0; col < this.height; col += 1) {
        for (let row = 0; row < this.width; row += 1) {
          const curr = this.cells[row][col]

          if (curr.live) {
            const prev = row === 0
              ? false
              : this.cells[curr.row - 1][curr.col]
            const next = row === (this.width - 1)
              ? false
              : this.cells[curr.row + 1][curr.col]

            if ((row === 0 && !next.live) ||
              (row > 0 && !prev.live && !next.live) ||
              (!next && !prev.live)) {
              continue
            }

            if ((row === 0 && next.live) || (row > 0 && !prev.live)) {
              words.push({ direction: VERT, row, col, length: 1, letters: ' ' })
            } else {
              words[words.length - 1].length += 1
              words[words.length - 1].letters += ' '
            }
          }
        }
      }

      for (let row = 0; row < this.width; row += 1) {
        for (let col = 0; col < this.height; col += 1) {
          const curr = this.cells[row][col]

          if (curr.live) {
            const prev = col === 0
              ? false
              : this.cells[curr.row][curr.col - 1]
            const next = col === (this.height - 1)
              ? false
              : this.cells[curr.row][curr.col + 1]

            if ((col === 0 && !next.live) ||
              (col > 0 && !prev.live && !next.live) ||
              (!next && !prev.live)) {
              continue
            }

            if ((col === 0 && next.live) || (col > 0 && !prev.live)) {
              words.push({ direction: HORI, col, row, length: 1, letters: ' ' })
            } else {
              words[words.length - 1].length += 1
              words[words.length - 1].letters += ' '
            }
          }
        }
      }

      return this.addNumbers(words)
    },
  },

  methods: {
    addNumbers (words) {
      const numbers = [
        ...new Set(
          words
            .sort((one, two) => one.row - two.row || one.col - two.col)
            .map(({ row, col }) => `${row}:${col}`)
        ),
      ]

      for (let row = 0; row < this.cells.length; row += 1) {
        for (let col = 0; col < this.cells[row].length; col += 1) {
          this.cells[row][col].number = null
        }
      }

      numbers.forEach((number, index) => {
        const [, row, col] = number.match(/(\d+):(\d+)/)

        this.cells[row][col].number = index + 1
      })

      return words
    },

    toggleLive (e, cell) {
      console.log(cell)
      cell.live = !cell.live
    },
  },
}
</script>
