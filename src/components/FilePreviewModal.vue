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
      <v-card-text class="justify-content-center preview-area">
        <iframe v-if="isDocType" :src="itemViewPath" width='100%' :height="frameHeight + 'px'" frameborder='0'></iframe>
        <img :src="item.path" v-if="isImageType" class="image-preview" aspect-ratio="1" @click.stop="dialog=false"/>
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
        return "https://docs.google.com/viewerng/viewer?url=" + this.item.path + "&embedded=true"
      },
      isDocType() {
        return isDocumentFile(this.item.path)
      },
      isImageType() {
        return isImageFile(this.item.path)
      }
    },
    methods: {
      closeModal() {
        this.showModal = false
      },
      showPreview(item) {
        this.item = item
        this.showModal = true
      }
    },
    watch: {
      showModal: {
        immediate: true,
        handler: function (newVal) {
          if (newVal) {
            setTimeout(() => {
              this.frameHeight = this.$refs.previewCard.$el.clientHeight - 86;
            }, 0);
          }
        }
      }
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
