<template>
    <transition name="fade">
        <div class="friend-card">
            <mt-header title="好友详情">
                <mt-button icon="back" slot="left" @click="back">联系人</mt-button>
            </mt-header>
            <div style="width: 100%;height:40px;"></div>
            <mt-cell class="mt-20" style="min-height:60px;" isLink>
                <img slot="icon" :src="contactMsg.imageUrl" width="50" height="50"/>
                <div slot="title" class="info-title">
                    <p>{{contactMsg.friendname}}</p>
                </div>
            </mt-cell>
            
            <mt-cell title="备注:" inLink>
                <div style="width: 90%" slot="title">
                    <mt-field label= "备注:" :placeholder="contactMsg.remark" v-model="remark"></mt-field>
                </div>
                <mt-button class="click-button" type="primary" @click="setRemark">保存</mt-button>
            </mt-cell>
            <mt-cell title="地区" :value="region"></mt-cell>
            <mt-button class="info-button" type="primary" size="large" @click="switchSession">发消息</mt-button>
            <mt-button class="info-button" type="danger" size="large" @click="deleteFriend">删除好友</mt-button>
        </div>
    </transition>
</template>

<script>
    import {MessageBox, Toast, Indicator} from 'mint-ui'
    import {mapGetters} from 'vuex'
    import {deleteFriend, updateRemark} from '@/api/api';
    export default {
        name: 'friend-card',
        computed: {
            ...mapGetters(['contactMsg']),
        },
        data() {
            return {
                region: 'hahahah',
                remark: null
            }
        },
       
        methods: {
            setRemark() {
                
                updateRemark(this.contactMsg.friendname, this.remark).then(response=>{
                    var param = {
                        friendName: this.contactMsg.friendname,
                        remark: this.remark
                    }
                    this.$store.dispatch("setRemark", param);
                });
            },
            switchSession() {
                // let from = this.friendName
                this.$store.dispatch('switchSession', this.contactMsg.friendname).then(() => {
                    this.$router.push({path: '/chat/messageSection'})
                })
            },
            deleteFriend() {
                this.$confirm('是否要删除好友:' + this.contactMsg.friendname, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteFriend(this.contactMsg.friendname).then(response=>{
                        this.$message({
                            type: 'success',
                            message: '提交成功',
                            duration:1000
                        });
                        this.$router.back();
                    });
                })
            },
            back() {
                window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
            }
        }
    }
</script>
<style lang="scss">
  .friend-card {
    background-color: #f8f8f8;
    width: 100%;
    height: 100%;
    .mint-cell {
      margin-top: 20px;
    }
    .info-title {
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
      > p {
        margin: 0;
      }
    }
    .info-button {
      width: 80%;
      margin: 20px auto 0 auto;
    }
    .click-button {
      width: 100%;
      margin: 20px auto 0 auto;
       margin-right: 10px;
    }
    .text-icon {
      span {
        font-size: 20px;
      }
    }
  }
</style>