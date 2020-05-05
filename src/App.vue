<template>
    <file-manager>
        <template slot="toolbar_search_box_prepend">
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn small tile text v-on="on">
                        検索
                        <v-icon>arrow_drop_down</v-icon>
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
        </template>
        <template slot="toolbar_addition_menu_item">
            <v-list-item>
                <v-list-item-title>署名依頼</v-list-item-title>
            </v-list-item>
            <v-list-item>
                <v-list-item-title>承認依頼</v-list-item-title>
            </v-list-item>
        </template>
    </file-manager>
</template>

<script>
  import FileManager from "./components/FileManager";
  import {allFileTypes} from "./helpers/file";

  export default {
    name: 'App',
    components: {
      'file-manager': FileManager
    },
    data() {
      return {
        menu: false,
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
    methods: {
      getAllType() {
        let allTypes = [];
        allTypes.push({text: 'すべて', value: ''})
        return allTypes.concat(allFileTypes())
      },
    }
  }
</script>
