<template>
    <div class="wc-session" @click="$emit('switch-session', session.from)">
        <mt-cell 
        :title="session.remark || session.from"
        :label="session.lastMessage.content"
        >
            
        
        </mt-cell>
        <span class="time">{{ getTime(session.lastMessage.ctime)}}</span>
        <mt-badge size="small" color="red" v-show="session.unreadMsgCount">
            {{session.unreadMsgCount > 99 ? '99+' : session.unreadMsgCount}}
        </mt-badge>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {dateFormatNoTable} from '@/utils/timeFormat'
export default {
    name: 'Session',
    props: {
        session: Object,
        active: Boolean
    },
    computed: {
        ...mapGetters({
            friendsInfo: 'friendsInfo'
        }),

    },
    methods: {
        getTime(ctime) {
            return dateFormatNoTable(ctime)
        }
    }
    
}
</script>
<style lang="scss">
    .wc-session {
        position: relative;
        height: 60px;
        .mint-cell {
            .mint-cell-value {
                position: absolute;
                left: 10px;
                top: 7px;
                img {
                    border-radius: 5px;
                }
            }
            .mint-cell-wrapper {
                height: 60px !important;
                .mint-cell-title {
                    position: absolute;
                    left: 65px;
                    height: 45px;
                    top: 8px;
                    width: 100%;
                    .mint-cell-text {
                        font-size: 16px;
                    }
                    .mint-cell-label {
                        font-size: 14px;
                        margin-top: 9px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 80%;
                    }
                }
            }
        }
        .time {
            position: absolute;
            right: 40px;
            top: 15px;
            font-size: 14px;
            color: #888;
        }
        .mint-badge {
            position: absolute;
            top: 15px;
            right: 2px
        }
    }
</style>