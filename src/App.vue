<template>
  <div id="crossword">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="stylus">
body
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px

  .wrapper
  .word-field
    display flex

  .form
    display flex

    input
      text-align center
      border 1px solid magenta
      display block
      width 18px

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
