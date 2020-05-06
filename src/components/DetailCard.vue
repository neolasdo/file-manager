<template>
  <v-card class="mx-auto pa-2" min-height="500px" tile>
    <div class="d-flex flex-row-reverse">
      <v-btn icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <v-card-text>
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="12" v-if="!selectedFiles.length && !selectedFolder.hasOwnProperty('id')">
            <b>Please select a file or folder to view detail</b>
          </v-col>
          <v-col cols="12" v-if="selectedFolder.hasOwnProperty('id')">
            Folder id: {{ selectedFolder.id }}<br>
            Folder name: {{ selectedFolder.name }}<br>
          </v-col>
          <v-col cols="12" v-if="selectedFiles.length">
            <b>{{ selectedFiles.length }} items selected</b>
          </v-col>
          <v-col cols="12" v-if="selectedFiles.length === 1">
            File id: {{ selectedFiles[0].id }}<br>
            File name: {{ selectedFiles[0].name }}<br>
            File type: {{ selectedFiles[0].mime }}<br>
            File size: {{ formatSize(selectedFiles[0].size) }}<br>
            Created: {{ selectedFiles[0].created_at }}<br>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  import {formatSize} from '@/helpers/file'

  export default {
    name: 'DetailCard',
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
    },
    methods: {
      formatSize(size) {
        return formatSize(size);
      },
      close() {
        this.$emit('close')
      }
    }
  }
</script>
