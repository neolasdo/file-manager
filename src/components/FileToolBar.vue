<template>
  <div>
    <v-toolbar color="info" dark>
      <v-text-field dark v-model="keyword">
        <v-menu slot="prepend-inner" v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn small tile text v-on="on">
              検索 <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-card tile max-width="500px">
            <v-container>
              <v-row align="center">
                <v-col cols="4">
                  <v-subheader>タイプ</v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-select v-model="fileType" :items="getAllType()" item-text="text" item-value="value"
                            menu-props="auto" label="タイプ" hide-details single-line>
                  </v-select>
                </v-col>
                <v-col cols="4">
                  <v-subheader>作成日</v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-select v-model="createdDate" :items="timeRanges" item-text="text" item-value="value"
                            menu-props="auto" label="作成日" hide-details single-line>
                  </v-select>
                </v-col>
                <v-col cols="4">
                  <v-subheader>ステータス</v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-select v-model="status" :items="statusList" item-text="text" item-value="value"
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
        <v-btn icon tile small slot="append">
          <v-icon>mdi-magnify</v-icon>
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
            <v-list-item-title>ファイルのアップロード</v-list-item-title>
          </v-list-item>
          <v-list-item @click="openFormModal(true)">
            <v-list-item-title>フォルダーの追加</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon class="ml-2" dark>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list tile dense>
          <v-list-item>
            <v-list-item-title>署名依頼</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>承認依頼</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>ダウンロード</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>削除</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
  import {allFileTypes} from '@/helpers/file'
  import {mapActions, mapState} from 'vuex'

  export default {
    name: 'FileToolBar',
    data() {
      return {
        menu: false,
        keyword: '',
        fileType: '',
        createdDate: '',
        timeRanges: [
          {text: 'すべて', value: ''},
          {text: '過去12ヶ月', value: '12m'},
          {text: '過去6ヶ月', value: '6m'},
          {text: '過去30日', value: '30d'},
          {text: '過去７日', value: '7d'},
        ],
        status: '',
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
      ...mapState({
        selectedFiles: state => state.selectedFiles,
        current: state => state.current,
      }),
    },
    methods: {
      getAllType() {
        let allTypes = [];
        allTypes.push({text: 'すべて', value: ''})
        return allTypes.concat(allFileTypes())
      },
      ...mapActions({
        openUploadModal: 'openUploadModal',
        openFormModal: 'openFormModal',
      }),
    }
  }
</script>
