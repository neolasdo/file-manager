<template>
  <v-dialog
    v-model="showModal"
    persistent
    max-width="900px"
    scrollable
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card dark color="secondary" v-if="showModal" ref="previewCard">
      <v-toolbar dark color="secondary">
        <v-btn icon dark @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="closeModal">{{ $trans("close") }}</v-btn>
      </v-toolbar>
      <v-card-text
        class="justify-content-center preview-area"
        :style="{ height: `${frameHeight + 12}px` }"
        style="position: relative"
      >
        <file-viewer
          :mime="mime"
          :path="path"
          :height="height"
          :size="size"
          v-if="showModal"
          :googleCheckInterval="$pluginConfig.reloadPreviewAfter ? $pluginConfig.reloadPreviewAfter: 4000"
          :googleCheckContentLoaded="$pluginConfig.autoReloadPreview"
          :googleMaxRetryTime="$pluginConfig.maxRetryTime ? $pluginConfig.maxRetryTime: 3"
          @download="downloadFile"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FileViewer from "./FileViewer";
import download from '@/mixins/download'

export default {
  name: "FilePreviewModal",
  components: { FileViewer },
  mixins: [download],
  data() {
    return {
      showModal: false,
      item: {
        name: "",
        id: "",
        path: "http://localhost:3000/sample.pdf",
        mime: "document/pdf",
        size: 12512344,
        created_at: "2019-01-01",
      },
      frameHeight: 0,
    };
  },
  computed: {
    path() {
      return  this.item.path ? this.item.path : this.item.file_path;
    },
    mime() {
      return this.item.mime ? this.item.mime : this.item.file_mime;
    },
    height() {
      return this.frameHeight - 26 + "px";
    },
    size() {
      return this.item.size ? this.item.size : this.item.file_size;
    },
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    showPreview(item) {
      this.item = item;
      this.showModal = true;
    },
    downloadFile() {
      this.download([this.item.id])
    }
  },
  watch: {
    showModal: {
      immediate: true,
      handler: function(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.frameHeight = this.$refs.previewCard.$el.clientHeight - 64;
          }, 0);
        }
      },
    },
  },
};
</script>
<style>
.preview-area {
  margin: auto !important;
  text-align: center;
  padding: 20px 0;
}
</style>
