<template>
    <div class="app-container">
        <el-input v-model="name" name="consumerName" placeholder="请输入会员名称" style="width:20%"></el-input>
        <el-input v-model="cellphone" name="cellphone" placeholder="请输入会员手机号" style="margin-left: 40px;width:20%"></el-input>
        <el-button type="primary" @click.native.prevent="handle" style="margin-left: 40px">提交</el-button>
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
                        <!-- <el-button @click="dialogVisible = true;id=tableData[scope.$index].id" type="text">
                            管理
                        </el-button> -->
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
        </div>
         <!-- <el-dialog title="编辑功能" :visible.sync="dialogVisible" width="90%" top="20px"> -->
        <!-- <consumer v-bind:consumer-id="id" v-if="dialogVisible"></consumer> -->
      <!-- </el-dialog> -->
    </div>
</template>

<script>
  import {listMerchantConsumerPaging, deleteMerchantConsumer} from '@/api/api'
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
        id: this.id,
        name: this.consumerName,
        cellphone: this.cellphone,
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
</style>