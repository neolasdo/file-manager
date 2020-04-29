<template>
  <v-dialog v-model="showModal" persistent max-width="900px" scrollable fullscreen hide-overlay
            transition="dialog-bottom-transition">
    <v-card dark color="secondary" v-if="showModal" ref="previewCard">
      <v-toolbar dark color="secondary">
        <v-btn icon dark @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="closeModal">Close</v-btn>
      </v-toolbar>
      <v-card-text>
        <iframe
          src="https://docs.google.com/viewerng/viewer?url=https://file-examples.com/wp-content/uploads/2017/08/file_example_PPT_250kB.ppt&embedded=true"
          width='100%' :height="frameHeight + 'px'" frameborder='0'>
        </iframe>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
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

