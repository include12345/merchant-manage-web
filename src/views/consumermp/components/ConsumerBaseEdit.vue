<template>
    <div style="margin-top: 50px">
        <el-form :model="value" :rules="consumerRules" ref="product" label-width="120px" style="width:600px" size="small">
            <el-form-item label="会员姓名：" prop="consumerName">
                <el-input v-model="value.consumerName"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="consumerCellphone">
                <el-input v-model="value.consumerCellphone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="consumerEmail">
                <el-input v-model="value.consumerEmail"></el-input>
            </el-form-item>
            <el-form-item label="微信号：" prop="consumerWechat">
                <el-input v-model="value.consumerWechat"></el-input>
            </el-form-item>
             <el-form-item style="text-align: center">
                 <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {listIndustrys} from '@/api/api';
export default {
    name: "ConsumerBaseEdit",
    props: {
        value: Object,
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            hasEditCreated:false,
            consumerRules: {
                consumerName: [
                    { required: true, message: "会员姓名不能为空", trigger: "blur" },
                    { pattern: /^.{1,128}$/, message: "长度范围需在1-128之间", trigger: "blur"}
                ],
                consumerCellphone: [
                    { required: true, message: "手机号不能为空", trigger: "blur" },
                    { pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: "手机号不合法", trigger: "blur"}
                ],
                consumerEmail: [
                    { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: "邮箱不合法", trigger: "blur" }
                ],
                consumerWechat: [
                    { pattern: /^.{1,128}$/, message: "长度范围需在1-128之间", trigger: "blur"}
                ]
            }
        }
       
    },
    computed: {
        consumerId() {
            return this.value.id;
        }
    },
    watch: {
        consumerId:function(newValue){
            if(!this.isEdit)
                return;
            if(this.hasEditCreated)
                return;
            if(newValue === undefined || newValue == null || newValue ===0 )
                return;
            this.handleEditCreated();
        }
    },
    methods: {
        handleEditCreated(){
        this.hasEditCreated = true;
      }
    }
}
</script>