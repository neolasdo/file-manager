<template>
  <div>
    <v-menu v-model="showMenu" :position-x="x" :position-y="y" absolute offset-y>
      <v-list dense tile>
        <v-list-item @click="openFolder">
          <v-list-item-icon>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('open') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openFormModal()" v-if="$permissions.edit">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('rename') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteFolder(item)" v-if="$permissions.delete">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans('delete') }}</v-list-item-title>
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
        this.$confirm(this.$trans('confirm_delete_folder'), {
          buttonTrueColor: 'error'
        }).then(res => {
          if (res) {
            this.$fileStore.dispatch('deleteFolder', payload)
          }
        })
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
