<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="name"
        name="name"
        placeholder="请输入订单名称"
        style="width:20%"
      ></el-input>
      <el-input
        v-model="orderSn"
        name="orderSn"
        placeholder="请输入订单号"
        style="margin-left: 40px;width:20%"
      ></el-input>
      <el-button
        type="primary"
        @click.native.prevent="handle"
        style="margin-left: 40px"
        >查询</el-button
      >
    </div>
    <hr />
    <div
      id="hide"
      style="padding-top:30px;display: none;padding-right:30px;padding-bottom:30px"
    >
      <el-table :data="tableData" style="width:100%" row-key="id" :expand-row-keys="expandKeys" @expand-change="listOrderTransaction" stripe>
          <el-table-column type="expand">
      <template>
        <el-table v-loading="loading" :data="subTableData" style="width:100%" stripe>
            <el-table-column
              prop="id"
              label="流水编号"
               width="200"
            ></el-table-column>
            <el-table-column
              prop="orderId"
              label="订单编号"
               width="200"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="流水名称"
               width="200"
            ></el-table-column>
            <el-table-column
              prop="remark"
              label="流水备注"
               width="200"
            ></el-table-column>
        </el-table>
      </template>
    </el-table-column>
        <el-table-column
          prop="id"
          label="订单编号"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="orderSn"
          label="订单号"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="订单名称"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="订单类型"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="originalAmount"
          label="原价"
          width="100"
        ></el-table-column>
         <el-table-column
          prop="payAmount"
          label="实际价格"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="discount"
          label="优惠价格"
          width="100"
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
  listMerchantOrderPaging,
  listOrderTransaction
} from "@/api/api";
import { dateFormat } from "@/utils/timeFormat";
export default {
  name: "listOrder",
  data() {
    return {
      orderSn: null,
      name: null,
      type: null,
      dialogVisible: false,
      props: {children: 'children', hasChildren: 'hasChildren'},
      tableData: [],
      loading: true,
      expandKeys:[],
      subTableData: [],
      pageParam: 1,
      pageSize: 10,
      page: 1,
      sizeCount: this.sizeCount
    };
  },
  methods: {
    listMerchantOrderPaging: function(json) {
      listMerchantOrderPaging(json)
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
    listOrderTransaction(row, expandedRows) {
      if(this.expandKeys.indexOf(row.id)>=0){
                    //收起当前行
        this.expandKeys.shift()
        return;
      }
      this.loading = true
      this.subTableData = []
      listOrderTransaction(row.id)
        .then(response => {
          this.subTableData = response
          this.loading = false
          this.expandKeys.shift()
          this.expandKeys.push(row.id)
          // resolve = response.content;
        })
        .catch(error => {
          this.$message({
            message: "异常：" + error,
            type: "warning",
            duration: 1000
          });
          return;
        });
        if (expandedRows.length > 1) {
                    //只展开当前选项
            expandedRows.shift()
        }
    },
    dateFormat: function(row, column) {
      return dateFormat(row, column);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    handle() {
      var json = {};
      if (this.orderSn) {
        json.orderSn = this.orderSn;
      }
      if (this.name) {
        json.name = this.name;
      }
      if (this.type) {
        json.type = this.type;
      }
      if (this.status) {
        json.status = this.status;
      }
      json.pageNo = this.pageParam;
      json.pageSize = this.pageSize;
      this.listMerchantConsumerPaging(json);
    }
  },
  beforeCreate: function() {
    this.$nextTick(function() {
      var json = {};
      json.pageNo = this.pageParam;
      json.pageSize = this.pageSize;
      this.listMerchantOrderPaging(json);
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