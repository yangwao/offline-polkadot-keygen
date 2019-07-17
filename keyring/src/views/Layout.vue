<template>
  <div class="about">
    <div class="intro">
      <About/>
    </div>
    <Subkey/>
    <Credits/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import About from '@/components/About.vue';
import Credits from '@/components/Credits.vue';
import Subkey from '@/components/Subkey.vue';

@Component({
  components: {
    About,
    Credits,
    Subkey,
  },
})
export default class Layout extends Vue {}
</script>
<style scoped lang="scss">
.intro {
  padding: 80px 0 80px;
}
</style>