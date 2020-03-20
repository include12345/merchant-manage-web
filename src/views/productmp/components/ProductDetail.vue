<template>
    <el-card class="form-container" shadow="never">
        <el-steps :active="active" finish-status="success" align-center>
            <el-step title="填写商品基本信息"></el-step>
            <el-step title="填写商品图片信息"></el-step>
        </el-steps>
        <product-base-edit
            v-show="showStatus[0]"
            v-model="product"
            :is-edit="isEdit"
            @nextStep="nextStep">
        </product-base-edit>
        <product-image-edit
            v-show="showStatus[1]"
            v-model="product"
            :is-edit="isEdit"
            @prevStep="prevStep"
            @finishCommit="finishCommit">
        </product-image-edit>
    </el-card>
</template>
<script>
import ProductBaseEdit from './ProductBaseEdit';
import ProductImageEdit from './ProductImageEdit';
import {addProduct, getProduct, updateProduct} from "@/api/api";
export default {
    name: 'ProductDetail',
    components: {
        ProductBaseEdit,
        ProductImageEdit
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
            product: {
                name: null,
                priority: 0,
                originalPrice: 0,
                price: 0,
                count: 0,
                status: 0,
                image:null,
                context: '',
                industryId:null
            },
            showStatus: [true, false]
        }
    },
    created() {
        if(this.isEdit) {
            getProduct(this.$route.query.id).then(response=>{
                this.product = response;
            });
        }
    },
    methods: {
        hideAll() {
            for (let i = 0; i < this.showStatus.length; i++) {
                this.showStatus[i] = false;
            }
        },
        prevStep() {
            if (this.active > 0 && this.active < this.showStatus.length) {
                this.active--;
                this.hideAll();
                this.showStatus[this.active] = true;
            }
        },
        nextStep() {
            if (this.active < this.showStatus.length - 1) {
                this.active++;
                this.hideAll();
                this.showStatus[this.active] = true;
            }
        },
        finishCommit(isEdit) {
            this.$confirm('是否要提交该产品', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(isEdit){
                    updateProduct(this.$route.query.id, this.product).then(response=>{
                        this.$message({
                            type: 'success',
                            message: '提交成功',
                            duration:1000
                        });
                        this.$router.back();
                    });
                }else{
                    addProduct(this.product).then(response=>{
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