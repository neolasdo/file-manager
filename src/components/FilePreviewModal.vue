<template>
    <v-dialog v-model="showModal" persistent max-width="900px" scrollable fullscreen hide-overlay
              transition="dialog-bottom-transition">
        <v-card dark color="secondary" v-if="showModal" ref="previewCard">
            <v-toolbar dark color="secondary">
                <v-btn icon dark @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="closeModal">{{ $trans('close') }}</v-btn>
            </v-toolbar>
            <v-card-text class="justify-content-center preview-area"
                         :style="{'height': `${frameHeight + 12}px`}" style="position: relative">
                <v-overlay :value="isDocType && !loaded && this.$autoReloadPreview" absolute>
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
                <iframe v-if="isDocType && renderIframe" width='100%' :height="(frameHeight - 26) + 'px'"
                        frameborder='0' :src="itemViewPath" @load="onLoad" @error="onError($event)" ref="iframe">
                </iframe>
                <div :style="{'height': `${frameHeight - 20}px`, 'display': 'flex', 'align-items': 'center', 'justify-content': 'center'}"
                     v-if="isImageType">
                    <img :src="item.path" class="image-preview" aspect-ratio="1"/>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>

  import {isDocumentFile, isImageFile} from "../helpers/file";

  export default {
    name: 'FilePreviewModal',
    components: {},
    data() {
      return {
        showModal: false,
        loaded: false,
        renderIframe: true,
        loadInterval: null,
        item: {
          name: '',
          id: '',
          path: 'http://localhost:3000/sample.pdf',
          mime: 'document/pdf',
          size: 12512344,
          created_at: '2019-01-01'
        },
        frameHeight: 0
      }
    },
    computed: {
      itemViewPath() {
        return "https://docs.google.com/viewerng/viewer?url=https%3A%2F%2Fromusystem-dev.s3.ap-northeast-1.amazonaws.com%2F159115507048_file-example_PDF_1MB.pdf%3FX-Amz-Content-Sha256%3DUNSIGNED-PAYLOAD%26X-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Credential%3DAKIATXLDAZQUI2JUFZPE%252F20200617%252Fap-northeast-1%252Fs3%252Faws4_request%26X-Amz-Date%3D20200617T081546Z%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Expires%3D1800%26X-Amz-Signature%3Dacecc2e29b1c5979a1ce636b1deb384594c012303f3d0e667aabb9c181a3e6ef&embedded=true"
      },
      isDocType() {
        return isDocumentFile(this.item)
      },
      isImageType() {
        return isImageFile(this.item)
      }
    },
    methods: {
      closeModal() {
        this.showModal = false
        this.loaded = false
        clearInterval(this.loadInterval)
      },
      onLoad() {
        this.loaded = true
        clearInterval(this.loadInterval)
      },
      onError(e) {
        this.loaded = true
        console.log(e)
        clearInterval(this.loadInterval)
      },
      reloadIframe() {
        this.loadInterval = setInterval(() => {
          this.renderIframe = false
          this.$nextTick(() => {
            this.renderIframe = true
          })
        }, this.$reloadPreviewAfter ? this.$reloadPreviewAfter: 5000)
      },
      showPreview(item) {
        this.item = item
        this.showModal = true
      }
    },
    beforeDestroy() {
      clearInterval(this.loadInterval)
    },
    watch: {
      showModal: {
        immediate: true,
        handler: function (newVal) {
          if (newVal) {
            setTimeout(() => {
              this.frameHeight = this.$refs.previewCard.$el.clientHeight - 64;
            }, 0);
            if (this.isDocType && this.$autoReloadPreview) {
              this.reloadIframe()
            }
          }
        }
      },
    }
  }
</script>
<style>
    .preview-area {
        margin: auto !important;
        text-align: center;
        padding: 20px 0;
    }

    .image-preview {
        max-width: 80% !important;
    }
</style>
