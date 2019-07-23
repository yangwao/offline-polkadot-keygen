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
  @Prop({default: 'text'}) public type: string;  
  @Prop(String) value;
  @Prop(String) label;
  @Prop(String) placeholder;
  @Prop(String) classList;
  @Prop(Boolean) disabled;
}

</script>