<template>
  <div class="credits">
    <h3>Author 🐬🥳🥰</h3>
    <ul>
      <li><a href="https://hypersignal.xyz" target="_blank" rel="noopener">hypersignal.xyz</a></li>
      <li><a href="https://twitter.com/yangwao" target="_blank" rel="noopener">twitter/yangwao</a></li>
      <li><a href="https://github.com/yangwao" target="_blank" rel="noopener">github/yangwao</a></li>
      <li><a href="https://t.me/yangwao" target="_blank" rel="noopener">telegram/yangwao</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Credits extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 100px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: hotpink;
}
</style>
