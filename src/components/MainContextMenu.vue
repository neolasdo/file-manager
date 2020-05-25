<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="openFormModal" v-if="$permissions.create">
          <v-list-item-icon>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('add_folder') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openUploadModal" v-if="$permissions.upload">
          <v-list-item-icon>
            <v-icon>mdi-file-upload</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('upload') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="moveFiles" v-if="$permissions.move && clipboard.files.length + clipboard.folders.length">
          <v-list-item-icon>
            <v-icon>mdi-file-move</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('move_to_this') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    name: 'DocumentContextMenu',
    computed: {
      selectedItems() {
        return this.$fileStore.state.selectedItems
      },
      current() {
        return this.$fileStore.state.current
      },
      clipboard() {
        return this.$fileStore.state.clipboard
      },
    },
    data() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
      }
    },
    methods: {
      createFolder(payload) {
        this.$fileStore.dispatch('createFolder', payload)
      },
      resetSelectedFiles() {
        this.$fileStore.dispatch('resetSelectedFiles')
      },
      openUploadModal() {
        this.$fileStore.dispatch('openUploadModal')
      },
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      moveFiles() {
        this.$confirm(this.$trans('confirm_move_files'), {
          buttonTrueColor: 'warning'
        }).then(res => {
          if (res) {
            this.$fileStore.dispatch('moveFiles')
          }
        })
      },
      showContextMenu(e) {
        this.showMenu = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.resetSelectedFiles()
        this.$nextTick(() => {
          this.showMenu = true;
        });
      },
      hideContextMenu() {
        this.showMenu = false;
      }
    }
  }
</script>
