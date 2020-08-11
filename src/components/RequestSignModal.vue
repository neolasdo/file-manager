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
                  :readOnly="readOnlySwitch"
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
                  :error-messages="validate.emailErrors"
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
                  :error-messages="validate.phoneErrors"
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
        phoneErrors: [],
        emailErrors: [],
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
      this.$fileStore.dispatch("requestSign", {
        files: this.files,
        sendThirdParty: this.sendThirdParty,
        thirdPartyEmail: this.thirdPartyEmail,
        thirdPartyPhone: this.thirdPartyPhone,
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
    forceSend() {
      let canRequestSign3Party = this.files.filter((item) => {
        return item.can_request_sign_third_party;
      });
      return canRequestSign3Party.length === this.files.length
    }
  },
  watch: {
    showDialog(newVal) {
      if (newVal) {
        if (this.$refs.form) {
          this.$refs.form.reset();
        }
      }
    },
    forceSend(val) {
      if (val) {
        this.sendThirdParty = true
        this.readOnlySwitch = true
      } else {
        this.sendThirdParty = false
        this.readOnlySwitch = false
      }
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
