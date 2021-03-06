<template>
    <v-card class="mx-auto detail-card" tile>
        <v-container fluid class="pa-0" style="height: 100%">
            <v-toolbar flat>
                <v-toolbar-title v-text="title"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-tabs v-model="tab" style="height: calc(100% - 64px);">
                <v-tab :href="'#detail'" @click="showComments = false">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on" left>mdi-information-outline</v-icon>
                        </template>
                        <span>{{ $trans('detail') }}</span>
                    </v-tooltip>
                </v-tab>
                <v-tab :href="'#comments'" v-if="selectedFiles.length === 1 && $permissions.comment" @click="getComments()">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on" left>mdi-comment-multiple-outline</v-icon>
                        </template>
                        <span>{{ $trans('comments') }}</span>
                    </v-tooltip>
                </v-tab>
                <v-tabs-items v-model="tab" class="tab-content">
                    <v-tab-item value="detail" class="tab-item">
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" v-if="!selectedFiles.length && !selectedFolder.hasOwnProperty('id')">
                                    <b v-if="!current.id">{{ $trans('no_item_selected') }}</b>
                                    <div v-for="item in $pluginConfig.detailConfig.folderDetail" :key="item.key" v-else>
                                        <span class="body-1 font-weight-medium" v-if="current[item.key]">
                                            {{ item.label + ': '+ current[item.key] }}
                                        </span>
                                    </div>
                                </v-col>
                                <v-col cols="12" v-if="selectedFolder.hasOwnProperty('id')">
                                    <div v-for="item in $pluginConfig.detailConfig.folderDetail" :key="item.key">
                                        <span class="body-1 font-weight-medium" v-if="selectedFolder[item.key]">
                                            {{ item.label + ': '+ selectedFolder[item.key] }}
                                        </span>
                                    </div>
                                </v-col>
                                <v-col cols="12" v-if="selectedFiles.length > 1">
                                    <v-list dense>
                                        <v-subheader>Files</v-subheader>
                                        <v-list-item-group>
                                            <v-list-item v-for="(item, i) in selectedFiles" :key="i">
                                                <v-list-item-content>
                                                    <v-list-item-title class="font-weight-bold"
                                                                       v-text="item.name"></v-list-item-title>
                                                </v-list-item-content>
                                                <v-list-item-action>
                                                    <v-btn icon small>
                                                        <v-icon @click="removeFileSelected(i)" color="grey lighten-1">
                                                            mdi-close
                                                        </v-icon>
                                                    </v-btn>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list>
                                </v-col>
                                <v-col cols="12" v-if="selectedFiles.length === 1">
                                    <div v-for="item in $pluginConfig.detailConfig.fileDetail" :key="item.key">
                                    <span class="body-1 font-weight-medium" v-if="selectedFiles[0][item.key]">
                                            {{ item.label + ': '+ (item.formatFunc ? item.formatFunc(selectedFiles[0][item.key]): selectedFiles[0][item.key]) }}
                                        </span>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-tab-item>
                    <v-tab-item value="comments" v-if="selectedFiles.length === 1 && $permissions.comment" class="tab-item">
                        <FileComments v-if="showComments" :comments="comments" @addComment="addComment($event)"
                                      :canAddComment="$permissions.addComment" @loadMore="loadMoreComment"/>
                    </v-tab-item>
                </v-tabs-items>
            </v-tabs>
        </v-container>
    </v-card>
</template>

<script>
  import {formatSize} from '@/helpers/file'
  import FileComments from "./FileComments";

  export default {
    name: 'DetailCard',
    components: {
      FileComments
    },
    data() {
      return {
        tab: null,
        showComments: false,
      }
    },
    computed: {
      selectedFiles() {
        let files = this.$fileStore.state.selectedFiles
        let itemComment = this.$fileStore.state.itemComment
        if (files.length === 1 && files[0].id !== itemComment && this.tab === 'comments') {
          this.reloadCommentComponent()
          this.$fileStore.dispatch('getComments')
        }
        return this.$fileStore.state.selectedFiles
      },
      selectedFolder() {
        return this.$fileStore.state.selectedFolder
      },
      current() {
        return this.$fileStore.state.current
      },
      canRequestSign() {
        let invalid = this.selectedFiles.find(item => {
          return (item.is_official !== undefined && !item.is_official)
            || (item.count_signed_sign_request + item.count_pending_sign_request > 0)
        })
        return this.$permissions.requestSign && invalid === undefined
      },
      title() {
        if (this.selectedFiles.length === 1) {
          return this.selectedFiles[0].name
        } else if (this.selectedFolder.name) {
          return this.selectedFolder.name
        } else if (this.selectedFiles.length > 1) {
          return this.selectedFiles.length + ' ' + this.$trans('file_selected')
        }
        return this.current.name ? this.current.name : ''
      },
      comments() {
        return this.$fileStore.state.comments
      }
    },
    methods: {
      formatSize(size) {
        return formatSize(size);
      },
      reloadCommentComponent() {
        this.showComments = false;
        this.$nextTick(() => {
          this.showComments = true
        })
      },
      loadMoreComment() {
        this.$fileStore.dispatch('loadMoreComments')
      },
      close() {
        this.$emit('close')
      },
      removeFileSelected(payload) {
        this.$fileStore.dispatch('removeFileSelected', payload)
      },
      addComment(e) {
        this.$fileStore.dispatch('addComment', e)
        this.getComments()
      },
      getComments() {
        this.showComments = true
        let files = this.selectedFiles
        let itemComment = this.$fileStore.state.itemComment
        if (files.length === 1 && files[0].id !== itemComment && this.tab === 'comments') {
          this.$fileStore.dispatch('getComments')
        }
      },
    }
  }
</script>
<style>
    .detail-card {
        height: 100%;
    }

    .tab-content {
        height: calc(100% - 48px);
        height: -moz-calc(100% - 48px);
        height: -webkit-calc(100% - 48px);
        overflow-y: auto;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .tab-content::-webkit-scrollbar, .comment-view::-webkit-scrollbar {
        width: 10px;
    }

    .tab-content::-webkit-scrollbar-track, .comment-view::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    .tab-content::-webkit-scrollbar-thumb, .comment-view::-webkit-scrollbar-thumb {
        background: #888;
    }

    .tab-content::-webkit-scrollbar-thumb:hover, .comment-view::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .tab-item {
        height: 100%
    }
</style>
