<template>
  <div>
    <div class="folder-section text-left" v-if="folders && folders.length">
      <h4 class="pl-3">{{ $trans('folders') }}</h4>
      <v-col cols="12">
        <v-row align="start" justify="start">
          <v-hover v-slot:default="{ hover }" v-for="(item, index) in folders" :key="index">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-card class="pa-2 dir-card ma-2" :class="{'active': checkFolderSelected(item)}"
                        :elevation="hover ? 8 : 4" ref="folders" tile v-on="on" width="180"
                        @contextmenu.prevent.stop="showContextMenu(item, $event)"
                        @click.prevent.stop="selectFolder(item)"
                        @dblclick.stop.prevent="openFolder(item)">
                  <v-list-item dense class="pa-1">
                    <v-list-item-icon class="mr-3">
                      <v-icon>mdi-folder</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </template>
              <span>{{ item.name }}</span>
            </v-tooltip>
          </v-hover>
        </v-row>
      </v-col>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selectedItem: {},
        showContext: false
      }
    },
    computed: {
      folders() {
        return this.$fileStore.state.folders
      },
      selectedFolder() {
        return this.$fileStore.state.selectedFolder
      },
    },
    methods: {
      getByFolder(payload) {
        this.$fileStore.dispatch('getByFolder', payload)
      },
      selectFolder(payload) {
        this.$fileStore.dispatch('selectFolder', payload)
      },
      openFolder(item) {
        this.getByFolder(item)
      },
      showContextMenu(item, e) {
        this.selectFolder(item)
        this.$fileStore.dispatch('showFolderContextMenu', {
          x: e.clientX,
          y: e.clientY
        })
      },
      checkFolderSelected(item) {
        return this.selectedFolder && item.id === this.selectedFolder.id
      }
    }
  }
</script>
<style>
  .dir-card.active {
    color: #4385f4 !important;
    background-color: #E8F0FE !important;
    border: 1px solid #4385f4 !important
  }

  .dir-card:not(.active) {
    color: #000 !important;
    background-color: #fff !important;
    border: 1px solid #fff !important
  }
</style>
