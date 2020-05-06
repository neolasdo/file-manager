<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="openFolder">
          <v-list-item-icon>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Open</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openFormModal()">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Rename</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteFolder(item)">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        showMenu: false,
        x: 0,
        y: 0,
        showEditModal: false,
        name: ''
      }
    },
    computed: {
      current() {
        return this.$fileStore.state.current
      },
    },
    methods: {
      getByFolder(payload) {
        this.$fileStore.dispatch('getByFolder', payload)
      },
      deleteFolder(payload) {
        this.$fileStore.dispatch('deleteFolder', payload)
      },
      editFolderName(payload) {
        this.$fileStore.dispatch('editFolderName', payload)
      },
      openFormModal(payload) {
        this.$fileStore.dispatch('openFormModal', payload)
      },
      showContextMenu(e) {
        this.showMenu = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.$nextTick(() => {
          this.showMenu = true;
        });
      },
      hideContextMenu() {
        this.showMenu = false;
      },
      openFolder() {
        this.getByFolder(this.item)
      },
    }
  }
</script>
