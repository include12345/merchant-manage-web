<template>
    <transition name="fade">
        <div class="search">
            <mt-search ref="search"
            :placeholder="searchText"
            :cancel-text="cancelText"
            :autofocus="true"
            @click.native="handleClick"
            v-model.trim="value"
            @keyup.enter.native="onSearch">
                <mt-cell v-if="value" :title="title" is-link @click.native="onSearch"></mt-cell>
            </mt-search>
            <div v-if="friendInfo !== null">
                <div class="line"></div>
                <div class="user-info">
                     <p>{{ friendInfo.friendName || friendInfo.username }}</p>
                     <mt-button v-if="friendInfo.friendName" type="primary" :disabled="true" size="small" @click="addFriend">已添加</mt-button>
                    <mt-button v-else type="primary" size="small" @click="addFriend">添加</mt-button>
                </div>
            </div>
            <div class="no-data" v-if="hasSearch && friendInfo === null">
                <div class="line"></div>
                <p>用户不存在</p>
            </div>
            <mt-popup v-model="popupVisible" :closeOnClickModel="false" position="top" class="mint-popup-2">
                <p>请求已发送</p>
            </mt-popup>
        </div>
    </transition>
</template>

<script>
import {MessageBox} from 'mint-ui'
import {searchFriend, addFriend} from '@/api/api';

export default {
    name: 'search',
    data() {
        return {
            value: '',
            friendInfo: null,
            hasSearch: false,
            popupVisible: false
        }
    },
    computed: {
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
        handleClick(e) {
            if (e.target.tagName.toUpperCase() === "A") {
            this.$router.go(-1)
            }
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
                 this.friendInfo = response.responseData
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
        addFriend() {
            addFriend(this.value).then(response => {
                this.popupVisible = true
                setTimeout(() => {
                this.popupVisible = false
                this.$router.go(-1)
                }, 2000)
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
        }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs['search'].$refs['input'].click()
      })
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