<template>
    <v-dialog v-model="showFormModal" persistent max-width="600px">
        <v-card>
            <v-card-text>
                <v-container>
                    <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
                        <v-row>
                            <v-col cols="12">
                              <label for="name" class="app-label required">{{$trans('name_label')}}</label>
                              <v-text-field id="name" v-model="name" :rules="rules" :counter="50" dense outlined
                                            hide-details :error-messages="messages.name" class="mt-2"/>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="hideFormModal(reload)">{{ $trans('close') }}</v-btn>
                <v-btn color="blue darken-1" :disabled="oldName === name" text @click="submitForm()">{{ $trans('save')}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  let formTypes = {
    createFolder: 0,
    editFolder: 1,
    editFile: 2,
  }

  export default {
    name: 'FormModal',
    data() {
      return {
        reload: false,
        rules: [
          v => !!v || this.$trans('required_rule'),
          v => (v && v.length <= 50) || this.$trans('name_length_rule'),
        ],
        valid: true,
        messages: {
          name: ''
        },
        name: '',
        oldName: '',
        formType: formTypes.createFolder
      }
    },
    computed: {
      selectedFiles() {
        return this.$fileStore.state.selectedFiles
      },
      selectedFolder() {
        return this.$fileStore.state.selectedFolder
      },
      current() {
        return this.$fileStore.state.current
      },
      showFormModal() {
        return this.$fileStore.state.showFormModal
      },
      formCreate() {
        return this.$fileStore.state.formCreate
      },
    },
    methods: {
      hideFormModal(payload) {
        this.$fileStore.dispatch('hideFormModal', payload)
      },
      async createFolder() {
        let endpoint = this.$getEndpoint('createFolder')
        let request
        let data = {
          name: this.name,
        }
        if (this.current.id) {
          data.parent_id = this.current.id
        }
        if (endpoint.method.toUpperCase() === 'GET') {
          request = this.$fileStore.$axios.get(endpoint.route, {
            params: data
          })
        } else {
          request = this.$fileStore.$axios({
            method: endpoint.method,
            url: endpoint.route,
            data: data
          })
        }
        await this.handleResult(request)
      },
      async handleResult(request) {
        await request.then(res => {
          if (res.data && res.data.message) {
            this.$snackbar(res.data.message, {
              color: 'success'
            })
          }

          this.$fileStore.dispatch('hideFormModal', true)
        }).catch(errors => {
          let status = errors.response.status;
          if (status && errors.response && errors.response.data && errors.response.data.data) {
            let err = errors.response.data.data;
            for (let field in err) {
              this.messages[field] = err[field]
            }
          }
          if (errors.response && errors.response.data && errors.response.data.message) {
            this.$snackbar(errors.response.data.message, {
              color: 'error'
            })
          }
        })
      },
      editFolderName(payload) {
        this.$confirm(this.$trans('confirm_edit_folder'), {
          buttonTrueColor: 'deep-orange'
        }).then(res => {
          if (res) {
            let endpoint = this.$getEndpoint('editFolder', [payload.id])
            let request
            let data = {
              name: this.name,
            }
            if (endpoint.method.toUpperCase() === 'GET') {
              request = this.$fileStore.$axios.get(endpoint.route, {
                params: data
              })
            } else {
              request = this.$fileStore.$axios({
                method: endpoint.method,
                url: endpoint.route,
                data: data
              })
            }
            this.handleResult(request)
          }
        })
      },
      editFile(payload) {
        this.$confirm(this.$trans('confirm_edit_file'), {
          buttonTrueColor: 'deep-orange'
        }).then(res => {
          if (res) {
            let endpoint = this.$getEndpoint('editFile', [payload.id])
            let request
            let data = {
              name: this.name,
            }
            if (endpoint.method.toUpperCase() === 'GET') {
              request = this.$fileStore.$axios.get(endpoint.route, {
                params: data
              })
            } else {
              request = this.$fileStore.$axios({
                method: endpoint.method,
                url: endpoint.route,
                data: data
              })
            }
            this.handleResult(request)
          }
        })
      },
      submitForm() {
        if (this.formType === formTypes.createFolder) {
          this.createFolder()
        } else if (this.formType === formTypes.editFolder) {
          this.editFolderName({
            id: this.selectedFolder.id,
            name: this.name
          })
        } else if (this.formType === formTypes.editFile) {
          this.editFile({
            id: this.selectedFiles[0].id,
            name: this.name
          })
        }
        this.reload = true
      },
    },
    watch: {
      showFormModal(val) {
        if (val) {
          if (this.$refs.form) {
            this.$refs.form.resetValidation()
          }
          if (this.formCreate) {
            this.name = ''
            this.formType = formTypes.createFolder
          } else if (this.selectedFolder && this.selectedFolder.name) {
            this.formType = formTypes.editFolder
            this.name = this.selectedFolder.name
          } else if (this.selectedFiles.length === 1) {
            this.name = this.selectedFiles[0].name
            this.formType = formTypes.editFile
          }
          this.valid = true;
          this.messages = {
            name: ''
          }
          this.oldName = this.name
        }
      }
    }
  }
</script>

