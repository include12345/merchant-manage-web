<template>
    <transition name="fade">
        <div class="message">
            <mt-header :title="currentSession.remark || currentSession.from">
                <a href="javascript:;" slot="left" @click="back">
                    <mt-button icon="back">返回</mt-button>
                </a>
            </mt-header>
            <div class="lost-msg" v-show="lostConnect">
                <p @click="setLostConnect">点击重新连接</p>
            </div>
            <div class="lost-msg">
                <p @click="listChatRecords">查看历史记录</p>
            </div>
            <div class="message-section">
                <ul class="message-list" ref="list">
                    <message 
                        v-for="message in currentSession.messages"
                        :key="message.messageId"
                        :message="message"
                        :from="currentSession.from"
                        >
                    </message>
                </ul>
            </div> 
            <div class="message-foot">
                <span @click="switchMode" class="btn-mic">
                    <i :class="'icon icon-'+mode"></i>
                </span>
                <input v-show="mode === 'mic'" v-model="msg" id="msgInput" class="msg" @keyup.enter.native="sendMessage"/>
                <mic-status v-show="mode === 'keyboard'" class="msg" @onMsg="onMsg"></mic-status>
                <mt-button class="btn-send" type="primary" size="small" @click="sendMessage">发送</mt-button>
            </div>
        </div>
    </transition>
</template>

<script>
    import Message from './Message.vue'
    import {mapGetters} from 'vuex'
    import MicStatus from './MicStatus.vue'

    import Recorder from 'opus-recorder'
    export default {
        name: 'messageSection',
        components: {Message, MicStatus},
        data() {
            return {
                mode: 'mic',
                msg: ''
            }
        },
        computed: {
            ...mapGetters(['currentSession','lostConnect', 'endTime']),
            // sortedMessages() {
            //     console.log()
            //     return this.currentSession.messages
            //     // .slice()
            //     // .sort((a,b) => a.ctime - b.ctime)
            // }
        },
        watch: {
            'currentSession.lastMessage': function() {
                this.$nextTick(() => {
                    const ul = this.$refs.list
                    ul.scrollTop = ul.scrollHeight
                })
            }
        },
        methods: {
            switchMode() {
                if (this.mode === 'mic') {
                    if(!Recorder.isRecordingSupported()) {
                        this.$message({
                            message: "No Supported",
                            type: "error",
                            duration: 1000
                        });
                    } 
                    this.mode = 'keyboard'
                } else {
                    this.mode = 'mic'
                }
            },
            onMsg(res) {
                this.$store.dispatch('sendMessage', {
                    data: res.data,
                    duration: res.duration,
                    session:this.session
                }).then(() => {
                    this.msg = ''
                }).catch((err) => {
                    this.$message({
                        message: err,
                        type: "error",
                        duration: 1000
                    });
                })
            },
            sendMessage() {
                if(this.msg) {
                    console.log("from:"+this.currentSession.from)
                    this.$store.dispatch('sendMessage', {
                        content:this.msg, 
                        to: this.currentSession.from
                    })
                    this.msg = ''
                        // session:this.session
                    // }).then(() => {
                    //     this.msg = ''
                    // }).catch((err) => {
                    //     this.$message({
                    //         message: err,
                    //         type: "error",
                    //         duration: 1000
                    //     });
                    // })
                }
            },
             setLostConnect() {
                this.$store.dispatch('subscribeMsg')
            },
            listChatRecords() {
                var param = {
                    endTime: this.endTime,
                    from: this.currentSession.from
                }
                this.$store.dispatch('listMessages', param)
            },
            back() {
                this.$store.dispatch('clearSession').then(() => {
                    window.history.length > 1
                    ? this.$router.go(-1) : this.$router.push('/')
                })
            }
            
        },
        destroyed: function() {
            console.log("clearSession:")
            this.$store.dispatch('clearSession')
        }
        // mounted() {
        //     if(!this.session || Object.keys(this.session).length === 0) {
        //         this.$router.push('/')
        //     }
        // }
    }
</script>
<style lang="scss">
.message {
    // width: 100%;
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    
    .lost-msg {
        width: 20%;
        margin:0 auto;
        background-color: #fdf6ec;
        color: #e6a23c;
        p {
            margin: 0;
            padding: 5px 0;
            text-align: center;
        }
    }
    
    .message-section {
        overflow-y: auto;
        flex: 1;
        top:40px;
        // height: calc(100% -89px);
        // max-height: calc(100% -89px);
        width:100%;
        .message-list {
            height: calc(100% - 20px);
            margin: 0;
            list-style: none;
            overflow-y: auto;
            padding: 0 0 20px 0;
            -webkit-overflow-scrolling: touch;
        }
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
    }
    .message-foot {
      width: 100%;
      min-height: 48px;
    //   position: fixed;
      bottom: 0;
    //   left:0;
    //   right: 0;
      display: flex;
    
    //   right: 0;
      .btn-mic {
        width: 30px;
        height: 30px;
        color: #aaa;
        border: 1px solid;
        border-radius: 20px;
        font-size: 1.3em;
        display: inline-block;
        text-align: center;
        line-height: 30px;
        margin: 0 8px;
        i {
          margin: 0;
        }
      }
      .mint-button--small {
        height: 30px;
      }
      .btn-send {
        // .mint-button--small {
        //     height: 30px !important;
        // }
        // position: absolute;
        margin-left: 8px;
        // top: 9px;
        width: 60px;
      }
      .msg {
        width: calc(100% - 140px);
        height: 30px;
        // position: absolute;
        top: 8px;
        left: 50px;
        outline: none;
        border: 1px solid;
        border-radius: 5px;
        color: #aaa;
        margin: 0;
        padding: 0;
      }
    }
}
</style>