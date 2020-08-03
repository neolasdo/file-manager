<template>
  <v-snackbar
    v-model="show"
    :bottom="y === 'bottom'"
    :color="color"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :right="x === 'right'"
    :timeout="timeout"
    :top="y === 'top'"
    :vertical="mode === 'vertical'"
  >
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "success",
    },
    mode: {
      type: String,
      default: "",
    },
    x: {
      type: String,
      default: "right",
    },
    y: {
      type: String,
      default: "bottom",
    },
    message: {
      type: String,
      required: true,
    },
    timeout: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.$destroy();
    }, this.timeout);
  },
};
</script>
