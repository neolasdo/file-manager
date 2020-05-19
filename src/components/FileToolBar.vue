<template>
    <div>
        <v-toolbar color="primary" dark>
            <v-text-field dark v-model="keyword">
                <span slot="prepend-inner">
                  <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn tile small v-on="on" text>
                      {{ $trans('filter') }}
                      <v-icon>mdi-menu</v-icon>
                    </v-btn>
                  </template>
                  <v-card tile max-width="500px">
                    <v-container>
                        <slot name="searchFilter" v-bind:filter="filter">
                          <v-row align="center">
                            <v-col cols="4">
                              <v-subheader>{{ $trans('type') }}</v-subheader>
                            </v-col>
                            <v-col cols="8">
                              <v-select v-model="filter.fileType" :items="getAllType()" item-text="text"
                                        item-value="value"
                                        menu-props="auto" label="タイプ" hide-details single-line>
                              </v-select>
                            </v-col>
                            <v-col cols="4">
                              <v-subheader>{{ $trans('created_date') }}</v-subheader>
                            </v-col>
                            <v-col cols="8">
                              <v-select v-model="filter.createdDate" :items="timeRanges" item-text="text"
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
                        </slot>
                      <v-card-actions class="justify-center">
                        <v-btn color="secondary" tile @click="reset">{{ this.$trans('reset') }}</v-btn>
                        <v-btn color="primary" tile @click="closeFilter">{{ this.$trans('close') }}</v-btn>
                      </v-card-actions>
                    </v-container>
                  </v-card>
                </v-menu>
                </span>
                <v-btn tile text small slot="append" @click="search({keyword: keyword, filter: filter })">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
            </v-text-field>
            <v-spacer></v-spacer>
            <v-menu offset-y v-if="$permissions.upload || $permissions.create">
                <template v-slot:activator="{ on }">
                    <v-btn tile v-on="on" dark outlined>
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
            <v-menu offset-y v-if="selectedFiles.length && ($permissions.download || $permissions.delete)">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon class="ml-2" dark>
                        <v-icon>mdi-menu</v-icon>
                    </v-btn>
                </template>
                <v-list tile dense>
                    <v-list-item v-if="$permissions.request_sign" @click="null">
                        <v-list-item-title>{{ $trans('request_sign') }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="$permissions.approval_request" @click="null">
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
          fileType: '',
          createdDate: '',
        },
        timeRanges: [
          {text: this.$trans('all'), value: ''},
          {text: this.$trans('twelfth_month_ago'), value: '12m'},
          {text: this.$trans('six_month_ago'), value: '6m'},
          {text: this.$trans('thirty_day_ago'), value: '30d'},
          {text: this.$trans('seven_day_ago'), value: '7d'},
        ],
        statusList: [
          {text: this.$trans('all'), value: ''},
          {text: this.$trans('dont_sign'), value: 'no_signature_required'},
          {text: this.$trans('signed'), value: 'signed'},
          {text: this.$trans('waiting_signature'), value: 'waiting_signature'},
          {text: this.$trans('reject'), value: 'reject'},
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
    },
    methods: {
      openUploadModal() {
        this.$fileStore.dispatch('openUploadModal')
      },
      deleteSelected() {
        this.$fileStore.dispatch('deleteSelected')
      },
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      search(payload) {
        this.$fileStore.dispatch('search', payload)
      },
      reset() {
        this.filter = {
          status: '',
          fileType: '',
          createdDate: '',
        }
      },
      closeFilter() {
        this.menu = false
      },
      getAllType() {
        let allTypes = [];
        allTypes.push({text: this.$trans('all'), value: ''})
        for (const [key, value] of Object.entries(this.$accept_extensions)) {
          allTypes.push({text: value.toUpperCase(), value: key})
        }
        return allTypes
      },
      download() {
        let endpoint = this.$fileStore.$endpoints.download

        this.$fileStore.$axios({
          method: endpoint.method,
          url: endpoint.url,
          data: this.selectedFiles
        }).then(res => {
          console.log(res)
        }).catch(error => {
          console.log(error)
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
