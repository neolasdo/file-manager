<template>
    <div style="height: 100% !important;">
        <v-card-text class="comment-view">
            <div ref="containerMessageDisplay" class="container-message-display" id="scrollDiv">
                <div v-for="(item, index) in comments" :key="index" class="message-container"
                     v-scroll:#scrollDiv="onScroll">
                    <template v-if="item.isMy">
                        <div class="myself-message-body">
                            <div class="message-content">
                                <template>
                                    <div class="message-text" :style="{background: '#1976d2', color: '#fff'}">
                                        <p class="message-username">{{item.author.name ? item.author.name :
                                            item.author.email}}</p>
                                        <p>{{item.message}}</p>
                                    </div>
                                </template>
                                <div class="message-timestamp" :style="{'justify-content': 'baseline'}">
                                    {{ item.created_at }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="other-message-body">
                            <div class="message-content">
                                <template>
                                    <div class="message-text" :style="{background: '#fff', color: '#525252'}">
                                        <p class="message-username">{{item.author.name ? item.author.name :
                                            item.author.email}}</p>
                                        <p>{{item.message}}</p>
                                    </div>
                                </template>
                                <div class="message-timestamp" :style="{'justify-content': 'flex-end'}">
                                    {{ item.created_at }}
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </v-card-text>
        <v-card-actions v-if="canAddComment">
            <v-text-field v-model="newMessage" label="コメントを入力" type="text" no-details hide-details
                          append-outer-icon="mdi-send" class="ma-0 pa-0" outlined
                          @keyup.enter="addComment" @click:append-outer="addComment"/>
        </v-card-actions>
    </div>
</template>

<script>
  export default {
    props: {
      comments: {
        type: Array,
        default() {
          return []
        }
      },
      canAddComment: {
        type: Boolean,
        default() {
          return true
        }
      }
    },
    data() {
      return {
        newMessage: '',
        scrolled: false,
        triggerScroll: true,
        scrollHeight: 0
      }
    },
    methods: {
      onScroll(e) {
        if (e.target.scrollTop === 0) {
          this.$emit('loadMore')
          this.scrolled = false
        }
      },
      addComment() {
        if (this.newMessage.trim() !== '') {
          this.$emit('addComment', this.newMessage.trim())
          this.newMessage = ''
          this.scrollHeight = 0
          this.scrollToEnd()
        }
      },
      scrollToEnd() {
        if (this.$refs.containerMessageDisplay) {
          let scrollDiv = this.$refs.containerMessageDisplay;
          scrollDiv.scrollTop = scrollDiv.scrollHeight - this.scrollHeight;
          this.scrollHeight = scrollDiv.scrollHeight
          this.scrolled = true
        }
      },
    },
    updated () {
      this.$nextTick(function () {
        if (!this.scrolled) {
          this.scrollToEnd()
        }
      })
    },
  }
</script>

<style>
    .comment-view {
        height: calc(100% - 32px);
        overflow-y: auto;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .container-message-display {
        padding: 20px 0;
        background-color: #f2f2f2;
        height: 100% !important;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-x: hidden;
    }
    .container-message-display .message-text > p {
        margin: 5px 0 5px 0;
        font-size: 14px;
    }
    .container-message-display .other-message > .message-timestamp {
        text-align: right;
    }
    .container-message-display .my-message {
        justify-content: flex-start;
        padding-left: 15px;
        align-items: flex-start;
    }
    .container-message-display .other-message > .message-text {
        border-bottom-right-radius: 0;
    }
    .container-message-display .my-message > .message-text {
        color: #fff;
        border-bottom-left-radius: 0;
    }
    .container-message-display .message-container {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
    }
    .container-message-display .message-username {
        font-size: 0.85rem !important;
        font-weight: bold;
    }
    .container-message-display::-webkit-scrollbar {
        width: 10px;
    }
    .container-message-display::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    .container-message-display::-webkit-scrollbar-thumb {
        background: #888;
    }
    .container-message-display::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    .myself-message-body {
        display: flex;
        align-items: flex-end;
        padding-left: 10px;
    }
    .other-message-body {
        display: flex;
        align-items: flex-end;
        padding-right: 10px;
        justify-content: flex-end;
    }
    .message-content{
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        width: 100%;
    }
    .other-message-body .message-content{
        align-items: flex-end;
    }
    .myself-message-body .message-content{
        align-items: flex-start;
    }
    .message-timestamp {
        padding: 2px 7px;
        border-radius: 15px;
        margin: 0;
        max-width: 75%;
        overflow-wrap: break-word;
        text-align: left;
        font-size: 10px;
        color: #bdb8b8;
        width: 100%;
        display: flex;
        align-items: center;
    }
    .message-text {
        background: #fff;
        padding: 6px 10px;
        line-height: 14px;
        border-radius: 15px;
        margin: 5px 0 5px 0;
        max-width: 80%;
        overflow-wrap: break-word;
        text-align: left;
        white-space: pre-wrap;
        word-break: break-word;
    }
    .myself-message-body .message-text {
        border-bottom-left-radius: 0px;
    }
    .other-message-body .message-text {
        border-bottom-right-radius: 0px;
    }
</style>
