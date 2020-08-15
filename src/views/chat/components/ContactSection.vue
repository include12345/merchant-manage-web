<template>
    <div class="contact-session" ref="contactSection">
        
        <mt-index-list>
            <mt-cell class="mt-20 new-friend" title="新的朋友" @click.native="toNewFriend">
                <span slot="icon" class="new-friend-icon cell-icon icon icon-user-plus"></span>
                <mt-badge size="small" color="red" v-show="unreadReqCount">
                    {{unreadReqCountFormat}}
                </mt-badge>
            </mt-cell>
            <template v-for="contact in contacts">
                 <mt-cell :title="contact.remark == null ? contact.friendname : contact.remark"
                        @click.native="toFriendCard(contact.friendname)">
                        <img slot="icon" :src="contact.imageUrl" width="24" height="24">
                 </mt-cell>
            </template>
        </mt-index-list>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    name: 'contact-section',
    computed: {
        ...mapGetters([
            'contacts',
            'unreadReqCount'
        ]),
        unreadReqCountFormat() {
            return this.unreadReqCount > 99 ? '99+' : this.unreadReqCount
        }
    },
    methods: {
        toNewFriend() {
            this.$router.push({path: '/chat/newFriend'})
        },
        toFriendCard(friendName) {
            this.$store.dispatch("getContact", friendName);
            this.$router.push({path: '/chat/friendCard'})
            
        }
    },
    beforeCreate: function() {
        this.$nextTick(function() {
            this.$store.dispatch("getContacts");
        });
  }
}
</script>
<style lang="scss">
    .contact-section {
        .new-friend {
            .mint-badge {
                position: absolute;
                top: 16px;
                right: 32px;
            }
        }
        .new-friend-icon {
            font-size: 24px;
            vertical-align: middle;
            color: #26a2ff;
        }
        .contact {
            .mint-cell-wrapper {
                position: relative;
                .mint-cell-value {
                    position: absolute;
                    left: 10px;
                    top: 6px;
                }
                .mint-cell-title {
                    position: absolute;
                    left: 60px;
                    top: 13px;
                }
            }
        }
    }
    .mint-indexlist {
        ul {
            -webkit-overflow-scrolling: touch;
            .mint-indexsection-index {
                padding: 3px 10px !important;
            }
        }
    }
</style>