<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="500px" scrollable>
      <v-card>
        <v-card-title class="primary lighten-1" tile dark>
          <span style="color: #fff !important">{{
            $trans("request_sign")
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-list dense max-height="300px" class="scrollable mt-3">
            <v-list-item v-for="(item, index) in files" :key="index">
              <v-list-item-avatar tile>
                <v-img :src="fileThumbnail(item)" alt=""></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle
                  v-text="formatSize(item.size)"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-form v-model="valid" ref="form">
            <v-row>
              <v-col cols="12">
                <v-switch
                  v-model="sendThirdParty"
                  :readonly="readOnlySwitch"
                  class="v-input--reverse"
                >
                  <template #label>
                    第三者に署名依頼を送信
                  </template>
                </v-switch>
              </v-col>
              <v-col cols="12" v-if="sendThirdParty">
                <label for="email" class="app-label required"
                  >メールアドレス</label
                >
                <v-text-field
                  class="custom-input mt-2"
                  dense
                  :counter="20"
                  :error-messages="validate.email"
                  :rules="rules.emailRules"
                  outlined
                  hide-details
                  v-if="sendThirdParty"
                  v-model="thirdPartyEmail"
                  id="email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="sendThirdParty">
                <label for="phone" class="app-label">電話番号</label>
                <v-text-field
                  class="custom-input mt-2"
                  dense
                  :counter="320"
                  :error-messages="validate.phone"
                  :rules="rules.phoneRules"
                  outlined
                  hide-details
                  v-model="thirdPartyPhone"
                  id="phone"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-content-center">
          <v-btn
            color="primary"
            tile
            dark
            @click="requestSign"
            :disabled="!isValid"
          >
            {{ $trans("request_sign") }}
          </v-btn>
          <v-btn color="default" class="ml-2" dark tile @click="closeModal()"
            >{{ $trans("close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { getFileThumbnail, formatSize } from "@/helpers/file";

export default {
  data() {
    return {
      reload: false,
      valid: false,
      sendThirdParty: false,
      thirdPartyEmail: "",
      thirdPartyPhone: "",
      readOnlySwitch: false,
      rules: {
        phoneRules: [
          (v) => !v || v.length < 20 || "20文字以内で入力してください。",
        ],
        emailRules: [
          (v) => !!v || "これは必須項目です。",
          (v) =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "メール形式が正しくありません。",
          (v) => (v && v.length < 320) || "320文字以内で入力してください。",
        ],
      },
      validate: {
        phone: [],
        email: [],
      },
    };
  },
  methods: {
    hideRequestModal() {
      this.$fileStore.commit("HIDE_SIGN_MODAL");
    },
    reloadAction() {
      this.$fileStore.dispatch("reload");
    },
    closeModal() {
      this.hideRequestModal();
      if (this.reload) {
        this.reloadAction();
      }
    },
    fileThumbnail(item) {
      return getFileThumbnail(item);
    },
    formatSize(size) {
      return formatSize(size);
    },
    requestSign() {
      let formData = {
        files: this.files.map(item => {
          return item.id
        }),
      }
      if (this.sendThirdParty) {
        formData.send_third_party = this.sendThirdParty
        formData.email = this.thirdPartyEmail
        formData.phone = this.thirdPartyPhone
      }
      if (this.readOnlySwitch) {
        this.createThirdPartySignRequest(formData)
      } else {
        this.createSignRequest(formData)
      }
    },
    async createSignRequest(data) {
      this.$fileStore.commit('LOADING');
      let endpoint = this.$getEndpoint('request_sign')
      let response = this.$axios({
        method: endpoint.method,
        url: endpoint.route,
        data: data
      })
      await response.then(res => {
        this.$fileStore.commit('UNLOADING');
        this.$fileStore.dispatch('reload')
        if (res.data && res.data.message) {
          this.$snackbar(res.data.message, {
            color: 'success'
          })
        }
        this.$fileStore.commit('HIDE_SIGN_MODAL')
        if (this.$fileStore.state.clearClipboard) {
          this.$fileStore.commit('RESET_CLIPBOARD')
        }
      }).catch(errors => {
        this.$fileStore.commit('UNLOADING');
        this.valid = false;
        let status = errors.response.status;
        if(status === 400) {
          let err = errors.response.data.data;
          for (let field in err) {
            this.validate[field] = err[field]
          }
        }
        if([403, 500, 404].includes(status)) {
          this.$snackbar(errors.response.data.message, {
            color: 'error'
          });
        }
      });
    },
    async createThirdPartySignRequest(data) {
      let endpoint = this.$getEndpoint('request_sign_third_party')
      let response = this.$axios({
        method: endpoint.method,
        url: endpoint.route,
        data: data
      })
      await response.then(res => {
        this.$fileStore.commit('UNLOADING');
        this.$fileStore.dispatch('reload')
        if (res.data && res.data.message) {
          this.$snackbar(res.data.message, {
            color: 'success'
          })
        }
        this.$fileStore.commit('HIDE_SIGN_MODAL')
        if (this.$fileStore.state.clearClipboard) {
          this.$fileStore.commit('RESET_CLIPBOARD')
        }
      }).catch(errors => {
        this.$fileStore.commit('UNLOADING');
        this.valid = false;
        let status = errors.response.status;
        if(status === 400) {
          let err = errors.response.data.data;
          for (let field in err) {
            this.validate[field] = err[field]
          }
        }
        if([403, 500, 404].includes(status)) {
          this.$snackbar(errors.response.data.message, {
            color: 'error'
          });
        }
      });
    },
  },
  computed: {
    current() {
      return this.$fileStore.state.current;
    },
    showDialog() {
      return this.$fileStore.state.showRequestSignModal;
    },
    files() {
      return this.$fileStore.state.requestSignFiles;
    },
    isValid() {
      return (this.sendThirdParty && this.valid) || !this.sendThirdParty;
    },
  },
  watch: {
    showDialog(newVal) {
      if (newVal) {
        if (this.$refs.form) {
          this.$refs.form.reset();
        }
        let canRequestSign3Party = this.files.filter((item) => {
          return item.can_request_sign_third_party;
        });
        if (canRequestSign3Party.length === this.files.length) {
          this.sendThirdParty = true
          this.readOnlySwitch = true
        } else {
          this.sendThirdParty = false
          this.readOnlySwitch = false
        }
      }
    },
    thirdPartyEmail() {
      this.valid = true;
      this.validate['email'] = '';
    },
    thirdPartyPhonne() {
      this.valid = true;
      this.validate['phone'] = '';
    }
  },
};
</script>
<style lang="scss">
.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;
  .v-application--is-ltr & {
    .v-input--selection-controls__input {
      margin-right: 0;
      margin-left: 8px;
    }
  }
  .v-application--is-rtl & {
    .v-input--selection-controls__input {
      margin-left: 0;
      margin-right: 8px;
    }
  }
}
</style>
