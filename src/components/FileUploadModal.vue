<template>
    <v-row justify="center">
        <v-dialog v-model="showDialog" persistent max-width="900px">
            <v-card>
                <v-card-title class="primary lighten-1" tile dark>
                    <span class="headline">{{$trans('upload')}} {{ current.id !== ''? 'to '+ current.name: '' }} </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-file-input v-model="files" chips multiple label="Files" @change="addFiles">
                            <template v-slot:selection="{ index }">
                                <div v-if="index < 1">
                                    <v-chip v-for="(file, key) in files" small close :key="key"
                                            @click:close="deleteFile(index)">
                                        {{ file.name }} ({{ formatSize(file.size) }})
                                    </v-chip>
                                </div>
                            </template>
                        </v-file-input>
                        <div v-if="files.length">
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                    <tr>
                                        <th class="text-left">{{$trans('name')}}</th>
                                        <th class="text-left">{{$trans('size')}}</th>
                                        <th class="text-left">{{$trans('status')}}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(file, index) in filesInfo" :key="index">
                                        <td>
                                            <div class="filename">{{file.file.name}} ({{file.progress}} %)</div>
                                            <div class="progress" v-if="file.progress !== 0 || file.progress !== 100">
                                                <v-progress-linear
                                                        color="light-blue"
                                                        height="10"
                                                        :value="file.progress"
                                                        striped
                                                ></v-progress-linear>
                                            </div>
                                        </td>
                                        <td>{{ formatSize(file.file.size) }}</td>
                                        <td>
                                            <v-chip :color="file.status" small v-if="file.status">
                                                {{ file.status }}
                                            </v-chip>
                                            <p class="font-italic" v-text="file.message"></p>
                                        </td>
                                    </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </div>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-content-center">
                    <v-btn color="primary" dark tile v-if="filesToUpload.length !== 0" @click="uploadAll">{{
                        $trans('start_upload') }}
                    </v-btn>
                    <v-btn color="primary" dark tile v-if="filesUploadFailed.length !== 0" @click="uploadAll">{{
                        $trans('re_upload') }}
                    </v-btn>
                    <v-btn color="default" dark tile @click="clear()">{{ $trans('clear') }}</v-btn>
                    <v-btn color="default" dark tile @click="closeModal()">{{ $trans('close') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
  import {formatSize} from "@/helpers/file";

  export default {
    name: 'UploadModal',
    data() {
      return {
        reload: false,
        files: [],
        filesInfo: [],
        accept: this.$accept_mimes.join(),
      }
    },
    methods: {
      hideUploadModal() {
        this.$fileStore.dispatch('hideUploadModal')
      },
      reloadAction() {
        this.$fileStore.dispatch('reload')
      },
      closeModal() {
        this.files = []
        this.hideUploadModal()
        if (this.reload) {
          this.reloadAction()
        }
      },
      async uploadAll() {
        this.filesInfo.forEach((item) => {
          if (item.status !== 'success') {
            this.upload(item, function (onUploadProgress) {
              item.progress = parseInt(Math.round((onUploadProgress.loaded * 100) / onUploadProgress.total));
            })
              .then(() => {
                item.status = 'success'
              })
              .catch(errors => {
                if (errors && errors.response && errors.response.data && errors.response.data.data && errors.response.data.data.file) {
                  item.message = errors.response.data.data.file[0]
                }
                item.status = 'error'
              });
          }
        })
        this.reload = true
      },
      upload(fileInfo, onUploadProgress) {
        let file = fileInfo.file
        let formData = new FormData();

        formData.append("file", file);
        if (this.current.id) {
          formData.append("folder_id", this.current.id);
        }

        return this.$fileStore.$axios.post(this.$fileStore.$getEndpoint('upload').route, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress
        });
      },
      addFiles() {
        this.filesInfo = []
        this.files.forEach(item => {
          let fileInfo = this.createFileInfo(item)
          this.filesInfo.push(fileInfo)
        })
      },
      deleteFile(index) {
        this.filesInfo.splice(index, 1)
        this.files.splice(index, 1)
      },
      clear() {
        this.filesInfo = []
        this.files = []
      },
      createFileInfo(file) {
        return {
          file: file,
          status: undefined,
          progress: 0,
          message: ''
        }
      },
      formatSize(size) {
        return formatSize(size)
      },
    },
    computed: {
      current() {
        return this.$fileStore.state.current
      },
      showDialog() {
        return this.$fileStore.state.showUploadModal
      },
      filesToUpload() {
        return this.filesInfo.filter(item => {
          return item.status === undefined
        })
      },
      filesUploadFailed() {
        return this.filesInfo.filter(item => {
          return item.status === 'error'
        })
      }
    },
  }
</script>
