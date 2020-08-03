<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="600px" scrollable>
      <v-card>
        <v-card-title class="primary lighten-1" tile dark>
          <span style="color: #fff !important">{{
            $trans("approval_request")
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-list dense max-height="300px" class="scrollable mt-3">
            <v-list-item v-for="(item, index) in files" :key="index">
              <v-list-item-avatar tile>
                <v-img :src="fileThumbnail(item)" alt=""></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle
                  v-text="formatSize(item.size)"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-form ref="form" v-model="valid" class="mt-3">
            <label class="app-label required" for="advisor">
              {{ $trans("advisor") }}
            </label>
            <v-select
              class="custom-input mt-2"
              clearable
              dense
              outlined
              id="advisor"
              hide-details
              v-model="advisor_id"
              :items="advisors"
              :rules="rules.advisorRules"
              :error-messages="validate.advisor_id"
              item-text="name"
              item-value="id"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-content-center">
          <v-btn
            color="primary"
            tile
            dark
            @click="requestApproval"
            :disabled="!valid"
          >
            {{ $trans("approval_request") }}
          </v-btn>
          <v-btn color="default" class="ml-2" dark tile @click="closeModal()"
            >{{ $trans("close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { getFileThumbnail, formatSize } from "@/helpers/file";

export default {
  data() {
    return {
      reload: false,
      valid: false,
      advisor_id: "",
      validate: {
        advisor_id: "",
      },
      rules: {
        advisorRules: [(v) => !!v || this.$trans("required_rule")],
      },
    };
  },
  methods: {
    hideRequestModal() {
      this.$fileStore.commit("HIDE_APPROVAL_MODAL");
    },
    reloadAction() {
      this.$fileStore.dispatch("reload");
    },
    closeModal() {
      this.hideRequestModal();
      this.$refs.form.reset();
      if (this.reload) {
        this.reloadAction();
      }
    },
    fileThumbnail(item) {
      return getFileThumbnail(item);
    },
    formatSize(size) {
      return formatSize(size);
    },
    requestApproval() {
      this.$fileStore.dispatch("requestApproval", {
        advisor_id: this.advisor_id,
        files: this.files,
      });
    },
  },
  computed: {
    current() {
      return this.$fileStore.state.current;
    },
    showDialog() {
      return this.$fileStore.state.showRequestApprovalModal;
    },
    files() {
      return this.$fileStore.state.requestApprovalFiles;
    },
    advisors() {
      return this.$fileStore.state.advisors;
    },
  },
};
</script>
