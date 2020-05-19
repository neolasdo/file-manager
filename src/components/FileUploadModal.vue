<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="900px">
      <v-card>
        <v-card-title class="primary lighten-1" tile dark>
          <span class="headline">{{$trans('upload')}} {{ current.id !== ''? 'to '+ current.name: '' }} </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <file-upload :custom-action="uploadAll"
              :extensions="extensions" :accept="accept"
              :multiple="true" :directory="false" :size="size || 0"
              :thread="3" :drop="false" :drop-directory="false"
              :add-index="false" v-model="files" ref="upload">
              <v-btn color="primary" dark tile>
                <v-icon>mdi-plus</v-icon>
                {{$trans('select')}}
              </v-btn>
            </file-upload>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th>#</th>
                  <th class="text-left">{{$trans('name')}}</th>
                  <th class="text-left">{{$trans('size')}}</th>
                  <th class="text-left">{{$trans('speed')}}</th>
                  <th class="text-left">{{$trans('status')}}</th>
                  <th class="text-left">{{$trans('action')}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(file, index) in files" :key="file.id">
                  <td>{{index+1}}</td>
                  <td>
                    <div class="filename">{{file.name}}</div>
                    <div class="progress" v-if="file.active || file.progress !== '0.00'">
                      <v-progress-linear :value="file.progress"></v-progress-linear>
                    </div>
                  </td>
                  <td>{{ formatSize(file.size)}}</td>
                  <td>{{ formatSize(file.speed) }}</td>
                  <td v-if="file.error">{{file.error}}</td>
                  <td v-else-if="file.success">success</td>
                  <td v-else-if="file.active">active</td>
                  <td v-else></td>
                  <td>
                    <v-icon v-if="file.error && file.error !== 'compressing' && $refs.upload.features.html5"
                            @click.prevent="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})">mdi-reload
                    </v-icon>
                    <v-icon small @click="$refs.upload.remove(file)">mdi-delete</v-icon>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-content-center">
          <v-btn color="primary" dark tile v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">{{ $trans('start_upload') }}</v-btn>
          <v-btn color="danger" dark tile v-else @click.prevent="$refs.upload.active = false">{{ $trans('stop_upload') }}</v-btn>
          <v-btn color="default" dark tile @click="closeModal()">{{ $trans('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import {formatSize} from "@/helpers/file";
  import FileUpload from 'vue-upload-component'

  export default {
    name: 'UploadModal',
    components: {
      FileUpload,
    },
    data() {
      return {
        reload: false,
        files: [],
        size: 1024 * 1024 * 10,
        accept: this.$accept_mimes,
        extensions: 'gif,jpg,jpeg,png,webp',
        postAction: '/upload/post',
        putAction: '/upload/put',
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
      async uploadAll(file) {
        let formData = new FormData();
        formData.append('file', file);
        let uploadEndpoint = this.$fileStore.$endpoints.upload
        return await this.$fileStore.$axios({
          method: uploadEndpoint.method,
          url: uploadEndpoint.url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          console.log(res)
          this.reload = true
        }).catch(err => {
          console.log(err)
        });
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
<style>
  .headline {
    color: #ffffff;
  }

  .hidden {
    display: none !important;
  }
</style>
