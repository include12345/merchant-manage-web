<template>
    <div class="mint-loadmore-top">
        <span v-show="topStatus === 'pull'">下拉刷新</span>
        <span v-show="topStatus === 'drop'">释放刷新</span>
        <span v-show="topStatus === 'loading'">
            <em style="margin-right: 5px">
                <svg width="15" height="15" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                 <g fill="none" fill-rule="evenodd">
                    <g transform="translate(1,1)" stroke-width="2">
                        <circle cx="5" cy="50" r="5">
                            <animate 
                                attributeName="cy"
                                begin="0s" dur="2.2s"
                                values="50;5;50;50"
                                calcMode="linear"
                                repeatCount="indefinite"/>
                            <animate 
                                attributeName="cx"
                                begin="0s" dur="2.2s"
                                values="5;27;49;5"
                                calcMode="linear"
                                repeatCount="indefinite"/>
                        </circle>
                        <circle cx="27" cy="5" r="5">
                            <animate 
                                attributeName="cy"
                                begin="0s" dur="2.2s"
                                from="5" to="5"
                                values="5;50;50;5"
                                calcMode="linear"
                                repeatCount="indefinite"/>
                            <animate 
                                attributeName="cx"
                                begin="0s" dur="2.2s"
                                from="27" to="27"
                                values="27;49;5;27"
                                calcMode="linear"
                                repeatCount="indefinite"/>
                        </circle>
                        <circle cx="49" cy="50" r="5">
                            <animate 
                                attributeName="cy"
                                begin="0s" dur="2.2s"
                                values="5;50;5;50"
                                calcMode="linear"
                                repeatCount="indefinite"/>
                            <animate 
                                attributeName="cx"
                                begin="0s" dur="2.2s"
                                from="49" to="49"
                                values="49;5;27;49"
                                calcMode="linear"
                                repeatCount="indefinite"/>
                        </circle>
                    </g>
                 </g>
                </svg>
            </em>
            加载中...
        </span>
        <span v-show="topStatus === 'loaded'">
            <i class="icon icon-checkmark" style="color: #fff;font-size:12px"></i>加载成功
        </span>
        <span v-show="topStatus === 'loadErr'">
            <i class="icon icon-cross"></i> 加载失败
        </span>
    </div>
</template>
<script>
export default {
    name: 'load-more-top',
    props: {
        topStatus: {
            type: String,
            default: 'pull'
        }
    }
}
</script>
<style lang="scss">
    .mint-loadmore-top {
        span {
            position: relative;
            text-align: center;
        }
    }
</style>