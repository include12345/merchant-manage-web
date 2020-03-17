<template>
    <div style="margin-top: 50px">
        <el-form :model="value" :rules="productRules" ref="product" label-width="120px" style="width:600px" size="small">
            <el-form-item label="商品分类" prop="industryId">
                <el-cascader v-model="selectIndustry" :options="industryOptions">
                </el-cascader>
            </el-form-item>
            <el-form-item label="商品名称：" prop="name">
                <el-input v-model="value.name"></el-input>
            </el-form-item>
            <el-form-item label="商品优先级：" prop="priority">
                <el-input v-model="value.priority"></el-input>
            </el-form-item>
            <el-form-item label="商品原价：" prop="originalPrice">
                <el-input v-model="value.originalPrice"></el-input>
            </el-form-item>
            <el-form-item label="商品价格：" prop="price">
                <el-input v-model="value.price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量：" prop="count">
                <el-input v-model="value.count"></el-input>
            </el-form-item>
            <el-form-item label="商品状态：" prop="status">
                <el-input v-model="value.status"></el-input>
            </el-form-item>
             <el-form-item style="text-align: center">
                <el-button type="primary" size="medium" @click="handleNext('product')">下一步，填写图片信息</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {listIndustrys} from '@/api/api';
export default {
    name: "ProductBaseEdit",
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
            selectIndustry:[],
            industryOptions: [],
            productRules: {
                name: [
                    { required: true, message: "商品名称不能为空", trigger: "blur" },
                    { pattern: /^.{1,128}$/, message: "长度范围需在1-128之间", trigger: "blur"}
                ],
                priority: [
                    { required: true, message: "商品优先级不能为空", trigger: "blur" },
                    { pattern: /^\d+$/, message: "只能为整数", trigger: "blur"}
                ],
                originalPrice: [
                    { required: true, message: "商品原价不能为空", trigger: "blur" },
                    { pattern: /^\d+$/, message: "只能为整数", trigger: "blur" }
                ],
                price: [
                    { required: true, message: "商品实际价格不能为空", trigger: "blur" },
                    { pattern: /^\d+$/, message: "只能为整数", trigger: "blur" }
                ],
                count: [
                    { required: true, message: "商品数量不能为空", trigger: "blur" },
                    { pattern: /^\d+$/, message: "只能为整数", trigger: "blur" }
                ]
            }
        }
       
    },
    created() {
        this.listIndustrys();
    },
    computed: {
        productId() {
            return this.value.id;
        }
    },
    watch: {
        productId:function(newValue){
            if(!this.isEdit)
                return;
            if(this.hasEditCreated)
                return;
            if(newValue === undefined || newValue == null || newValue ===0 )
                return;
            this.handleEditCreated();
        },
        selectIndustry: function (newValue) {
            console.log(newValue)
            if (newValue != null) {
                this.value.industryId = newValue[0];
                this.value.label = this.getIndustryById(this.value.industryId);
            } else {
                this.value.industryId = null;
                this.value.label = null;
            }
        }
    },
    methods: {
        handleEditCreated(){
        if(this.value.industryId != null){
          this.selectIndustry.push(this.value.industryId);
        }
        this.hasEditCreated = true;
      },
      listIndustrys() {
        listIndustrys().then(response => {
          let list = response;
          if(list === undefined || list == null) {
              return;
          } 
          this.industryOptions = [];
          for (let i = 0; i < list.length; i++) {
            this.industryOptions.push({label: list[i].level1, value: list[i].id});
          }
        });
      },
      getIndustryById(id){
        for(let i=0; i<this.industryOptions.length; i++){
            if(this.industryOptions[i].value===id){
              return this.industryOptions[i].label;
            }
        }
        return null;
      },
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      }
    }
}
</script>