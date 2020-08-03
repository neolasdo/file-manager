<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="600px" scrollable>
      <v-card>
        <v-card-title class="primary lighten-1" tile dark>
          <span style="color: #fff !important">{{
            $trans("request_sign")
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
        </v-card-text>
        <v-card-actions class="justify-content-center">
          <v-btn color="primary" tile dark @click="requestSign">
            {{ $trans("request_sign") }}
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
    };
  },
  methods: {
    hideRequestModal() {
      this.$fileStore.commit("HIDE_SIGN_MODAL");
    },
    reloadAction() {
      this.$fileStore.dispatch("reload");
    },
    closeModal() {
      this.hideRequestModal();
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
    requestSign() {
      this.$fileStore.dispatch("requestSign", this.files);
    },
  },
  computed: {
    current() {
      return this.$fileStore.state.current;
    },
    showDialog() {
      return this.$fileStore.state.showRequestSignModal;
    },
    files() {
      return this.$fileStore.state.requestSignFiles;
    },
  },
};
</script>
