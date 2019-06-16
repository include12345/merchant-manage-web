<template>
    <div class="app-container">
        <el-input v-model="name" name="consumerName" placeholder="请输入会员名称" style="width:20%"></el-input>
        <el-input v-model="cellphone" name="cellphone" placeholder="请输入会员手机号" style="margin-left: 40px;width:20%"></el-input>
        <el-button type="primary" @click.native.prevent="handle" style="margin-left: 40px">提交</el-button>
        <hr>
        <div id="hide" style="padding-top:30px;display: none;padding-right:30px;padding-bottom:30px">
            <el-table :data="tableData" style="width:100%" max-height="750" border highlight-current-row>
                <el-table-column prop="name" label="会员名称" width="200"></el-table-column>
                <el-table-column prop="cellphone" label="会员手机号" width="700"></el-table-column>
                <el-table-column prop="email" label="会员邮箱" width="80"></el-table-column>
                <el-table-column prop="wechat" label="会员微信" width="50"></el-table-column>
                <el-table-column prop="ctime" label="开始时间" width="180"></el-table-column>
                <el-table-column prop="mtime" label="最后变更时间" width="180"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120"> 
                    <template slot-scope="scope">
                        <el-button @click="dialogVisible = true;username=tableData[scope.$index].username" type="text">
                            管理
                        </el-button>
                        <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
                            移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
  export default {
    methods: {
      deleteRow(index, rows) {
        rows.splice(index, 1);
      }
    },
    data() {
      return {
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      }
    }
  }
</script>
