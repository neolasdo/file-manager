<template>
  <div>
    <v-toolbar color="primary" dark>
      <v-text-field dark v-model="keyword">
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn small tile text v-on="on">
              検索
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-card tile max-width="500px">
            <v-container>
              <v-row align="center">
                <v-col cols="4">
                  <v-subheader>タイプ</v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-select v-model="filter.fileType" :items="getAllType()" item-text="text" item-value="value"
                            menu-props="auto" label="タイプ" hide-details single-line>
                  </v-select>
                </v-col>
                <v-col cols="4">
                  <v-subheader>作成日</v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-select v-model="filter.createdDate" :items="timeRanges" item-text="text" item-value="value"
                            menu-props="auto" label="作成日" hide-details single-line>
                  </v-select>
                </v-col>
                <v-col cols="4">
                  <v-subheader>ステータス</v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-select v-model="filter.status" :items="statusList" item-text="text" item-value="value"
                            menu-props="auto" label="ステータス" hide-details single-line>
                  </v-select>
                </v-col>
              </v-row>
              <v-card-actions class="justify-center">
                <v-btn color="secondary" tile @click="menu = false">リセット</v-btn>
                <v-btn color="primary" tile @click="menu = false">検索</v-btn>
              </v-card-actions>
            </v-container>
          </v-card>
        </v-menu>
        <v-btn icon tile small slot="append" @click="search({keyword: keyword, filter: filter })">
          <v-icon>mdi-search</v-icon>
        </v-btn>
      </v-text-field>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn tile v-on="on" dark outlined>
            <v-icon>mdi-plus</v-icon> New
          </v-btn>
        </template>
        <v-list tile dense>
          <v-list-item @click="openUploadModal">
            <v-list-item-title>Upload</v-list-item-title>
          </v-list-item>
          <v-list-item @click="openFormModal(true)">
            <v-list-item-title>Add Folder</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y v-if="selectedFiles.length">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="ml-2" dark>
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list tile dense>
          <v-list-item>
            <v-list-item-title>署名依頼</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>承認依頼</v-list-item-title>
          </v-list-item>
          <v-list-item @click="download">
            <v-list-item-title>Download</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
  import {allFileTypes} from "../helpers/file";

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
          {text: 'すべて', value: ''},
          {text: '過去12ヶ月', value: '12m'},
          {text: '過去6ヶ月', value: '6m'},
          {text: '過去30日', value: '30d'},
          {text: '過去７日', value: '7d'},
        ],
        statusList: [
          {text: 'すべて', value: ''},
          {text: '署名不要', value: 'no_signature_required'},
          {text: '署名済み', value: 'signed'},
          {text: '署名待ち', value: 'waiting_signature'},
          {text: '却下', value: 'reject'},
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
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      search(payload) {
        this.$fileStore.dispatch('search', payload)
      },
      getAllType() {
        let allTypes = [];
        allTypes.push({text: 'すべて', value: ''})
        return allTypes.concat(allFileTypes())
      },
      download() {
        let endpoint = this.$store.$endpoints.download

        this.$store.$axios({
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
