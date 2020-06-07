<template>
  <div class="app-container">
    <div>
      <transition name="fade">
        <div class="c-index">
          <mt-header fixed :title="title"></mt-header>
          <div class="content" ref="content">
            <mt-tab-container v-model="active">
              <mt-tab-container-item id="message">
                <session-section :height="height"></session-section>
              </mt-tab-container-item>
              <mt-tab-container-item id="contact">
                <contact-section :height="height"></contact-section>
              </mt-tab-container-item>
              <mt-tab-container-item id="aboutme">
                <aboutme-section></aboutme-section>
              </mt-tab-container-item>
            </mt-tab-container>
          </div>
          <mt-tabbar fixed v-model="active">
            <mt-tab-item id="message">
              <mt-badge size="small" color="red" v-show="unreadMsgCount">
                {{ unreadMsgCountMothod }}
              </mt-badge>
              <i slot="icon" class="icon icon-bubble2"></i>
              {{ "消息" }}
            </mt-tab-item>
            <mt-tab-item id="contact">
              <mt-badge size="small" color="red" v-show="unreadReqCount">
                {{ unreadReqCountMothod }}
              </mt-badge>
              <i slot="icon" class="icon icon-users"></i>
              {{ "联系人" }}
            </mt-tab-item>
            <mt-tab-item id="aboutme">
              <i slot="icon" class="icon icon-user"></i>
              {{ "我" }}
            </mt-tab-item>
          </mt-tabbar>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import SessionSection from "./components/SessionSection";
import ContactSection from "./components/ContactSection";
import AboutmeSection from "./components/AboutmeSection";
import { mapGetters } from "vuex";
export default {
  name: "chat-index",
  components: {
    SessionSection,
    ContactSection,
    AboutmeSection
  },
  data() {
    return {
      searchWord: "",
      messages: [],
      height: 0
    };
  },
  computed: {
    ...mapGetters(["unreadMsgCount", "unreadReqCount"]),
    title() {
      if (this.active == "message") {
        return "消息";
      }
      if (this.active == "contact") {
        return "联系人";
      }
      if (this.active == "aboutme") {
        return "我";
      }
      return "";
    },
    unreadMsgCountMothod() {
      return this.unreadMsgCount > 99 ? "99+" : this.unreadMsgCount;
    },
    unreadReqCountMothod() {
      return this.unreadReqCount > 99 ? "99+" : this.unreadReqCount;
    },
    active: {
      get() {
        return this.$store.getters.active;
      },
      set(value) {
        this.$Lazyload.lazyLoadHandler();
        this.$store.dispatch("setActive", value);
      }
    }
  },

  created() {
    this.height = document.documentElement.clientHeight - 95;
  }
};
</script>

<style lang="scss">
.c-index {
    // width: 100%;
    // height: 100%;
    margin-top: 20px;
  .content {
    width: 100%;
    // top: 40px;
    // left: 0;
    height: calc(100%-50px) !important;
    background-color: bisque;
    .mint-tab-container {
      //   width: 100%;
      //   height: 100%;
      .mini-tab-container-wrap {
        // width: 100%;
        // height: 100%;
        .mini-tab-container-item {
          //   width: 100%;
          //   height: 100%;
          overflow: auto;
        }
      }
    }
  }
  .mint-tab-item-label {
    position: relative;
    .mini-badge {
      position: absolute;
      top: -38px;
      right: 35px;
    }
  }
}

.mint-header.is-fixed {
  top: 51px;
  right: 0;
//   left: 180px;
  margin-left: 180px;
  position: fixed;
  z-index: 1;
}
.mint-tabbar.is-fixed {
    margin-left: 180px;
}
</style>