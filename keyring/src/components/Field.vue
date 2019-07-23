<template>
  <div class="field">
    <div class="field">
      <label class="label">{{label}}</label>
      <div class="control">
        <input 
          :class="classList" 
          @input="$emit('input', $event.target.value)"
          :type="type"
          :placeholder="placeholder" 
          :value="value"
          :disabled="disabled">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Field extends Vue {
  @Prop({default: 'text'}) public type!: string;
  @Prop(String) public value!: string;
  @Prop(String) public label!: string;
  @Prop(String) public placeholder!: string;
  @Prop(String) public classList!: string;
  @Prop(Boolean) public disabled!: boolean;
}

</script>