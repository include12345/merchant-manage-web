<template>
    <div class="app-container">

    </div>
</template>


<script>
export default {
    beforeCreate: function() {
      this.$nextTick(function() {
            this.$store.dispatch("getContacts");
            this.$store.dispatch("subscribeMsg");
            this.$store.dispatch("listFriendReq");
            this.$store.dispatch("getUnReadMessages");

      });
  },
}
</script>

<style scoped>
 .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }
</style>


