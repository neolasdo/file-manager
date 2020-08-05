<template>
  <div style="height: 100%; width: 100%">
    <div v-if="tooLargeFile || cantLoadFile" style="height: 100%; width: 100%">
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" offset="0">
          <div style="display:block; padding-top:108px;">
            <v-alert type="warning" border="bottom" colored-border>
              <div v-html="errorMessage"></div>
              <div class="my-2">
                <v-btn @click="$emit('download')">{{
                  $trans("download")
                }}</v-btn>
              </div>
            </v-alert>
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-else style="height: 100%; width: 100%">
      <v-overlay
        :value="isPdf && !loaded && this.googleCheckContentLoaded"
        absolute
      >
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <iframe
        v-if="
          (isPdf && this.googleCheckContentLoaded && renderIframe) || isDocType || (isPdf && !this.googleCheckContentLoaded)
        "
        width="100%"
        :height="height"
        frameborder="0"
        :src="itemViewPath"
        @load="onLoad"
        @error="onError($event)"
        ref="iframe"
      ></iframe>

      <div v-if="isImageType" class="image-preview">
        <v-img
          :src="path"
          :max-height="'100%'"
          :max-width="'100%'"
          aspect-ratio
        />
      </div>
    </div>
  </div>
</template>

<script>
import { isDocType, isImageType, isPdfType } from "../helpers/file";

export default {
  name: "FileViewer",
  components: {},
  props: {
    height: {
      type: String,
      default() {
        return "100%";
      },
    },
    size: {
      type: Number,
      default() {
        return undefined;
      },
    },
    path: {
      type: String,
    },
    mime: {
      type: String,
    },
    configs: {
      type: Object,
      default() {
        return {
          max_size_preview: {
            "image/jpeg": 52428800,
            "image/png": 52428800,
            "application/pdf": 52428800,
            "application/msword": 10485760,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 10485760,
            "application/vnd.ms-powerpoint": 10485760,
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": 10485760,
            "application/vnd.ms-excel": 5242880,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": 5242880,
          },
        };
      },
    },
    googleCheckContentLoaded: {
      type: Boolean,
      default() {
        return true;
      },
    },
    googleCheckInterval: {
      type: Number,
      default() {
        return 3000;
      },
    },
    googleMaxRetryTime: {
      type: Number,
      default() {
        return 4;
      },
    },
  },
  data() {
    return {
      loaded: false,
      renderIframe: true,
      loadTime: 0,
      loadInterval: null,
      cantLoad: false,
    };
  },
  computed: {
    itemViewPath() {
      if (this.isPdf) {
        return (
          "https://docs.google.com/viewerng/viewer?url=" +
          encodeURIComponent(this.path) +
          "&embedded=true"
        );
      }
      if (this.isDocType) {
        return (
          "https://view.officeapps.live.com/op/view.aspx?src=" +
          encodeURIComponent(this.path) +
          "&embedded=true"
        );
      }
      return this.path;
    },
    errorMessage() {
        return this.tooLargeFile ? this.$trans('alert_file_too_large'): this.$trans('alert_cant_load')
    },
    isDocType() {
      return isDocType(this.mime);
    },
    isPdf() {
      return isPdfType(this.mime);
    },
    isImageType() {
      return isImageType(this.mime);
    },
    tooLargeFile() {
      let maxSizeCanView = this.configs.max_size_preview[this.mime];
      return this.size !== undefined && this.size >= maxSizeCanView;
    },
    cantLoadFile() {
        return this.loadTime >= this.googleMaxRetryTime
    }
  },
  methods: {
    onLoad() {
      this.loaded = true;
      this.loadTime = 0;
      clearInterval(this.loadInterval);
    },
    onError(e) {
      this.loaded = true;
      this.loadTime = 0;
      console.log(e);
      clearInterval(this.loadInterval);
    },
    reloadIframe() {
      if (this.loadTime < this.googleMaxRetryTime) {
        this.loadInterval = setInterval(() => {
          this.loadTime++;
          this.renderIframe = false;
          this.$nextTick(() => {
            this.renderIframe = true;
          });
        }, this.googleCheckInterval);
      } else {
        this.loadTime = 0;
        clearInterval(this.loadInterval);
      }
    },
  },
  beforeDestroy() {
    if (this.isPdf && this.googleCheckContentLoaded) {
      this.loadTime = 0;
      clearInterval(this.loadInterval);
    }
  },
  beforeMount() {
    if (this.googleCheckContentLoaded) {
      if (this.isPdf && this.googleCheckContentLoaded) {
        this.reloadIframe();
      }
    }
  },
};
</script>
<style scoped>
.image-preview {
  height: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
