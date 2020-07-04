<template>
    <transition name="fade">
        <div class="new-friend">
            <mt-header :title="新的朋友">
                <router-link to="/chat/index" slot="left">
                    <mt-button icon="back">返回</mt-button>
                </router-link>
            </mt-header>
            <div style="width:100%;height:40px"></div>
            <div class="mint-searchbar">
                <div class="mint-searchbar-inner">
                    <i class="mintui mintui-search"></i>
                    <input @click="toSearch" readonly="true" type="search" :placeholder="搜索" class="mint-searchbar-core"/>
                </div>
            </div>
            <p class="line">好友请求</p>
            <div id="hide">
                <template v-for="requestContact in requestContacts">
                    <mt-cell :title="requestContact.friendname">
                        <mt-button size="small" type="primary" @click="dealReq(requestContact.friendname, true)">接受</mt-button>
                        <mt-button size="small" type="danger" @click="dealReq(requestContact.friendname, false)" style="margin-left:10px;">拒绝</mt-button>
                    </mt-cell>
             </template>
            </div>
        </div>
    </transition>
</template>

<script>
import Search from './Search'
import {dealFriendReq} from '@/api/api';
import {mapGetters} from 'vuex'
export default {
    name: 'new-friend',
    components: {Search},
    computed: {
      ...mapGetters([
        'requestContacts'
      ])
    },
    methods: {
        toSearch() {
            this.$router.push({path: '/chat/search'})
        },
        dealReq(friendName, status) {
            dealFriendReq(friendName, status).then(response => {
                if (response) {
                    this.$message({
                        message: "处理成功",
                        type: "sucess",
                        duration: 1000
                    });
                    //红点处理unreadReqCount
                    this.$nextTick(function() {
                        this.$store.dispatch("listFriendReq");
                    });
                    return;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
    .new-friend {
        .mint-search {
            height:100% !important;
        }
        .line {
            margin:0;
            padding: 20px;
            border-bottom: 1px solid #d9d9d9;
            text-align: center;
        }
    }
</style>