<template>
  <div class="app-container">
    <div>
      <el-row>
        <el-col :span="23">
          <div class="grid-content bg-purple-light">
            <p class="center_type" style="color:red">
              会员 {{ consumerMap.consumerName }} 基本信息
            </p>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <el-button
              @click="dialogVisibleUpdate = true"
              style="text-align:right"
              type="text"
              >编辑</el-button
            >
          </div>
        </el-col>
      </el-row>
      <hr class="hr_type" />
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p class="center_type">名称 : {{ consumerMap.consumerName }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            <p class="center_type">
              手机号 : {{ consumerMap.consumerCellphone }}
            </p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p class="center_type">邮箱 : {{ consumerMap.consumerEmail }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p class="center_type">微信号 : {{ consumerMap.consumerWechat }}</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <p class="center_type">
              会员创建时间 : {{ dateFormatNoTable(consumerMap.ctime) }}
            </p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <p class="center_type">
              会员最后修改时间 : {{ dateFormatNoTable(consumerMap.mtime) }}
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
    <hr class="hr_type" />
    <div>
      <el-row>
        <el-col :span="23">
          <div class="grid-content bg-purple-light">
            <p class="center_type" style="color:red">
              会员余额： {{ consumerMap.balance }} 分
            </p>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <el-button
              @click="dialogVisibleWallet = true"
              style="text-align:right"
              type="text"
              >充值</el-button
            >
          </div>
        </el-col>
      </el-row>
      <hr />
      <div
        id="hide"
        style="padding-top:30px;display: none;padding-right:30px;padding-bottom:30px"
      >
        <p class="center_type">会员充值记录</p>
        <el-table
          :data="walletTransaction"
          style="width:100%"
          stripe
        >
          <el-table-column
            prop="beforeBalance"
            label="充值前金额(分)"
          ></el-table-column>
          <el-table-column prop="addAmount" label="充值金额(分)"></el-table-column>
          <el-table-column
            prop="afterBalance"
            label="变更后余额(分)"
          ></el-table-column>
          <el-table-column
            prop="operatorCreate"
            label="操作人"
            width="200"
          ></el-table-column>
           <el-table-column
            prop="remark"
            label="备注"
            width="200"
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
          :total="sizeCount"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="修改会员"
      :visible.sync="dialogVisibleUpdate"
      v-if="dialogVisibleUpdate"
    >
      <el-form
        label-width="100px"
        :model="consumerMap"
        :rules="consumerRules"
        ref="consumerMap"
      >
        <el-form-item prop="consumerName" label="会员名称:">
          <el-input v-model="consumerMap.consumerName"></el-input>
        </el-form-item>
        <el-form-item prop="consumerCellphone" label="会员手机号:">
          <el-input v-model="consumerMap.consumerCellphone"></el-input>
        </el-form-item>
        <el-form-item prop="consumerEmail" label="会员邮箱:">
          <el-input v-model="consumerMap.consumerEmail"></el-input>
        </el-form-item>
        <el-form-item prop="consumerWechat" label="会员微信号:">
          <el-input v-model="consumerMap.consumerWechat"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click.native.prevent="updateConsumerHandle('consumerMap')"
          >确定</el-button
        >
        <el-button type="primary" @click="resetForm('consumerMap')"
          >关闭</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="会员充值"
      :visible.sync="dialogVisibleWallet"
      v-if="dialogVisibleWallet"
    >
      <p class="center_type" style="color:red">
        会员余额： {{ consumerMap.balance }} 分
      </p>
      <el-form label-width="200px" :model="consumerWallet" :rules="walletRules" ref="consumerWallet">
        <el-form-item prop="amount" label="充值金额:">
          <el-input
            v-model="consumerWallet.amount"
            style="width:60%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注:">
          <el-input
            type="textarea"
            maxlength="128"
            show-word-limit
            v-model="consumerWallet.remark"
            style="width:60%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click.native.prevent="updateConsumerWalletHandle('consumerWallet')"
          >确定</el-button
        >
        <el-button type="primary" @click="resetForm('consumerWallet')"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMerchantConsumer,
  editMerchantConsumerWallet,
  updateMerchantConsumer,
  listConsumerWalletTransactionPaging
} from "@/api/api";
import { dateFormat, dateFormatNoTable } from "@/utils/timeFormat";
import { mapGetters } from "vuex";
export default {
  name: "consumer",
  data() {
      let checkInt = (rule, value, callback) => {
        if ((Number(value))&&(value)%1 === 0) {
          callback();
        } else {
          return callback(new Error('请输入整数！'));
        }
      };
    return {
      consumerRules: {
        consumerName: [
          { required: true, message: "会员名称不能为空", trigger: "blur" },
          {
            pattern: /^.{1,128}$/,
            message: "长度范围需在1-128之间",
            trigger: "blur"
          }
        ],
        consumerCellphone: [
          { required: true, message: "会员手机号不能为空", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        consumerEmail: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        consumerWechat: [
          {
            pattern: /^.{1,128}$/,
            message: "长度范围需在1-128之间"
          }
        ]
      },
      walletRules: {
        amount: [
          { validator: checkInt, trigger: 'blur' }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" },
          {
            pattern: /^.{1,128}$/,
            message: "长度范围需在1-128之间"
          }
        ]
      },
      dialogVisibleUpdate: false,
      dialogVisibleWallet: false,
      consumerMap: {},
      consumerWallet: {
        consumerId: null,
        walletId: null,
        amount: null,
        remark: null
      },
      //   balance: null,
      //   walletId : null,
      walletTransaction: [],
      pageParam: 1,
      pageSize: 10,
      page: 1,
      sizeCount: this.sizeCount
    };
  },
  //   computed: mapGetters(["consumer"]),
  methods: {
    updateConsumerHandle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          return new Promise((resolve, reject) => {
            this.consumerMap.id = this.$route.query.id;
            updateMerchantConsumer(this.consumerMap)
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
                this.dialogVisibleUpdate = false;
                this.getMerchantConsumer(response.id);
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
          return;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisibleUpdate = false;
    },
    updateConsumerWalletHandle(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          var json = {};
          json.consumerId = this.$route.query.id;
          json.walletId = this.consumerMap.walletId;
          json.remark = this.consumerWallet.remark;
          json.amount = this.consumerWallet.amount;
          return new Promise((resolve, reject) => {
            editMerchantConsumerWallet(json)
              .then(response => {
                if (!response.id) {
                  this.$message({
                    message: "添加失败：" + response,
                    type: "error",
                    duration: 1000
                  });
                  return;
                }
                this.$refs[form].resetFields();
                this.dialogVisibleWallet = false;
                this.consumerMap.balance = response.balance;
                var json = {};
                json.consumerId = this.$route.query.id;
                json.pageNo = this.pageParam;
                json.pageSize = this.pageSize;
                this.listConsumerWalletTransactionPaging(json);
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
          return;
        }
      });
    },
    resetWalletForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisibleWallet = false;
    },
    listConsumerWalletTransactionPaging: function(json) {
      listConsumerWalletTransactionPaging(json)
        .then(response => {
          console.log(response.content);
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
          this.walletTransaction = response.content;
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
    getMerchantConsumer: function(consumerId) {
      getMerchantConsumer(consumerId).then(response => {
        if (!response) {
          this.$message({
            message: "结果为空",
            type: "warning",
            duration: 1000
          });
          return;
        }
        this.consumerMap = response;
      });
    },

    dateFormat: function(row, column) {
      return dateFormat(row, column);
    },
    dateFormatNoTable: function(date) {
      return dateFormatNoTable(date);
    },
    handle() {
      var json = {};
      //   if (this.consumerName) {
      //     json.name = this.consumerName;
      //   }
      //   if (this.cellphone) {
      //     json.cellphone = this.cellphone;
      //   }
      json.consumerId = this.$route.query.id;
      json.pageNo = this.pageParam;
      json.pageSize = this.pageSize;
      this.listConsumerWalletTransactionPaging(json);
    },
    handleSizeChange(val) {
      var json = {};
      json.consumerId = this.$route.query.id;
      json.pageNo = this.pageParam;
      json.pageSize = val;
      this.listConsumerWalletTransactionPaging(json);
    },
    handleCurrentChange(val) {
      var json = {};
      json.consumerId = this.$route.query.id;
      json.pageNo = val;
      json.pageSize = this.pageSize;
      this.listConsumerWalletTransactionPaging(json);
    }
  },
  created() {
    if (!this.$route.query.id) {
      this.$router.push({ path: "/cmp/listconsumer" });
      return;
    }
    this.getMerchantConsumer(this.$route.query.id);
    this.$nextTick(function() {
      var json = {};
      json.consumerId = this.$route.query.id;
      json.pageNo = this.pageParam;
      json.pageSize = this.pageSize;
      this.listConsumerWalletTransactionPaging(json);
    });
  }
};
</script>


<style>
.center_type {
  display: block;
  text-align: center;
}
.hr_type {
  border: 0.5px dashed #6699cc;
}

.br_right_type {
  padding-right: 5px;
  border-right: 0.5px dashed #6699cc;
}
.br_left_type {
  padding-left: 5px;
  border-left: 0.5px dashed #6699cc;
}
.el-input__inner {
  /* width: 220px; */
  /* border-top-width: 0px; */
  /* border-left-width: 0px; */
  /* border-right-width: 0px; */
  /* border-bottom-width: 1px; */
  /*outline: medium;*/
}
</style>


