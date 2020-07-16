<template>
    <v-row justify="center">
        <v-dialog v-model="showDialog" persistent max-width="600px" scrollable>
            <v-card>
                <v-card-title class="primary lighten-1" tile dark>
                    <span style="color: #fff !important">{{ type === 'sign' ? $trans('request_sign') : $trans('approval_request') }}</span>
                </v-card-title>
                <v-card-text>
                    <v-list>
                        <v-subheader inset>
                            Files
                            <v-spacer></v-spacer>
                             <v-btn icon @click="resetList">
                                <v-icon color="primary lighten-1">mdi-reload</v-icon>
                            </v-btn>
                             <v-btn icon @click="showSelectFileDialog = true">
                                <v-icon color="primary lighten-1">mdi-plus</v-icon>
                            </v-btn>
                        </v-subheader>
                        <v-divider inset v-if="files.length"></v-divider>
                        <v-list-item v-for="(item, index) in files" :key="index">
                            <v-list-item-avatar tile>
                                <v-img :src="fileThumbnail(item)" alt=""></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"></v-list-item-title>
                                <v-list-item-subtitle v-text="formatSize(item.size)"></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon small @click="removeFile(index)">
                                    <v-icon color="grey lighten-1">mdi-close</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider inset></v-divider>
                    </v-list>
                </v-card-text>
                <v-card-actions class="justify-content-center">
                    <v-btn color="primary" tile dark v-if="type === 'sign'" @click="requestSign">
                        {{ $trans('request_sign') }}
                    </v-btn>
                    <v-btn color="primary" tile dark v-else @click="requestApproval">
                        {{ $trans('approval_request') }}
                    </v-btn>
                    <v-btn color="default" class="ml-2" dark tile @click="closeModal()">{{ $trans('close') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <select-file-dialog :show="showSelectFileDialog" 
                            :disableFiles="files"
                            @close="showSelectFileDialog = false" 
                            @on-select="select($event)"/>
    </v-row>
</template>

<script>
  import {getFileThumbnail, formatSize} from "@/helpers/file";
  import SelectFileDialog from "./SelectFileDialog"

  export default {
    name: 'UploadModal',
    components: {
        'select-file-dialog': SelectFileDialog
    },
    data() {
      return {
        reload: false,
        showSelectFileDialog: false,
      }
    },
    methods: {
      hideRequestModal() {
        this.$fileStore.dispatch('hideRequestModal')
      },
      reloadAction() {
        this.$fileStore.dispatch('reload')
      },
      closeModal() {
        this.hideRequestModal()
        if (this.reload) {
          this.reloadAction()
        }
      },
      fileThumbnail(item) {
        return getFileThumbnail(item)
      },
      formatSize(size) {
        return formatSize(size)
      },
      requestSign() {
        this.$fileStore.dispatch('requestSign', this.files)
      },
      requestApproval() {
        this.$fileStore.dispatch('requestApproval', this.files)
      },
      removeFile(index) {
        this.$fileStore.dispatch('removeFileRequest', index)
      },
      select(selected) {
        this.$fileStore.dispatch('addFilesRequest', selected)
      },
      resetList() {
        this.$fileStore.dispatch('resetRequestFiles')
      }
    },
    computed: {
      current() {
        return this.$fileStore.state.current
      },
      showDialog() {
        return this.$fileStore.state.showRequestModal
      },
      type() {
        return this.$fileStore.state.requestingType
      },
      files() {
        return this.$fileStore.state.requestFiles[this.type]
      }
    },
  }
</script>
