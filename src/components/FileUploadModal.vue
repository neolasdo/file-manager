<template>
    <v-row justify="center">
        <v-dialog v-model="showDialog" persistent max-width="900px">
            <v-card>
                <v-card-title class="primary lighten-1" tile dark>
                    <span style="color: #fff !important">{{$trans('upload_to', {'folder_name' : current.name ? current.name : $trans('home') })}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-overlay :value="uploading" absolute>
                            <v-progress-circular
                                    v-if="uploading"
                                    :indeterminate="false"
                                    size="64"
                                    :value="progress"
                                    :width="10"
                                    color="light-blue"
                            >{{ progress }}
                            </v-progress-circular>
                        </v-overlay>
                        <v-form ref="form" v-model="valid">
                            <input type="file" id="file" style="display: none" ref="fileInput" multiple
                                   @change="addFiles()" :accept="accept"/>
                            <v-combobox multiple chips v-model="files" @click="openSelectFile" disable-lookup
                                        hide-no-data hide-selected :prepend-icon="'$file'" :label="$trans('file_label')"
                                        :error-messages="validate.files" :rules="rules.filesRules"
                                        append-icon="" @click:prepend="openSelectFile" ref="upload_input"
                                        onkeydown="return false" :disabled="uploading"
                                        deletable-chips class="tag-input" clearable @click:clear="removeAllFile">
                                <template v-slot:selection="{ index }">
                                    <div v-if="index < 1">
                                        <v-chip v-for="(file, key) in files" small text-color="white"
                                                :color="getStatusColor(key)"
                                                close :key="key" @click:close="removeFile(key)">
                                            {{ file.name }} ({{ formatSize(file.size) }})
                                        </v-chip>
                                    </div>
                                </template>
                            </v-combobox>
                            <v-checkbox v-model="need_approval" :label="$trans('need_approval')" v-if="!$config.hideNeedApprovalCheckBox"></v-checkbox>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-content-center">
                    <v-btn color="primary" dark tile v-if="files.length !== 0 && valid && !uploading"
                           @click="uploadAll">
                        {{ $trans('start_upload') }}
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
        need_approval: false,
        files: [],
        errors: [],
        accept: this.$config.accept_mimes.join(),
        maxSize: this.$config.file_max_size,
        progress: 0,
        validate: {
          files: ''
        },
        rules: {
          filesRules: [
            v => this.checkDocumentSize(v) || this.lengthOverloadSizeFilesArr() || this.$trans('error_file_size', {size: formatSize(this.$config.file_max_size)}),
            v => this.checkMimeDocuments(v) || this.lengthMimeErrorFilesArr() || this.$trans('error_file_mime'),
          ]
        },
        mime_error_files: [],
        overload_size_files: []
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
        let MIMEtypes = RegExp(acceptMimes.join("|").replace('*', '[^\\/,]+'));
        this.mime_error_files = []
        let mime_arr = documents.map(({type}) => {
          return type
        })
        mime_arr.forEach((item, index) => {
          if (!MIMEtypes.test(item)) {
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
          if (item.size > parseInt(this.maxSize)) {
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
        let promise = new Promise((resolve, reject) => {
          let formData = new FormData();
          this.files.forEach((item, i) => {
            formData.append('files[' + i + ']', item);
          })
          if (this.current.id) {
            formData.append("folder_id", this.current.id);
          }
          if (this.need_approval) {
            formData.append("need_approval", true);
          }
          this.$fileStore.$axios.post(this.$fileStore.$getEndpoint('upload').route, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }, onUploadProgress: progressEvent => {
              this.progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
          }).then((res) => {
            resolve(res)
          })
            .catch((errors) => {
              reject(errors)
            });
        })

        promise.then((res) => {
          this.files = []
          this.need_approval = false
          this.progress = 0
          this.reload = true
          this.uploading = false
          this.closeModal()
          this.$snackbar(res.data.message, {
            color: 'success'
          })
        }).catch((errors) => {
          this.reload = true
          this.progress = 0
          this.uploading = false
          let status = errors.response.status;
          for (const [key] of Object.entries(this.validate)) {
            this.validate[key] = ''
          }
          if (status === 400) {
            if (errors.response.data.data) {
              this.validate.files = errors.response.data.data[Object.keys(errors.response.data.data)[0]][0]
              this.errors = Object.keys(errors.response.data.data).map(item => {
                return parseInt(item.split('.')[1])
              })
            }
          }
          if (status === 403 || status === 500 || status === 404) {
            this.$snackbar(errors.response.data.message, {
              color: 'error'
            })
          }
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
        return this.errors.indexOf(key) !== -1
        || this.mime_error_files.indexOf(key) !== -1
        || this.overload_size_files.indexOf(key) !== -1
          ? '#ff5252' : '#295671'
      },
      addFiles() {
        if (this.$refs.fileInput) {
          this.valid = true;
          this.validate.files = ''
          let files = this.$refs.fileInput.files
          this.files = [...(this.files), ...files]
          this.$nextTick(() => {
            const input = this.$refs.fileInput;
            input.type = 'text';
            input.type = 'file';
          })
        }
      },
      removeFile(key) {
        if (!this.uploading) {
          if (this.errors.indexOf(key) !== -1) {
            this.errors.splice(this.errors.indexOf(key), 1)
          }
          if (this.mime_error_files.indexOf(key) !== -1) {
            this.mime_error_files.splice(this.mime_error_files.indexOf(key), 1)
          }
          if (this.overload_size_files.indexOf(key) !== -1) {
            this.overload_size_files.splice(this.overload_size_files.indexOf(key), 1)
          }
          if (this.errors.length === 0 && this.overload_size_files.length === 0 && this.mime_error_files.length === 0) {
            this.validate.files = ''
            this.valid = true
          }
          this.files.splice(key, 1)
        }
      },
      removeAllFile() {
        if (!this.uploading) {
          this.files = []
          this.validate.files = ''
          this.valid = true
          this.errors = []
          this.mime_error_files = []
          this.overload_size_files = []
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
    },
  }
</script>
