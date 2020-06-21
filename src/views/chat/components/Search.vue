<template>
    <transition name="fade">
        <div class="search">
            <mt-search v-model="value"
                cancel-text="取消"
                placeholder="搜索"
                @keyup.enter.native="onSearch">
            </mt-search>
            <div v-for="friend in friendResult">
                <mt-cell :title="friend.username">
                    <mt-button v-if="checkFriendExisted(friend.username)" type="primary" :disabled="true" size="small">已添加</mt-button>
                    <mt-button v-else type="primary" size="small" @click="addFriendRequest(friend.username)">添加</mt-button>
                </mt-cell>
            </div>
        </div>
    </transition>
</template>

<script>
import {MessageBox} from 'mint-ui'
import {searchFriend, addFriendRequest} from '@/api/api';
import {mapGetters} from 'vuex'
export default {
    name: 'search',
    data() {
        return {
            value: '',
            friendName: null,
            hasSearch: false,
            popupVisible: false,
            friendResult: []

        }
    },
    computed: {
        ...mapGetters([
            'friends'
        ]),
        title() {
            return '搜索:' + this.value
        },
        cancelText() {
            return '取消'
        },
        searchText() {
            return '搜索'
        }
    },
    watch: {
        value: function () {
            this.friendResult = []
            this.hasSearch = false
        }
    },
    methods: {
        checkFriendExisted(username) {
            for(var i = 0; i < this.friends.length; i++){
                if(username === this.friends[i]){
                    return true;
                }
            }
            return false;
        },
        onSearch() {
            if (!this.value) {
                return
            }
            if (this.value === this.$store.getters.username) {
                MessageBox.close()
                this.$nextTick(() => {
                    MessageBox.alert(
                        '自己不能添加自己',
                        '提示',
                        {confirmButtonText: '确定'}
                    )
                })
                return
            }
            searchFriend(this.value).then(response => {
                console.log(response)
                 this.friendResult = response
                this.hasSearch = true
            }).catch(error => {
                MessageBox.close()
                this.$nextTick(() => {
                    MessageBox.alert(
                        'error',
                        '提示',
                        {confirmButtonText: '确定'}
                    )
                })
                return
            });
        },
        addFriendRequest(friendName) {
            addFriendRequest(friendName).then(response => {
                this.popupVisible = true
                setTimeout(() => {
                this.popupVisible = false
                this.$router.go(-1)
                }, 2000)
            });
        }
    }
}
</script>
<style lang="scss">
  .search {
    .mint-search {
      height: 52px !important;
    }
    .mint-search-list {
      height: 48px !important;
      padding-top: 52px !important;
    }
    .line {
      height: 10px;
      margin-top: 48px;
      background-color: #d9d9d9;
    }
    .user-info {
      text-align: center;
      margin-top: 20px;
      > p {
        font-size: 18px;
      }
      > button {
        width: 70%;
      }
    }

    .no-data {
      text-align: center;
      font-size: 14px;
    }

    .mint-popup-2 {
      width: 100%;
      height: 50px;
      text-align: center;
      background-color: rgba(0,0,0,.7);
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      color: #fff;
    }

    .v-modal {
      background: transparent !important;
    }
  }
</style>