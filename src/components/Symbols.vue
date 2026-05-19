<script lang="ts">
import { defineComponent } from "vue";
import { Lock, Unlock } from "@element-plus/icons-vue";

export default defineComponent({
  name: "Symbols",
  components: { Unlock, Lock },
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: ""
    }
  }
});
</script>

<template>
  <template v-if="name === 'star'">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="m6.173 13.004.17.371a8.7 8.7 0 0 0 3.3 3.638l.265.155a.181.181 0 0 1 0 .316q-.135.075-.265.155a8.7 8.7 0 0 0-3.3 3.639l-.17.371a.19.19 0 0 1-.346 0l-.17-.372a8.7 8.7 0 0 0-3.565-3.793.181.181 0 0 1 0-.316l.265-.155a8.7 8.7 0 0 0 3.3-3.638l.17-.371a.19.19 0 0 1 .346 0M15.078 2.73q.144.327.297.65a15.2 15.2 0 0 0 6.239 6.638.317.317 0 0 1 0 .553q-.235.132-.464.271a15.2 15.2 0 0 0-6.072 7.017.331.331 0 0 1-.605 0 15.2 15.2 0 0 0-6.536-7.289.317.317 0 0 1 0-.552q.234-.132.463-.271a15.2 15.2 0 0 0 6.073-7.017.331.331 0 0 1 .605 0"
      />
    </svg>
  </template>
</template>

<style scoped lang="scss"></style>
