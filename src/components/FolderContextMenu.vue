<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="openFolder">
          <v-list-item-icon>
            <v-icon>folder_open</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Open</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openFormModal()">
          <v-list-item-icon>
            <v-icon>edit</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Rename</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteFolder(item)">
          <v-list-item-icon>
            <v-icon>delete</v-icon>
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
  import {mapActions, mapState} from 'vuex'
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
      ...mapState({
        current: state => state.fileManager.current,
      }),
    },
    methods: {
      ...mapActions({
        getByFolder: 'fileManager/getByFolder',
        deleteFolder: 'fileManager/deleteFolder',
        editFolderName: 'fileManager/editFolderName',
        openFormModal: 'fileManager/openFormModal',
      }),
      showContext(e) {
        this.showMenu = false;
        this.x = e.clientX;
        this.y = e.clientY;
        this.$nextTick(() => {
          this.showMenu = true;
        });
      },
      hideContext() {
        this.showMenu = false;
      },
      openFolder() {
        this.getByFolder(this.item)
      },
    }
  }
</script>
