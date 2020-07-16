<template>
  <v-dialog v-model="show" max-width="500px" scrollable>
    <v-card>
      <v-card-title>{{title}}</v-card-title>
      <v-card-text style="height: 300px;" class="pa-0">
        <v-divider />
        <v-list dense>
          <v-overlay :value="selfLoading" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
          <v-alert
            v-if="(current.children && !current.children.length) && (current.files && !current.files.length) && !selfLoading"
            text
            color="info"
          >
            <h3>{{ $trans('empty_folder') }}</h3>
          </v-alert>
          <v-list-item @click="getFolders(current.parent_id)" v-if="current.id">
            <v-list-item-icon>
              <v-icon>mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-content>...</v-list-item-content>
          </v-list-item>
          <template v-for="item in current.children">
            <v-list-item
              :key="item.id"
              v-if="item.hasChildren || (item.children && item.children.length)"
            >
              <v-list-item-icon>
                <v-icon>mdi-folder</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon small @click="getFolders(item.id)">
                  <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
          <v-list-item-group v-model="selected" multiple active-class="primary lighten-2">
            <v-list-item
              v-for="item in current.files"
              :key="item.id"
              :disabled="disabledSelect(item)"
            >
              <v-list-item-avatar tile>
                <v-img :src="fileThumbnail(item)" alt></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text class="text-right">
                  <strong v-if="item.label" :class="item.label_color+'--text'">{{item.label}}</strong>
                  <br />
                  <strong>{{formatSize(item.size)}}</strong>
                  <br />
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="submitSelect" :disabled="!selected.length">{{ $trans('select') }}</v-btn>
        <v-btn color="primary" text @click="close">{{ $trans('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getFileThumbnail, formatSize } from "../helpers/file";
export default {
  props: {
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    disableFiles: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      selfLoading: false,
      current: {
        files: [],
        children: [],
        name: "",
        id: undefined
      },
      selected: []
    };
  },
  computed: {
    title() {
      return this.current.name;
    },
    disableFileIds() {
      return this.disableFiles.map(item => {
        return item.id;
      });
    },
    type() {
      return this.$fileStore.state.requestingType;
    }
  },
  methods: {
    disabledSelect(item) {
      if (this.type === "sign") {
        return (
          !(item.is_official &&
            !item.count_signed_sign_request &&
            !item.count_pending_sign_request) ||
          this.disableFileIds.includes(item.id)
        );
      } else {
        return (
          !(item.is_official && !item.count_pending_approval_request) ||
          this.disableFileIds.includes(item.id)
        );
      }
    },
    formatSize(size) {
      return formatSize(size);
    },
    async getFolders(folderId) {
      this.selected = [];
      this.selfLoading = true;
      let endpoint = this.$fileStore.$getEndpoint("get");
      let data = {};
      if (folderId) {
        data.folder_id = folderId;
      }
      let response;
      if (endpoint.method.toUpperCase() === "GET") {
        response = this.$fileStore.$axios.get(endpoint.route, {
          params: data
        });
      } else {
        response = this.$fileStore.$axios({
          method: endpoint.method,
          url: endpoint.route,
          data: data
        });
      }
      await response
        .then(res => {
          this.current = res.data.data;
          this.selfLoading = false;
        })
        .catch(error => {
          this.selfLoading = false;
          let errMess = this.$trans("server_error");
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            errMess = error.response.data.message;
          }
          if (error.data && error.data.message) {
            errMess = error.data.message;
          }
          this.$fileStore.$snackbar(errMess, {
            color: "error"
          });
        });
    },
    fileThumbnail(item) {
      return getFileThumbnail(item);
    },
    submitSelect() {
      let vm = this;
      let selectedFiles = this.current.files.filter(function(item, index) {
        return vm.selected.includes(index);
      });
      this.$emit("on-select", selectedFiles);
      this.close();
    },
    close() {
      (this.current = {
        files: [],
        children: [],
        name: "",
        id: undefined
      }),
        (this.selected = []);
      this.$emit("close");
    }
  },
  watch: {
    show(val, oldVal) {
      if (val !== oldVal && val) {
        this.getFolders();
      }
    }
  }
};
</script>
