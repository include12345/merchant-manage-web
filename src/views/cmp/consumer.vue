<template>
     <div class="app-container">
         <p>{{balance}}</p>
     </div>
</template>

<script>
  import {getMerchantConsumerWallet, editMerchantConsumerWallet} from '@/api/api'
  import {mapGetters} from 'vuex'
  export default {
    name: 'consumer',
    data() {
      return {
        row: this.consumer,
        balance: null,
        getMerchantConsumer: function(consumerId) {
          getMerchantConsumerWallet(consumerId).then(response => {
             
            if (!response) {
              this.$message({
                message: '结果为空',
                type: 'warning',
                duration: 1000
              })
              return;
            }
            this.balance = response.balance;
          })
        }
      }
    },
    computed:mapGetters(['consumer']),
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
      consumerHandle(row) {
         this.$router.push({path:'/cmp/consumer', query: row})
      }
    },
    created(){
      this.getMerchantConsumer(this.consumer.id)
    }
  }
</script>

