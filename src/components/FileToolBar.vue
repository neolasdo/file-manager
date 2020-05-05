<template>
  <div>
    <v-toolbar color="primary" dark>
      <v-text-field dark v-model="keyword">
        <template slot="prepend-inner">
          <slot name="search_box_prepend"></slot>
        </template>
        <v-btn icon tile small slot="append" @click="search">
          <v-icon>search</v-icon>
        </v-btn>
      </v-text-field>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn tile v-on="on" dark outlined>
            <v-icon>add</v-icon> New
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
            <v-icon>menu</v-icon>
          </v-btn>
        </template>
        <v-list tile dense>
          <slot name="additionMenuItem"></slot>
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
  import {mapActions, mapState} from 'vuex'

  export default {
    name: 'FileToolBar',
    data() {
      return {
        keyword: '',
      }
    },
    computed: {
      ...mapState({
        selectedFiles: state => state.fileManager.selectedFiles,
        current: state => state.fileManager.current,
        keywordState: state => state.fileManager.keyword,
      }),
    },
    methods: {
      ...mapActions({
        openUploadModal: 'fileManager/openUploadModal',
        openFormModal: 'fileManager/openFormModal',
        search: 'fileManager/search',
      }),
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
