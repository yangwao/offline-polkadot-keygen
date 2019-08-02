<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <About/>
        <Balance/>
        <Subkey/>
        <Credits/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import About from '@/components/About.vue';
import Credits from '@/components/Credits.vue';
import Subkey from '@/components/Subkey.vue';
import Balance from '@/components/Balance.vue';

@Component({
  components: {
    About,
    Balance,
    Credits,
    Subkey,
  },
})
export default class Wallet extends Vue {}
</script>
<style scoped lang="scss">
</style>