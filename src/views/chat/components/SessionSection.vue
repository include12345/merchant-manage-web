<template>
    <div class="session-section">
        <mt-loadmore class="load-more" :top-method="loadUnread" @top-status-change="handleTopChange" ref="loadMore">
            <load-more-top slot="top" :topStatus="topStatus"></load-more-top>
            <ul class="session-list">
                <div class="lost-msg" v-show="lostConnect">
                    <p onclick="setLostConnect">点击重新连接</p>
                </div>
                <div class="no-message" v-show="showNoMsg">
                    <div>
                       <img src="@/icons/img/msg.png"/>
                       <h4>暂时没有新消息</h4> 
                    </div>
                </div>
                <session
                    v-for="session in sessions"
                    v-if="session.lastMessage"
                    :key="session.from"
                    :session="session"
                    :active="true"
                    @switch-session="switchSession">
                </session>
            </ul>
        </mt-loadmore>
    </div>
</template>
<script>
import Session from './Session.vue'
import {mapGetters} from 'vuex'
import LoadMoreTop from './LoadMoreTop'
export default {
    name: 'SessionSection',
    data() {
        return {
            topStatus: '',
        }
    },
    components: {LoadMoreTop, Session},
    computed: {
        ...mapGetters([
            'sessions',
            'lostConnect'
        ]),
        showNoMsg() {
            if (Object.keys(this.sessions).length === 0) {
                return true
            }
            for(let i in this.sessions) {
                if (this.sessions[i].lastMessage) {
                    return false
                }
                
            }
            return true
        }
    },
    methods: {
            switchSession (from) {
                this.$store.dispatch('switchSession', from).then(() => {
                    this.$router.push({path: '/chat/messageSection'})
                })
            },
            handleTopChange(status) {
                this.topStatus = status
            },
            setLostConnect() {
                this.$store.dispatch('subscribeMsg')
            },
            loadUnread() {
                // this.$store.dispatch('getUnReadMessages')
            }
    }
}
</script>
<style lang="scss">
    .session-section {
        width: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .load-more {
            background-color: #000;
            .mint-loadmore-top {
                color: #fff;
                background-color: #000;
            }
            .mint-loadmore-content {
                background-color: #f8f8f8;
            }
            .session-list {
                margin: 0;
                padding: 0;
            }
            .lost-msg {
                width: 100%;
                height: 30%;
                background-color: #fdf6ec;
                color: #e6a23c;
                p {
                    margin: 0;
                    padding: 5px 0;
                    text-align: center;
                }
            }
            .no-message {
                text-align: center;
                position: relative;
                div {
                    position: absolute;
                    width: 100%;
                    top: calc(50% -100px);
                    left: 0;
                }
                h4 {
                    margin: 0;
                    color: #818181;
                }
            }
            @keyframes spin {
                0% { transform: rotate(360deg);}
                100% {transform: rotate(0deg);}
            }
        }
    }
</style>