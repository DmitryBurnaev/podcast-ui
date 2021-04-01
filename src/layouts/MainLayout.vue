<template>
  <div id="mainLayout">
    <Sidebar/>
    <div class="preloader text-center" v-if="loading">
      <i class="icon el-icon-loading"></i>
    </div>
    <div class="main-panel" v-else>
      <Navbar @navClick="sidebarIsOpen = !sidebarIsOpen"/>
      <router-view/>
    </div>
    <Footer />
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import app from "@/main";

export default {
  name: "MainLayout",
  components: {Sidebar, Navbar, Footer},
  computed: {
    error() {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.globalLoading
    }
  },
  watch: {
    error(serverError){
      if ( typeof serverError.details !== 'object'){
        app.$message({type: 'error', message: serverError.details});
      }
    }
  },
}
</script>
<style lang="scss">
  .preloader{
    padding-top: 75px;
    .icon{
      font-size: 50px;
    }
  }
  .cursor-pointer{
    cursor: pointer;
  }
  .row-episode{
  }
  .row-episode .episode-content{
    cursor: pointer;
  }
  .row-episode .episode-title{
    margin-top: -3px;
  }
</style>