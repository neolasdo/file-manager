<template>
  <div>
    <v-list two-line subheader dense v-if="folders && folders.length">
      <v-subheader>{{ $trans("folders") }}</v-subheader>

      <v-list-item
        v-for="(item, index) in folders"
        class="folder-item"
        :key="index"
        :class="{ active: checkFolderSelected(item) }"
        @contextmenu.prevent.stop="showContextMenu(item, $event)"
        @click.prevent.stop="selectFolder(item)"
        @dblclick.stop.prevent="openFolder(item)"
      >
        <v-list-item-avatar>
          <v-icon>mdi-folder</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-subtitle v-text="item.created_at"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedItem: {},
      showContext: false,
    };
  },
  computed: {
    folders() {
      return this.$fileStore.state.folders;
    },
    selectedFolder() {
      return this.$fileStore.state.selectedFolder;
    },
  },
  methods: {
    getByFolder(payload) {
      this.$fileStore.dispatch("getByFolder", payload);
    },
    selectFolder(payload) {
      this.$fileStore.dispatch("selectFolder", payload);
    },
    openFolder(item) {
      this.getByFolder(item);
    },
    showContextMenu(item, e) {
      this.selectFolder(item);
      this.$fileStore.dispatch("showFolderContextMenu", {
        x: e.clientX,
        y: e.clientY,
      });
    },
    checkFolderSelected(item) {
      return this.selectedFolder && item.id === this.selectedFolder.id;
    },
  },
};
</script>
<style>
.folder-item.active {
  color: #4385f4 !important;
  background-color: #e8f0fe !important;
}

.folder-item:not(.active) {
  color: #000 !important;
  background-color: #fff !important;
}
</style>
