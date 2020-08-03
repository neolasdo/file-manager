<template>
  <div>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list dense tile>
        <v-list-item @click="openFolder">
          <v-list-item-icon>
            <v-icon>mdi-folder-open</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans("open") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="openFormModal()" v-if="$permissions.edit">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans("rename") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="addClipboard" v-if="$permissions.moveFolder">
          <v-list-item-icon>
            <v-icon>mdi-clipboard-plus-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{
              $trans("add_to_clipboard")
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="move" v-if="$permissions.moveFolder">
          <v-list-item-icon>
            <v-icon>mdi-folder-move</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans("move_to") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="deleteFolder(item.id)" v-if="$permissions.delete">
          <v-list-item-icon>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $trans("delete") }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <move-files-modal ref="moveModal" />
  </div>
</template>

<script>
import MoveFilesModal from "./MoveFilesModal";

export default {
  components: {
    "move-files-modal": MoveFilesModal,
  },
  data() {
    return {
      showEditModal: false,
      name: "",
    };
  },
  computed: {
    current() {
      return this.$fileStore.state.current;
    },
    x() {
      return this.$fileStore.state.pointerEvent.x;
    },
    y() {
      return this.$fileStore.state.pointerEvent.y;
    },
    showMenu: {
      get: function() {
        return this.$fileStore.state.showFolderContext;
      },
      set: function(newValue) {
        if (!newValue) {
          this.$fileStore.dispatch("hideContext");
        }
      },
    },
    item() {
      return this.$fileStore.state.selectedFolder;
    },
  },
  methods: {
    getByFolder(payload) {
      this.$fileStore.dispatch("getByFolder", payload);
    },
    deleteFolder(payload) {
      this.$confirm(this.$trans("confirm_delete_folder"), {
        buttonTrueColor: "error",
      }).then((res) => {
        if (res) {
          this.$fileStore.dispatch("deleteFolder", payload);
        }
      });
    },
    openFormModal(payload) {
      this.$fileStore.dispatch("openFormModal", payload);
    },
    addClipboard() {
      this.$fileStore.dispatch("addFolderToClipboard");
    },
    move() {
      this.$refs.moveModal.showDialog();
    },
    openFolder() {
      this.getByFolder(this.item);
    },
  },
};
</script>
