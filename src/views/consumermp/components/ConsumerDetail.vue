<template>
    <el-card class="form-container" shadow="never">
        <el-steps :active="active" finish-status="success" align-center>
            <el-step title="填写会员基本信息"></el-step>
        </el-steps>
        <consumer-base-edit
            v-show="showStatus[0]"
            v-model="consumer"
            :is-edit="isEdit"
            @finishCommit="finishCommit">
        </consumer-base-edit>
    </el-card>
</template>
<script>
import ConsumerBaseEdit from './ConsumerBaseEdit';
import {addConsumer, getConsumer, updateConsumer} from "@/api/api";
export default {
    name: 'ConsumerDetail',
    components: {
        ConsumerBaseEdit
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            active: 0,
            consumer: {
                consumerName: null,
                consumerCellphone: null,
                consumerEmail: null,
                consumerWechat: null
            },
            showStatus: [true, false]
        }
    },
    created() {
        if(this.isEdit) {
            getConsumer(this.$route.query.id).then(response=>{
                this.consumer = response;
            });
        }
    },
    methods: {
        hideAll() {
            for (let i = 0; i < this.showStatus.length; i++) {
                this.showStatus[i] = false;
            }
        },
        finishCommit(isEdit) {
            this.$confirm('是否要提交该会员', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(isEdit){
                    updateConsumer(this.$route.query.id, this.consumer).then(response=>{
                        this.$message({
                            type: 'success',
                            message: '提交成功',
                            duration:1000
                        });
                        this.$router.back();
                    });
                }else{
                    addConsumer(this.consumer).then(response=>{
                        this.$message({
                            type: 'success',
                            message: '提交成功',
                            duration:1000
                        });
                        location.reload();
                    });
                }
            })
        }
    }
}
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>