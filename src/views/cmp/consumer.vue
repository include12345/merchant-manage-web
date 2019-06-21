<template>
  <div class="app-container">
    <div>
      <el-row>
        <el-col :span="23">
          <div class="grid-content bg-purple-light">
            <p class="center_type" style="color:red">
              会员 {{ consumer.consumerName }} 基本信息
            </p>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <el-button
              @click.native.prevent="updateConsumerHandle(consumer)"
              style="text-align:right"
              type="text">编辑</el-button>
          </div>
        </el-col>
      </el-row>
      <hr class="hr_type" />
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p class="center_type">名称 : {{ consumer.consumerName }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            <p class="center_type">手机号 : {{ consumer.consumerCellphone }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p class="center_type">邮箱 : {{ consumer.consumerEmail }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p class="center_type">微信号 : {{ consumer.consumerWechat }}</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <p class="center_type">会员创建时间 : {{ consumer.ctime }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <p class="center_type">会员最后修改时间 : {{ consumer.mtime }}</p>
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
              会员余额： {{ balance }} 分
            </p>
          </div>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <el-button
              @click.native.prevent="updateConsumerWalletHandle(walletId, balance)"
              style="text-align:right"
              type="text">充值</el-button>
          </div>
        </el-col>
      </el-row>
      <hr>
        <p class="center_type">会员充值记录</p>
        <el-table :data="walletTransaction" style="width:100%" max-height="750" border highlight-current-row>
            <el-table-column prop="beforeBalance" label="充值前金额"></el-table-column>
            <el-table-column prop="addAmount" label="充值金额"></el-table-column>
            <el-table-column prop="afterBalance" label="变更后余额"></el-table-column>
            <el-table-column prop="userName" label="操作人" width="200"></el-table-column>
            <el-table-column prop="ctime" label="开始时间" width="200"></el-table-column>
            <el-table-column prop="mtime" label="最后变更时间" width="200"></el-table-column>
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
  getMerchantConsumerWallet,
  editMerchantConsumerWallet
} from "@/api/api";
import { mapGetters } from "vuex";
export default {
  name: "consumer",
  data() {
    return {
      row: this.consumer,
      balance: null,
      walletId : null,
      walletTransaction:[],
      pageParam: 1,
      pageSize: 10,
      page:1,
      sizeCount:this.sizeCount,
      listConsumerWalletTransactionPaging: function(json) {
        listConsumerWalletTransactionPaging(json).then(response => {
            if (!response.content) {
              this.$message({
                message: '结果为空',
                type: 'warning',
                duration: 1000
              })
              return;
            }
            this.sizeCount = response.totalElements;
            document.getElementById('hide').style.display = "block";
            this.walletTransaction = response.content;
        }).catch(error => {
            this.$message({
              message: '异常：' + error,
              type: 'warning',
              duration: 1000
            })
            return;
        })
      },
      getMerchantConsumer: function(consumerId) {
        getMerchantConsumerWallet(consumerId).then(response => {
          if (!response) {
            this.$message({
              message: "结果为空",
              type: "warning",
              duration: 1000
            });
            return;
          }
          this.balance = response.balance;
          this.walletId = response.id
        });
      }
    };
  },
  computed: mapGetters(["consumer"]),
  methods: {
    handle() {
      var json = {};
    //   if (this.consumerName) {
    //     json.name = this.consumerName;
    //   }
    //   if (this.cellphone) {
    //     json.cellphone = this.cellphone;
    //   }
      json.consumerId = this.consumer.id;
      json.pageNo = this.pageParam;
      json.pageSize = this.pageSize;
      this.listConsumerWalletTransactionPaging(json);
    },
    handleSizeChange(val) {
        var json = {};
        json.consumerId = this.consumer.id;
        json.pageNo = this.pageParam;
        json.pageSize = val;
        this.listConsumerWalletTransactionPaging(json)
      },
      handleCurrentChange(val) {
        var json = {};
        json.consumerId = this.consumer.id;
        json.pageNo = val;
        json.pageSize = this.pageSize;
        this.listConsumerWalletTransactionPaging(json)
      }, 
    consumerHandle(row) {
      this.$router.push({ path: "/cmp/consumer", query: row });
    }
  },
  created() {
    if (!this.consumer.id) {
      this.$router.push({ path: "/cmp/listconsumer" });
      return;
    }
    this.getMerchantConsumer(this.consumer.id);
    this.$nextTick(function() {
        var json = {};
        json.consumerId = this.consumer.id;
        json.pageNo = this.pageParam;
        json.pageSize = this.pageSize;
        this.listConsumerWalletTransactionPaging(json)
    })
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
    padding-right:5px;
    border-right: 0.5px dashed #6699cc;
}
.br_left_type {
    padding-left:5px;
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


