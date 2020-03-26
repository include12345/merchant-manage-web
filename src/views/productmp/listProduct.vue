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
        @click="addProductHandle()"
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
          prop="image"
          label="商品图片"
          width="150"
          align="center"
        ><template slot-scope="scope"><img style="height: 80px" :src="scope.row.imageMaster"></template>
        </el-table-column>
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
          prop="status"
          label="商品状态"
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
              @click.native.prevent="editProductHandle(tableData[scope.$index].id)"
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
          :total="sizeCount">
        </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  listProductPaging,
  deleteProduct
} from "@/api/api";
import { dateFormat } from "@/utils/timeFormat";
export default {
  name: "listProduct",
  data() {
    return {
      name: null,
      industryId: null,
      status: null,
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
      listProductPaging(json)
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
    addProductHandle() {
      this.$router.push({ path: "/productmp/addProduct"});
      
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
    editProductHandle(id) {
      // this.$store.dispatch('setConsumer', row)
      this.$router.push({ path: "/productmp/updateProduct", query: { id: id } });
    },
    deleteRow(index, rows, id, name) {
      this.$confirm("此操作将永久删除该商品:" + name + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            deleteProduct(id).then(response => {
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