<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="consumerName"
        name="consumerName"
        placeholder="请输入会员名称"
        style="width:20%"
      ></el-input>
      <el-input
        v-model="consumerCellphone"
        name="consumerCellphone"
        placeholder="请输入会员手机号"
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
        @click="addConsumerHandle()"
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
          prop="consumerName"
          label="会员名称"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="consumerCellphone"
          label="会员手机号"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="consumerEmail"
          label="会员邮箱"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="consumerWechat"
          label="会员微信"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="consumerBalance"
          label="会员余额(分)"
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
        <el-table-column fixed="right" width="200" label="操作">
            <template slot-scope="scope">
             <!-- <el-button
              @click.native.prevent="reduceWalletHandle(tableData[scope.$index].id)"
              type="text">
              扣款
            </el-button> -->
            <el-button
              @click.native.prevent="editConsumerHandle(tableData[scope.$index].id)"
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
  listMerchantConsumerPaging,
  deleteMerchantConsumer
} from "@/api/api";
import { dateFormat } from "@/utils/timeFormat";
//   import {mapGetters} from 'vuex'
export default {
  name: "listConsumer",
  //     computed: {
  //   // 使用对象展开运算符将 getter 混入 computed 对象中
  //     ...mapGetters([
  //       'consumer'
  //     ])
  //   },
  data() {
    return {
      consumerName: null,
      consumerCellphone: null,
      consumer: {
        name: "",
        cellphone: "",
        email: null,
        wechat: null
      },
      consumerRules: {
        name: [
          { required: true, message: "会员名称不能为空", trigger: "blur" },
          {
            pattern: /^.{1,128}$/,
            message: "长度范围需在1-128之间",
            trigger: "blur"
          }
        ],
        cellphone: [
          { required: true, message: "会员手机号不能为空", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        wechat: [
          {
            pattern: /^.{1,128}$/,
            message: "长度范围需在1-128之间"
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
    listMerchantConsumerPaging: function(json) {
      listMerchantConsumerPaging(json)
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
    addConsumerHandle() {
      this.$router.push({ path: "/consumermp/addConsumer"});
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    handle() {
      var json = {};
      if (this.consumerName) {
        json.name = this.consumerName;
      }
      if (this.consumerCellphone) {
        json.cellphone = this.consumerCellphone;
      }
      json.pageNo = this.pageParam;
      json.pageSize = this.pageSize;
      this.listMerchantConsumerPaging(json);
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
      this.listMerchantConsumerPaging(json);
    },
    handleCurrentChange(val) {
      var json = {};
      json.pageNo = val;
      json.pageSize = this.pageSize;
      this.listMerchantConsumerPaging(json);
    },
    editConsumerHandle(id) {
      // this.$store.dispatch('setConsumer', row)
        this.$router.push({ path: "/consumermp/updateConsumer", query: { id: id } });
    },
    deleteRow(index, rows, id, name) {
      this.$confirm("此操作将永久删除该会员:" + name + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            deleteMerchantConsumer(id).then(response => {
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
      this.listMerchantConsumerPaging(json);
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