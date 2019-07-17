<template>
  <div class="about">
    <div class="intro">
      <h1>Offline Keyring Generator for 
        <a href="https://www.parity.io/substrate/">Substrate</a> accounts</h1>   
        <li>Compatible with <a href="https://github.com/paritytech/substrate/tree/master/subkey">Subkey</a> utility 💯</li>
        <li>written in Vue.js & Typescript</li>
        <li>offline-first</li> 
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class About extends Vue {}

</script>
<style scoped lang="scss">
.intro {
  padding: 80px 0 80px;
}
</style>