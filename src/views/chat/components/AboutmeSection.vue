<template>
    <div class="aboutme-section">
        <div style="width: 100%;height:40px;"></div>
            <mt-cell class="mt-20" style="min-height:60px;" :label= "tokens.username" :title="tokens.username" isLink to="/updateMe">
                <img slot="icon" :src="tokens.imageUrl" width="50" height="50"/>
                <div slot="title" class="info-title">
                    <p>{{tokens.username}}</p>
                    <p>chat ID: {{tokens.username}}</p>
                </div>
            </mt-cell>
        <!-- <mt-cell class="mt-20 me"  :title="tokens.username" :label="'chat ID:' +tokens.username">
            <img slot="icon" :src="tokens.imageUrl" width="24" height="24">
        </mt-cell> -->
        <!-- <mt-cell class="mt-20" is-link :title="朋友圈" @click.native="comingSoon">
            <span slot="icon" class="cell-icon moments icon icon-camera"></span>
        </mt-cell>
        <mt-cell is-link :title="附近朋友" to="/NearbyPeople">
            <span slot="icon" class="cell-icon near-by icon icon-man-woman"></span>
        </mt-cell> -->
        <mt-cell class="mt-30" is-link to="/settings" :title="设置">
            <span slot="icon" class="cell-icon settings icon icon-cog"></span>
        </mt-cell>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import UploadImages from '@/components/Upload/uploadImages'
import {Toast} from 'mint-ui'
export default {
    name: 'aboutme-section',
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters([
            'tokens'
        ])
    },
    methods: {
        comingSoon() {
            Toast('敬请期待')
        }
    }
}
</script>
<style lang="scss">
    .aboutme-section {
        .info-title {
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            > p {
                margin: 0;
            }
        }
        .me {
            // height: 70px;
            .mint-cell-wrapper {
                height: 100%;
                position: relative;
                img {
                    position: absolute;
                    left: 10px;
                    top: 13px;
                }
                .mint-cell-title {
                    position: absolute;
                    left: 70px;
                    .mint-cell-label {
                        color: #000;
                        font-size: 14px;
                        margin-top: 8px;
                    }
                }
            }
        }
        .cell-icon {
            font-size: 24px;
            vertical-align: middle;
        }
        .moments {
            color: #F56C6C;
        }
        .near-by {
            color: #F7BA2A;
        }
        .settings {
            color: #409EFF;
        }
    }
</style>