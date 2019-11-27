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
          @click.ctrl="toggleLive($event, cell)"
          @click.alt="toggleLive($event, cell)"
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
  name: "Builder",

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
      const numbers = [...new Set(
        words
          .sort((a, b) => a.row - b.row || a.col - b.col)
          .map(({ row, col }) => `${row}:${col}`)
      )]

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
};
</script>

<style lang="stylus">
.wrapper
.word-field

.form
  display flex

  input
    text-align center
    border 1px solid magenta
    display block

.blank
  background #000

.cell
  border 1px solid
  margin -1px -1px 0 0
  display block
  width 25px
  height 25px
  cursor pointer
  position relative

.number
  position absolute
  font-size 10px

.row
  display flex

  input
    background transparent
    border none
    display block
    text-align center
    width 100%
    height 100%
    line-height 25px
    font-size 18px

.word-field
  border: 1px solid
  margin-bottom: 10px

</style>
