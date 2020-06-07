<template>
    <div class="aboutme-section">
        <mt-cell class="mt-20 me" is-link to="/profile" :title="realName" :label="'chat ID:' +username">

        </mt-cell>
        <mt-cell class="mt-20" is-link :title="朋友圈" @click.native="comingSoon">
            <span slot="icon" class="cell-icon moments icon icon-camera"></span>
        </mt-cell>
        <mt-cell is-link :title="附近朋友" to="/NearbyPeople">
            <span slot="icon" class="cell-icon near-by icon icon-man-woman"></span>
        </mt-cell>
        <mt-cell class="mt-30" is-link to="/settings" :title="设置">
            <span slot="icon" class="cell-icon settings icon icon-cog"></span>
        </mt-cell>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {Toast} from 'mint-ui'
export default {
    name: 'aboutme-section',
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters([
            'username',
            'realName',
            'profilePhotoVersion'
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
        .me {
            height: 70px;
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
                    top: 15px;
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