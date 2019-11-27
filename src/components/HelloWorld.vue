<template>
  <div class="wrapper">
    <div class="form">
      <div class="horizontal">
        <div
          class="word-field"
          v-for="(word, idx) in horizontalWords"
          :key="idx"
        >
          <div class="number">{{ cells[word.row][word.col].number }}</div>
          <input
            v-for="(letter, index) in Array.from(word.letters)"
            v-model="cells[word.row][word.col + index].letter"
            type="text"
            maxlength="1"
            size="1"
            :key="index"
          />
        </div>
      </div>
      <div class="vertical">
        <div
          class="word-field"
          v-for="(word, idx) in verticalWords"
          :key="idx"
        >
          <div class="number">{{ cells[word.row][word.col].number }}</div>
          <input
            v-for="(letter, index) in Array.from(word.letters)"
            v-model="cells[word.row + index][word.col].letter"
            type="text"
            maxlength="1"
            size="1"
            :key="index"
          />
        </div>
      </div>
    </div>
    <div>
      <div class="row" v-for="(row, rowIdx) in cells" :key="rowIdx">
        <div
          :class="cell.live ? '' : 'blank'"
          class="cell"
          v-for="(cell, colIdx) in row"
          :key="colIdx"
          @click.ctrl="cells[cell.row][cell.col].live = !cell.live"
          @click.alt="cells[cell.row][cell.col].live = !cell.live"
        >
          <div class="number">
            {{ cells[rowIdx] && cells[rowIdx][colIdx].number }}
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
  name: "HelloWorld",

  data () {
    const width = 10
    const height = 10

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
            const prev = row ? this.cells[row - 1][col] : null
            const next = row === this.width - 1
              ? null
              : this.cells[row + 1][col]

            if ((row === 0 || (prev && !prev.live)) && (next && next.live)) {
              words.push({ direction: VERT, row, col, length: 1, letters: ' ' })
            } else if (!(row === this.width - 1 && (prev && !prev.live))) {
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
            const prev = col ? this.cells[row][col - 1] : null
            const next = col === this.height - 1
              ? null
              : this.cells[row][col + 1]

            if ((col === 0 || (prev && !prev.live)) && (next && next.live)) {
              words.push({ direction: HORI, col, row, length: 1, letters: ' ' })
            } else if (!(col === this.height - 1 && (prev && !prev.live))) {
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
      const numbers = [...new Set(
        words
          .sort((a, b) => a.row - b.row || a.col - b.col)
          .map(({ row, col }) => `${row}:${col}`)
      )]

      numbers.forEach((number, index) => {
        const [, row, col] = number.match(/(\d+):(\d+)/)
        this.cells[row][col].number = index + 1
      })

      return words
    },

    editLetter (e, row, col) {
      this.cells[row][col].letter = e.target.value
    },
  },
};
</script>

<style>
.row,
.form,
.wrapper {
  display: flex;
}
.blank {
  background: #000;
}
.cell {
  border: 1px solid;
  margin: -1px -1px 0 0;
  display: block;
  width: 25px;
  height: 25px;
  cursor: pointer;
  position: relative;
}
.row input {
  background: transparent;
  border: none;
  display: block;
  text-align: center;
  width: 100%;
  height: 100%;
  line-height: 25px;
}
.form input {
  text-align: center;
  border: 1px solid magenta;
  display: block;
}
.word-field {
  display: flex;
  border: 1px solid;
  margin-bottom: 10px;
}
</style>
