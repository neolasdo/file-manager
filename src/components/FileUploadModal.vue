<template>
    <v-row justify="center">
        <v-dialog v-model="showDialog" persistent max-width="900px">
            <v-card>
                <v-card-title class="primary lighten-1" tile dark>
                    <span class="headline">{{$trans('upload_to', {'folder_name' : current.name ? current.name : $trans('home') })}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-overlay :value="uploading" absolute>
                            <v-progress-circular indeterminate size="64"></v-progress-circular>
                        </v-overlay>
                        <v-form ref="form" v-model="valid">
                            <input type="file" id="file" style="display: none" ref="fileInput" multiple
                                   @change="addFiles()" :accept="accept"/>
                            <v-combobox multiple chips v-model="filesInfo" @click="openSelectFile" disable-lookup
                                        hide-no-data hide-selected :prepend-icon="'$file'" :label="$trans('file_label')"
                                        :error-messages="validate.documents" :rules="rules.documentsRules"
                                        append-icon="" @click:prepend="openSelectFile" ref="upload_input"
                                        onkeydown="return false" :disabled="uploading"
                                        deletable-chips class="tag-input" clearable @click:clear="removeAllFile">
                                <template v-slot:selection="{ index }">
                                    <div v-if="index < 1">
                                        <v-chip v-for="(file, key) in filesInfo" small text-color="white"
                                                :color="getStatusColor(key)"
                                                close :key="key" @click:close="removeFile(key)">
                                            {{ file.file.name }} ({{ formatSize(file.file.size) }})
                                        </v-chip>
                                    </div>
                                </template>
                            </v-combobox>
                            <div v-if="filesInfo.length">
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
                                                <div class="progress"
                                                     v-if="file.progress !== 0 || file.progress !== 100">
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
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-content-center">
                    <v-btn color="primary" dark tile v-if="filesToUpload.length !== 0 && valid && !uploading"
                           @click="uploadAll">
                        {{ $trans('start_upload') }}
                    </v-btn>
                    <v-btn color="primary" dark tile v-if="filesUploadFailed.length !== 0 && !uploading"
                           @click="uploadAll">
                        {{ $trans('re_upload') }}
                    </v-btn>
                    <v-btn color="default" dark tile @click="closeModal()" :disabled="uploading">{{ $trans('close') }}
                    </v-btn>
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
        uploading: false,
        valid: true,
        filesInfo: [],
        accept: this.$accept_mimes.join(),
        maxSize: this.$file_max_size,
        validate: {
          documents: ''
        },
        rules: {
          documentsRules: [
            v => this.checkDocumentSize(v) || this.lengthOverloadSizeFilesArr() || this.$trans('error_file_size', {size: formatSize(this.$file_max_size)}),
            v => this.checkMimeDocuments(v) || this.lengthMimeErrorFilesArr() || this.$trans('error_file_mime'),
          ]
        },
        mime_error_files: [],
        overload_size_files: [],
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
        this.filesInfo = []
        this.hideUploadModal()
        if (this.reload) {
          this.reloadAction()
        }
      },
      openSelectFile() {
        if (this.$refs.fileInput && !this.uploading) {
          this.$refs.fileInput.click()
        }
      },
      checkMimeDocuments(documents) {
        let acceptMimes = this.accept.split(",");
        this.mime_error_files = []
        let mime_arr = documents.map(({file}) => {
          return file.type
        })
        mime_arr.forEach((item, index) => {
          if (acceptMimes.indexOf(item) === -1) {
            this.mime_error_files.push(index);
          }
        })
        return this.mime_error_files.length === 0;
      },
      lengthMimeErrorFilesArr() {
        return this.mime_error_files.length <= 0;
      },
      checkDocumentSize(documents) {
        this.overload_size_files = []
        documents.forEach((item, index) => {
          if (item.file.size > parseInt(this.maxSize)) {
            this.overload_size_files.push(index);
          }
        })
        return this.overload_size_files.length === 0;
      },
      lengthOverloadSizeFilesArr() {
        return this.overload_size_files.length <= 0;
      },
      async uploadAll() {
        this.uploading = true
        let promises = this.filesInfo.map((item) => {
          return new Promise((resolve, reject) => {
            if (item.status !== this.$trans('success_status')) {
              this.upload(item, function (onUploadProgress) {
                item.progress = parseInt(Math.round((onUploadProgress.loaded * 100) / onUploadProgress.total));
              })
                .then(() => {
                  item.status = this.$trans('success_status')
                  resolve(item)
                })
                .catch(errors => {
                  if (errors && errors.response && errors.response.data && errors.response.data.data && errors.response.data.data.file) {
                    item.message = errors.response.data.data.file[0]
                  }
                  item.status = this.$trans('error_status')
                  reject(item)
                })
            } else {
              resolve(item)
            }
          })
        })

        Promise.all(promises).then(() => {
          this.reload = true
          this.uploading = false
        }).catch(() => {
          this.reload = true
          this.uploading = false
        })
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
      getStatusColor(key) {
        let status = this.filesInfo[key].status
        switch (status) {
          case this.$trans('success_status'): {
            return '#4caf50';
          }
          case this.$trans('error_status'): {
            return '#ff5252'
          }
          default: {
            return this.mime_error_files.indexOf(key) !== -1 || this.overload_size_files.indexOf(key) !== -1 ? '#ff5252' : '#295671'
          }
        }
      },
      addFiles() {
        if (this.$refs.fileInput) {
          let files = this.$refs.fileInput.files
          files.forEach(item => {
            let fileInfo = this.createFileInfo(item)
            this.filesInfo.push(fileInfo)
          })
          this.$nextTick(() => {
            const input = this.$refs.fileInput;
            input.type = 'text';
            input.type = 'file';
          })
        }
      },
      removeFile(key) {
        if (!this.uploading) {
          this.filesInfo.splice(key, 1)
        }
      },
      removeAllFile() {
        if (!this.uploading) {
          this.filesInfo = []
        }
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
