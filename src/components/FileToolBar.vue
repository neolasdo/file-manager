<template>
    <div>
        <v-toolbar color="primary" dark dense>
            <v-text-field dark v-model="keyword">
                <span slot="prepend-inner">
                  <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y z-index="11">
                  <template v-slot:activator="{ on }">
                    <v-btn tile small v-on="on" text>
                      {{ $trans('filter') }}
                      <v-icon small>mdi-menu</v-icon>
                    </v-btn>
                  </template>
                  <v-card tile max-width="500px">
                    <v-container>
                      <v-row align="center">
                        <v-col cols="4">
                          <v-subheader>{{ $trans('type') }}</v-subheader>
                        </v-col>
                        <v-col cols="8">
                          <v-select v-model="filter.mime" :items="getAllType()" item-text="text"
                                    item-value="value"
                                    menu-props="auto" label="タイプ" hide-details single-line>
                          </v-select>
                        </v-col>
                        <v-col cols="4">
                          <v-subheader>{{ $trans('created_date') }}</v-subheader>
                        </v-col>
                        <v-col cols="8">
                          <v-select v-model="filter.created_date" :items="timeRanges" item-text="text"
                                    item-value="value"
                                    menu-props="auto" label="作成日" hide-details single-line>
                          </v-select>
                        </v-col>
                        <v-col cols="4">
                          <v-subheader>{{ $trans('status') }}</v-subheader>
                        </v-col>
                        <v-col cols="8">
                          <v-select v-model="filter.status" :items="statusList" item-text="text" item-value="value"
                                    menu-props="auto" label="ステータス" hide-details single-line>
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-card-actions class="justify-center">
                        <v-btn color="secondary" tile @click="reset">{{ this.$trans('reset') }}</v-btn>
                        <v-btn color="primary" tile @click="executeSearch">{{ this.$trans('search') }}</v-btn>
                      </v-card-actions>
                    </v-container>
                  </v-card>
                </v-menu>
                </span>
                <v-btn tile text small slot="append" @click="search({keyword: keyword, filter: filter })">
                    <v-icon small>mdi-magnify</v-icon>
                </v-btn>
            </v-text-field>
            <v-spacer></v-spacer>
            <v-menu offset-y v-if="$permissions.upload || $permissions.create" z-index="11">
                <template v-slot:activator="{ on }">
                    <v-btn small tile v-on="on" dark outlined>
                        <v-icon>mdi-plus</v-icon>
                        {{ $trans('new') }}
                    </v-btn>
                </template>
                <v-list tile dense>
                    <v-list-item v-if="$permissions.upload" @click="openUploadModal">
                        <v-list-item-title>{{ $trans('upload') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="$permissions.create" @click="openFormModal(true)">
                        <v-list-item-title>{{ $trans('add_folder') }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu offset-y v-if="selectedFiles.length && ($permissions.download || $permissions.delete)" z-index="11">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon class="ml-2" dark>
                        <v-icon>mdi-menu</v-icon>
                    </v-btn>
                </template>
                <v-list tile dense>
                    <v-list-item v-if="canRequestSign" @click="requestSign">
                        <v-list-item-title>{{ $trans('request_sign') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="$permissions.approvalRequest" @click="requestApproval">
                        <v-list-item-title>{{ $trans('approval_request') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="$permissions.download" @click="download">
                        <v-list-item-title>{{ $trans('download') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="$permissions.delete" @click="deleteSelected">
                        <v-list-item-title>{{ $trans('delete') }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-toolbar>
    </div>
</template>

<script>
  export default {
    name: 'FileToolBar',
    data() {
      return {
        keyword: '',
        menu: false,
        filter: {
          status: '',
          mime: '',
          created_date: '',
        },
        timeRanges: [
          {text: this.$trans('all'), value: ''},
          {text: this.$trans('twelfth_month_ago'), value: '12 month'},
          {text: this.$trans('six_month_ago'), value: '6 month'},
          {text: this.$trans('thirty_day_ago'), value: '30 day'},
          {text: this.$trans('seven_day_ago'), value: '7 day'},
        ],
        statusList: [
          {text: this.$trans('all'), value: ''},
          {text: this.$trans('waiting_approval'), value: 'waiting_approval'},
          {text: this.$trans('waiting_signature'), value: 'waiting_signature'},
          {text: this.$trans('signed'), value: 'signed'},
        ]
      }
    },
    computed: {
      selectedFiles() {
        return this.$fileStore.state.selectedFiles
      },
      current() {
        return this.$fileStore.state.current
      },
      keywordState() {
        return this.$fileStore.state.keywordState
      },
      canRequestSign() {
        let invalid = this.selectedFiles.find(item => {
          return (item.is_official !== undefined && !item.is_official)
          || (item.count_signed_sign_request + item.count_pending_sign_request > 0)
        })
        return this.$permissions.requestSign && invalid === undefined
      }
    },
    methods: {
      openUploadModal() {
        this.$fileStore.dispatch('openUploadModal')
      },
      deleteSelected() {
        this.$confirm(this.$trans('confirm_delete_files'), {
          buttonTrueColor: 'error'
        }).then(res => {
          if (res) {
            this.$fileStore.dispatch('deleteSelected')
          }
        })
      },
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      search(payload) {
        this.$fileStore.dispatch('search', payload)
      },
      reset() {
        this.filter.status = ''
        this.filter.mime = ''
        this.filter.created_date = ''
      },
      executeSearch() {
        this.menu = false
        this.search({keyword: this.keyword, filter: this.filter})
      },
      requestSign() {
        this.$fileStore.dispatch('requestSign', this.selectedFiles)
      },
      requestApproval() {
        console.log('request approval', this.selectedFiles)
      },
      getAllType() {
        let allTypes = [];
        allTypes.push({text: this.$trans('all'), value: ''})
        for (const [key, value] of Object.entries(this.$pluginConfig.accept_extensions)) {
          allTypes.push({text: value.toUpperCase(), value: key})
        }
        return allTypes
      },
      download() {
        let endpoint = this.$fileStore.$getEndpoint('download')
        this.$fileStore.dispatch('loading')
        this.$fileStore.$axios({
          method: endpoint.method,
          url: endpoint.route,
          data: {
            files: this.selectedFiles.map(item => {
              return item.id
            })
          }
        }).then(res => {
          this.$fileStore.dispatch('unloading')
          if (res.data && res.data.data) {
            window.open(res.data.data.link, '_self');
          }
        }).catch(errors => {
          this.$fileStore.dispatch('unloading')
          if (errors.response && errors.response.data && errors.response.data.message) {
            this.$snackbar(errors.response.data.message, {
              color: 'error'
            })
          }
        })
      }
    },
    watch: {
      keywordState(val) {
        if (val === '') {
          this.keyword = ''
        }
      }
    }
  }
</script>
