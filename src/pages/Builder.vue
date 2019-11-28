<template>
  <div class="wrapper">
    <div class="form">
      <div class="horizontal">
        <div
          v-for="(word, idx) in horizontals"
          :key="idx"
          class="word-field"
        >
          <div class="number">{{ cell(word.row, word.col).number }}</div>
          <input
            v-for="(letter, index) in Array.from(word.letters)"
            :value="cells[word.row][word.col + index].letter"
            :key="index"
            type="text"
            maxlength="1"
            size="1"
          />
        </div>
      </div>
      <div class="vertical">
        <div
          v-for="(word, idx) in verticals"
          :key="idx"
          class="word-field"
        >
          <div class="number">{{ cell(word.row, word.col).number }}</div>
          <input
            v-for="(letter, index) in Array.from(word.letters)"
            :value="cell(word.row + index, word.col).letter"
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
          @click.ctrl="toggleLive(cell)"
          @click.alt="toggleLive(cell)"
          v-for="(cell, colIdx) in row"
          :key="colIdx"
          :class="cell.live ? '' : 'blank'"
          class="cell"
        >
          <div class="number">
            {{ cell.number || '' }}
          </div>
          <input
            @input="setLetter({ event: $event, cell })"
            v-show="cell.live"
            :value="cell.letter"
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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Builder',

  computed: {
    ...mapGetters(['horizontals', 'verticals', 'cells', 'cell']),
  },

  mounted () {
    this.horizontalWords()
    this.verticalWords()
    this.addNumbers()
  },

  methods: {
    ...mapActions([
      'setLetter',
      'addNumbers',
      'toggleLive',
      'verticalWords',
      'horizontalWords',
    ]),
  },
}
</script>
