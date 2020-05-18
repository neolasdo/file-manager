<template>
    <v-card class="mx-auto pa-2" min-height="500px" tile>
        <v-container fluid class="pa-0">
            <v-toolbar flat>
                <v-toolbar-title v-text="title"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-tabs>
                <v-tab>
                    <v-icon left>mdi-information-outline</v-icon>
                </v-tab>
                <v-tab v-if="selectedFiles.length === 1">
                    <v-icon left>mdi-comment-multiple-outline</v-icon>
                </v-tab>
                <v-tab-item>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" v-if="!selectedFiles.length && !selectedFolder.hasOwnProperty('id')">
                                <b>Please select a file or folder to view detail</b>
                            </v-col>
                            <v-col cols="12" v-if="selectedFolder.hasOwnProperty('id')">
                                Folder id: {{ selectedFolder.id }}<br>
                                Folder name: {{ selectedFolder.name }}<br>
                            </v-col>
                            <v-col cols="12" v-if="selectedFiles.length > 1">
                                <v-list dense>
                                    <v-subheader>Files</v-subheader>
                                    <v-list-item-group>
                                        <v-list-item v-for="(item, i) in selectedFiles" :key="i">
                                            <v-list-item-content>
                                                <v-list-item-title class="font-weight-bold" v-text="item.name"></v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-btn icon small>
                                                    <v-icon @click="removeFileSelected(i)" color="grey lighten-1">mdi-close</v-icon>
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-list-item-group>
                                </v-list>
                            </v-col>
                            <v-col cols="12" v-if="selectedFiles.length === 1">
                                File id: {{ selectedFiles[0].id }}<br>
                                File name: {{ selectedFiles[0].name }}<br>
                                File type: {{ selectedFiles[0].mime }}<br>
                                File size: {{ formatSize(selectedFiles[0].size) }}<br>
                                Created: {{ selectedFiles[0].created_at }}<br>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-tab-item>
                <v-tab-item v-if="selectedFiles.length === 1">
                    <v-card-text>
                        <v-row>
                          <v-col cols="12">
                            COMMENTS
                          </v-col>
                        </v-row>
                    </v-card-text>
                </v-tab-item>
            </v-tabs>
        </v-container>
    </v-card>
</template>

<script>
  import {formatSize} from '@/helpers/file'

  export default {
    name: 'DetailCard',
    data() {
      return {
        tab: null,
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
      title() {
        if (this.selectedFiles.length === 1) {
          return this.selectedFiles[0].name
        } else if (this.selectedFolder.name) {
          return this.selectedFolder.name
        } else if (this.selectedFiles.length > 1) {
          return this.selectedFiles.length + ' files selected'
        }
        return ''
      }
    },
    methods: {
      formatSize(size) {
        return formatSize(size);
      },
      close() {
        this.$emit('close')
      },
      removeFileSelected(payload) {
        this.$fileStore.dispatch('removeFileSelected', payload)
      },
    }
  }
</script>
