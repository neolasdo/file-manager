<template>
    <v-row justify="center">
        <v-dialog v-model="showDialog" persistent max-width="900px">
            <v-card>
                <v-card-title class="primary lighten-1" tile dark>
                    <span class="headline">{{$trans('upload_to', {'folder_name' : (current.id !== ''? current.name: 'Home')})}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-file-input chips multiple
                                      v-model="files" :accept="accept" :label="$trans('file_label')"
                                      @change="addFiles" @click:clear="removeAllFile()">
                            <template v-slot:selection="{ index }">
                                <div v-if="index < 1">
                                    <v-chip v-for="(file, key) in filesInfo" text-color="white"
                                            :color="getStatusColor(file.status)"
                                            close :key="key"
                                            @click:close="removeFile(key)">
                                        {{ file.file.name }} ({{ formatSize(file.file.size) }})
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
                                                        :value="file.progress"
                                                        striped
                                                ></v-progress-linear>
                                            </div>
                                        </td>
                                        <td>{{ formatSize(file.file.size) }}</td>
                                        <td>
                                            <v-chip :color="file.status" small v-if="file.status">
                                                {{ file.message ? file.message: file.status }}
                                            </v-chip>
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
        this.filesInfo = []
        this.hideUploadModal()
        if (this.reload) {
          this.reloadAction()
        }
      },
      async uploadAll() {
        this.filesInfo.forEach((item) => {
          if (item.status !== this.$trans('success_status')) {
            this.upload(item, function (onUploadProgress) {
              item.progress = parseInt(Math.round((onUploadProgress.loaded * 100) / onUploadProgress.total));
            })
              .then(() => {
                item.status = this.$trans('success_status')
              })
              .catch(errors => {
                if (errors && errors.response && errors.response.data && errors.response.data.data && errors.response.data.data.file) {
                  item.message = errors.response.data.data.file[0]
                }
                item.status = this.$trans('error_status')
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
      getStatusColor(status) {
        switch (status) {
          case this.$trans('success_status'): {
            return '#4caf50';
          }
          case this.$trans('error_status'): {
            return '#ff5252'
          }
          default: {
            return '#295671'
          }
        }
      },
      addFiles() {
        this.files.forEach(item => {
          let index = this.filesInfo.findIndex(info => {
            return info.file.name === item.name
              && info.file.size === item.size
              && info.file.lastModified === item.lastModified
              && info.file.type === item.type
          })
          if (index === -1) {
            let fileInfo = this.createFileInfo(item)
            this.filesInfo.push(fileInfo)
          }
        })
      },
      removeFile(key) {
        let file = this.filesInfo[key]
        if (this.files.indexOf(file) > -1) {
          this.files.splice(this.files.indexOf(file))
        }
        this.filesInfo.splice(key, 1)
      },
      removeAllFile() {
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
