<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="name"
        name="name"
        placeholder="请输入商品名称"
        style="width:20%"
      ></el-input>
      <el-input
        v-model="industryId"
        name="industryId"
        placeholder="请选择商品类型"
        style="margin-left: 40px;width:20%"
      ></el-input>
      <el-input
        v-model="status"
        name="status"
        placeholder="请输入商品状态"
        style="margin-left: 40px;width:20%"
      ></el-input>
      <el-button
        type="primary"
        @click.native.prevent="handle"
        style="margin-left: 40px"
        >查询</el-button
      >
      <el-button
        type="text"
        @click="dialogVisible = true"
        style="float:right;margin-right:20px"
        >新增</el-button
      >
    </div>
    <hr />
    <div
      id="hide"
      style="padding-top:30px;display: none;padding-right:30px;padding-bottom:30px"
    >
      <el-table :data="tableData" style="width:100%" stripe>
         <el-table-column
          prop="id"
          label="商品编号"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          width="200"
        ></el-table-column>
         <el-table-column
          prop="priority"
          label="商品展示优先级"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="industry"
          label="商品类型"
          width="200"
        ></el-table-column>
         <el-table-column
          prop="originalPrice"
          label="商品原价"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="商品真实价格"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="count"
          label="商品数量"
          width="150"
        ></el-table-column>
         <el-table-column
          prop="image"
          label="商品图片"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="context"
          label="商品描述"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="ctime"
          :formatter="dateFormat"
          label="开始时间"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="mtime"
          :formatter="dateFormat"
          label="最后变更时间"
          width="200"
        ></el-table-column>
        <el-table-column fixed="right" width="200" label="操作">
            <template slot-scope="scope">
            <el-button
              @click.native.prevent="productHandle(tableData[scope.$index].id)"
              type="text">
              管理
            </el-button>
            <el-button
              @click.native.prevent="
                deleteRow(
                  scope.$index,
                  tableData,
                  tableData[scope.$index].id,
                  tableData[scope.$index].consumerName
                )"
              type="text">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 50, 100, 500]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sizeCount"
      >
      </el-pagination>
      <el-dialog
        title="添加商品"
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
      >
        <el-form
          label-width="100px"
          :model="product"
          :rules="productRules"
          ref="product"
        >
          <el-form-item prop="name" label="商品名称:">
            <el-input
              v-model="product.name"
              placeholder="请输入商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="priority" label="商品展示优先级:">
            <el-input
              v-model="product.priority"
              placeholder="请输入商品展示优先级"
            ></el-input>
          </el-form-item>
          <el-form-item prop="originalPrice" label="商品原价（分）:">
            <el-input
              v-model="product.originalPrice"
              name="originalPrice"
              autocomplete="off"
              placeholder="请输入商品原价"
            ></el-input>
          </el-form-item>
          <el-form-item prop="price" label="商品真实价格（分）:">
            <el-input
              v-model="product.price"
              name="price"
              autocomplete="off"
              placeholder="请输入商品真实价格"
            ></el-input>
          </el-form-item>
          <el-form-item prop="image" label="商品图片:">
            <el-input
              v-model="product.image"
              name="image"
              autocomplete="off"
              placeholder="请上传商品图片"
            ></el-input>
          </el-form-item>
          <el-form-item prop="context" label="商品描述:">
            <el-input
              v-model="product.context"
              name="context"
              autocomplete="off"
              placeholder="请输入商品描述"
            ></el-input>
          </el-form-item>
          <el-form-item prop="context" label="商品描述:">
            <el-input
              v-model="product.industryId"
              name="industryId"
              autocomplete="off"
              placeholder="请选择商品类型"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click.native.prevent="addProductHandle('product')"
            >确定</el-button
          >
          <el-button type="primary" @click="resetForm('product')"
            >关闭</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  listMerchantProductPaging,
  deleteMerchantProduct,
  addMerchantProduct
} from "@/api/api";
import { dateFormat } from "@/utils/timeFormat";
//   import {mapGetters} from 'vuex'
export default {
  name: "listProduct",
  //     computed: {
  //   // 使用对象展开运算符将 getter 混入 computed 对象中
  //     ...mapGetters([
  //       'consumer'
  //     ])
  //   },
  data() {
    return {
      name: null,
      industryId: null,
      status: null,
      product: {
        name: null,
        priority: 0,
        originalPrice: 0,
        price: 0,
        count: 0,
        image:null,
        context: null,
        industryId:null
      },
      productRules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
          {
            pattern: /^.{1,128}$/,
            message: "长度范围需在1-128之间",
            trigger: "blur"
          }
        ],
        priority: [
          { required: true, message: "商品优先级不能为空", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "只能为整数",
            trigger: "blur"
          }
        ],
        originalPrice: [
          { required: true, message: "商品原价不能为空", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "只能为整数",
            trigger: "blur"
          }
        ],
        price: [
          { required: true, message: "商品实际价格不能为空", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "只能为整数",
            trigger: "blur"
          }
        ],
        count: [
          { required: true, message: "商品数量不能为空", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "只能为整数",
            trigger: "blur"
          }
        ]
      },
      dialogVisible: false,
      id: this.id,

      tableData: [],
      pageParam: 1,
      pageSize: 10,
      page: 1,
      sizeCount: this.sizeCount
    };
  },
  methods: {
    listMerchantProductPaging: function(json) {
      listMerchantProductPaging(json)
        .then(response => {
          if (!response.content) {
            this.$message({
              message: "结果为空",
              type: "warning",
              duration: 1000
            });
            return;
          }
          this.sizeCount = response.totalElements;
          document.getElementById("hide").style.display = "block";
          this.tableData = response.content;
        })
        .catch(error => {
          this.$message({
            message: "异常：" + error,
            type: "warning",
            duration: 1000
          });
          return;
        });
    },
    dateFormat: function(row, column) {
      return dateFormat(row, column);
    },
    addProductHandle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          return new Promise((resolve, reject) => {
            addMerchantProduct(this.product)
              .then(response => {
                if (!response.id) {
                  this.$message({
                    message: "添加失败：" + response,
                    type: "error",
                    duration: 1000
                  });
                  return;
                }
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
                var json = {};
                if (this.name) {
                  json.name = this.name;
                }
                if (this.industryId) {
                  json.industryId = this.industryId;
                }
                if (this.status) {
                  json.status = this.status;
                }
                json.pageNo = this.pageParam;
                json.pageSize = this.pageSize;
                this.listMerchantProductPaging(json);
                resolve();
              })
              .catch(error => {
                this.$message({
                  message: "无权限：" + error,
                  type: "warning",
                  duration: 1000
                });
                reject(error);
              });
          });
        } else {
            return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    handle() {
      var json = {};
      if (this.name) {
        json.name = this.name;
      }
      if (this.industryId) {
        json.industryId = this.industryId;
      }
      if (this.status) {
        json.status = this.status;
      }
      json.pageNo = this.pageParam;
      json.pageSize = this.pageSize;
      this.listMerchantProductPaging(json);
    },
    showExtra(extra) {
      this.$alert(extra, "配置参数", {
        confirmButtonText: "关闭"
      });
    },
    handleSizeChange(val) {
      var json = {};
      json.pageNo = this.pageParam;
      json.pageSize = val;
      this.listMerchantProductPaging(json);
    },
    handleCurrentChange(val) {
      var json = {};
      json.pageNo = val;
      json.pageSize = this.pageSize;
      this.listMerchantProductPaging(json);
    },
    productHandle(id) {
      // this.$store.dispatch('setConsumer', row)
      this.$router.push({ path: "/productmp/product", query: { id: id } });
    },
    deleteRow(index, rows, id, name) {
      this.$confirm("此操作将永久删除该商品:" + name + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            deleteMerchantProduct(id).then(response => {
              console.log(response);
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              rows.splice(index, 1);
              resolve();
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  beforeCreate: function() {
    this.$nextTick(function() {
      var json = {};
      json.pageNo = this.pageParam;
      json.pageSize = this.pageSize;
      this.listMerchantProductPaging(json);
    });
  }
};
</script>

<style>
.el-message-box {
  width: 800px;
}

.el-dialog__body {
  padding: 30px 200px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
</style>