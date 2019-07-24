 
<template>
  <label class="text-reader">
    <input type="file" @change="loadTextFromFile($event)">
  </label>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AccountReader extends Vue {
  @Prop(String) public value!: string;

  public json: object;
  public file: any;

  public loadTextFromFile(ev: any): void {
      this.file = ev.target.files[0];
      console.log(ev)
      const reader = new FileReader();

      reader.onload = (event) => {
        this.json = JSON.parse(event.target.result);
      }
      // reader.onload(e) {
      //   this.value = e;
      //   this.$emit("load", e.target.result);
      // }

      reader.readAsText(this.file);
      
  }
}

</script>