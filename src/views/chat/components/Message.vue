<template>
    <li class="message-list-item">
        <div :class="'message-text' + (isMe ? ' text-left' : ' text-right')" @click="play">
            <svg v-show="loading" class="loading" version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40px" height="40px" viewbox="0 0 50 50" style="enable-backendgroup:new 0 0 50 50;" xml:space="preserve">
                <!-- <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" transform="rotate(325.811 25 25)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>
                </path> -->
            </svg>
            <i v-show="isTimeout" @click="resend" style="color: #F56C6C" class="icon icon-notification loading"></i>
            <span v-if="message.duration" :style="'width:' +(message.duration * 18) + 'px'">
                <span class=duration>{{message.duration + "''"}}</span>
                <i :class="'icon icon-' +(playing ? 'pause2' : 'play3')"></i>
                <!-- <audio ref="audio" :src="host + '/apis/user/getVoice/' + message.id + '.wav'" preload="none"></audio> -->
            </span>
            <font>{{message.content}}</font>
        </div>
        <img :class="'user-icon' +(isMe ? ' icon-left' : ' icon-right')" width="24" height="24" :src="imgSrc">
    </li>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    
    name: 'message',
    data() {
        return {
            host:window.location + "//" + window.location.host,
            playing: false
        }
    },
    computed: {
        ...mapGetters(['currentSession','tokens']),
        isMe() {
            return this.message.to != this.from
        },
        loading() {
            return this.message.to != this.from && !this.message.sent && !this.message.timeout
        },
        istimeout() {
            console.log("this.message:" + this.message)
            // return this.message.isMe && this.message.timeout
        },
        profilePhoto() {
            let info = this.friendsInfo[this.session.from]
            if(info) {
                return info.profilePhoto
            }
            return ''
        },
        imgSrc() {
          console.log("currentSession:" + JSON.stringify(this.currentSession))
          console.log("imageUrl:" + this.tokens.imageUrl + ","+this.currentSession.imageUrl)
            let imageUrl = this.message.to == this.from ? this.tokens.imageUrl : this.currentSession.imageUrl
           console.log("imageUrl:" + imageUrl)

            return imageUrl
        }
    },
    props: {
        message: Object,
        from: String
    },
    methods: {
        resend() {
            this.$store.dispatch('resend', this.message)
        },
        play() {
            const audio = this.$refs.audio
            if(this.playing) {
                clearTimeout(this.cleanId)
                audio.pause()
                audio.playing = false
            } else {
                audio.play()
                this.playing = true
                this.cleanId = setTimeout(() => {
                    clearTimeout(this.cleanId)
                    audio.pause()
                    audio.currentTime = 0
                    this.playing = false
                }, (this.message.duration + 1) * 1000)
            }
        }
    }
}
</script>
<style lang="scss">
  .message-list-item {
    position: relative;
    margin-top: 20px;
    min-height: 43px;
    overflow: hidden;
    .message-text {
      position: relative;
      width: auto;
      max-width: 65%;
      min-height: 27px;
      border-radius: 5px;
      line-height: 25px;
      font-size: 16px;
      text-align: left;
      padding: 8px;
      word-break: break-all;
      > span {
        display: inline-block;
        max-width: 180px;
      }
    }

    .message-text:before {
      position: absolute;
      content: "";
      width: 0;
      height: 0;
      top: 10px;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
    }
    .text-right {
      float: right;
      margin-right: 78px;
      background: #62b900;
      > span {
        text-align: right;
      }
      .duration {
        position: absolute;
        left: -25px;
      }
    }
    .text-right:before {
      right: -7px;
      border-left: 10px solid #62b900;
    }

    .text-left {
      float: left;
      margin-left: 78px;
      background: #d0e6b8;
      > span {
        text-align: left;
      }
      .duration {
        position: absolute;
        right: -25px;
      }
    }
    .text-left:before {
      left: -7px;
      border-right: 10px solid #d0e6b8;
    }

    .user-icon {
      width: 44px;
      height: 44px;
      border-radius: 5px;
    }

    .icon-right {
      position: absolute;
      top: 0;
      right: 20px;
    }

    .icon-left {
      position: absolute;
      top: 0;
      left: 20px;
    }
    .loading {
      position: absolute;
      top: calc(50% - 8px);
      width: 16px;
      height: 16px;
      left: -25px;
    }
  }

</style>