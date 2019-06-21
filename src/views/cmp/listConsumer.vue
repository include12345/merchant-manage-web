<template>
    <div class="app-container">
        <div>
            <el-input v-model="name" name="consumerName" placeholder="请输入会员名称" style="width:20%"></el-input>
            <el-input v-model="cellphone" name="cellphone" placeholder="请输入会员手机号" style="margin-left: 40px;width:20%"></el-input>
            <el-button type="primary" @click.native.prevent="handle" style="margin-left: 40px">查询</el-button>
            <el-button type="text" @click="dialogVisible = true" style="float:right;margin-right:20px">新增</el-button>
        </div>
        <hr>
        <div id="hide" style="padding-top:30px;display: none;padding-right:30px;padding-bottom:30px">
            <el-table :data="tableData" style="width:100%" max-height="750" border highlight-current-row>
                <el-table-column prop="consumerName" label="会员名称" width="200"></el-table-column>
                <el-table-column prop="consumerCellphone" label="会员手机号" width="200"></el-table-column>
                <el-table-column prop="consumerEmail" label="会员邮箱" width="200"></el-table-column>
                <el-table-column prop="consumerWechat" label="会员微信" width="200"></el-table-column>
                <el-table-column prop="ctime" label="开始时间" width="200"></el-table-column>
                <el-table-column prop="mtime" label="最后变更时间" width="200"></el-table-column>
                <el-table-column fixed="right" label="操作" width="200"> 
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="consumerHandle(tableData[scope.$index])" type="text">
                            管理
                        </el-button>
                        <el-button @click.native.prevent="deleteRow(scope.$index, tableData, tableData[scope.$index].id, tableData[scope.$index].consumerName)" type="text">
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
            <el-dialog title="添加会员" :visible.sync="dialogVisible" v-if="dialogVisible">
                <el-form label-width= "100px" :model="consumer" :rules="consumerRules">
                    <el-form-item prop="name" label="会员名称:">
                        <el-input v-model="consumer.name" name="name" placeholder="请输入会员名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="cellphone" label="会员手机号:">
                        <el-input v-model="consumer.cellphone" name="cellphone" placeholder="请输入会员手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="email" label="会员邮箱:">
                        <el-input v-model="consumer.email" name="email" placeholder="请输入会员邮箱"></el-input>
                    </el-form-item>
                    <el-form-item prop="wechat" label="会员微信号:">
                        <el-input v-model="consumer.wechat" name="wechat" placeholder="请输入会员微信号"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native.prevent="addConsumerHandle">确定</el-button>
                    <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
  import {listMerchantConsumerPaging, deleteMerchantConsumer, addMerchantConsumer} from '@/api/api'
  import {mapGetters} from 'vuex'
  export default {
    name: 'listConsumer',
    computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'consumer'
    ])
  },
    data() {
      return {
        consumerRules: {
        name: [{
            required: true,
            pattern: /^.{1,128}$/,
            message: '长度范围需在1-128之间' 
        }],
        cellphone: [{
            required: true,
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: '手机号格式不对' 
        }],
        email: [{
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '邮箱格式不对' 
        }],
        wechat: [{
            pattern: /^.{1,128}$/,
            message: '长度范围需在1-128之间' 
        }]},
        dialogVisible: false,
        id: this.id,
        consumer: {
            name: this.name,
            cellphone: this.cellphone,
            email: this.email,
            wechat: this.wechat
        },
        tableData:[],
        pageParam: 1,
        pageSize: 10,
        page:1,
        sizeCount:this.sizeCount,
        listMerchantConsumerPaging: function(json) {
          listMerchantConsumerPaging(json).then(response => {
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
            this.tableData = response.content;
          }).catch(error => {
            this.$message({
              message: '异常：' + error,
              type: 'warning',
              duration: 1000
            })
            return;
          })
        }
      }
    },
    methods: {
      addConsumerHandle() {
        return new Promise((resolve, reject) => {
          addMerchantConsumer(this.consumer).then(response => {
            var json = {};
            if(this.consumerName) {
                json.name = this.consumerName;
            }
            if(this.cellphone) {
                json.cellphone = this.cellphone;
            }
            json.pageNo = this.pageParam;
            json.pageSize = this.pageSize;
            this.listMerchantConsumerPaging(json)
            resolve()
          }).catch(error => {
            this.$message({
              message: '无权限：' + error,
              type: 'warning',
              duration: 1000
            })
            reject(error)
          })
        })
      },
      handle() {
        var json = {};
        if(this.consumerName) {
          json.name = this.consumerName;
        }
        if(this.cellphone) {
         json.cellphone = this.cellphone;
        }
        json.pageNo = this.pageParam;
        json.pageSize = this.pageSize;
        this.listMerchantConsumerPaging(json)
      },
      showExtra(extra) {
        this.$alert(extra, '配置参数', {
          confirmButtonText: '关闭'
        });
      },
      handleSizeChange(val) {
        var json = {};
        json.pageNo = this.pageParam;
        json.pageSize = val;
        this.listMerchantConsumerPaging(json)
      },
      handleCurrentChange(val) {
        var json = {};
        json.pageNo = val;
        json.pageSize = this.pageSize;
        this.listMerchantConsumerPaging(json)
      }, 
      consumerHandle(row) {
        this.$store.dispatch('setConsumer', row)
         this.$router.push({path:'/cmp/consumer'})
      },
      deleteRow(index, rows, id, name) {
        this.$confirm('此操作将永久删除该会员:' + name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return new Promise((resolve, reject) => {
            deleteMerchantConsumer(id).then(response => {
              console.log(response)
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration: 1000
                })
                rows.splice(index, 1);
              resolve()
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    beforeCreate: function() {
      this.$nextTick(function() {
        var json = {};
        json.pageNo = this.pageParam;
        json.pageSize = this.pageSize;
        this.listMerchantConsumerPaging(json)
      })
    }
  }
</script>

<style>
   .el-message-box {
     width: 800px
   }
.center_type {
  /* display: block; */
  text-align: center;
}
.el-dialog__body {
    padding: 30px 200px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
}
</style>