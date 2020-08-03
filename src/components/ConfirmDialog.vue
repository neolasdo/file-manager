<template>
  <v-dialog
    eager
    @input="change"
    value="true"
    :max-width="width"
    :persistent="persistent"
  >
    <v-card tile>
      <v-toolbar v-if="Boolean(title)" dark :color="color" dense flat>
        <v-toolbar-title class="white--text" v-text="title" />
      </v-toolbar>
      <v-card-text class="body-1 py-3" v-html="message" />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="Boolean(buttonFalseText)"
          :color="buttonFalseColor"
          small
          text
          @click="choose(false)"
        >
          {{ buttonFalseText }}
        </v-btn>
        <v-btn
          v-if="Boolean(buttonTrueText)"
          :color="buttonTrueColor"
          text
          small
          @click="choose(true)"
        >
          {{ buttonTrueText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    buttonTrueText: {
      type: String,
      default: "Yes",
    },
    buttonFalseText: {
      type: String,
      default: "No",
    },
    buttonTrueColor: {
      type: String,
      default: "primary",
    },
    buttonFalseColor: {
      type: String,
      default: "grey",
    },
    color: {
      type: String,
      default: "warning",
    },
    message: {
      type: String,
      required: true,
    },
    persistent: Boolean,
    title: {
      type: String,
    },
    width: {
      type: Number,
      default: 450,
    },
  },
  data() {
    return {
      value: false,
    };
  },
  methods: {
    choose(value) {
      this.$emit("result", value);
      this.value = value;
      this.$destroy();
    },
    change() {
      this.$destroy();
    },
  },
};
</script>
