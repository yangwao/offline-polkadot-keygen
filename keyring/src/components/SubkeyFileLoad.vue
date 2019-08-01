<template>
  <div class="field">
    <div class="file is-info has-name is-fullwidth is-right">
      <label class="file-label">
        <input class="file-input" type="file" name="account" @change="onFileChange" />
        <span class="file-cta">
          <span class="file-icon">📂</span>
          <span class="file-label">Choose Account</span>
        </span>
        <span class="file-name">{{account}}</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, PropSync } from "vue-property-decorator";

@Component
export default class SubkeyFileLoad extends Vue {
  @PropSync('accountToImport') account!: any

  public onFileChange(e: any): void {
    const files = e.target.files;
    if (!files.length) {
      return;
    }
    this.createInput(files[0]);
  }

  private createInput(file: any): void {
    const reader = new FileReader();
    reader.onload = e => {
      this.account = reader.result;
    };
    reader.readAsText(file);
  }
}
</script>
