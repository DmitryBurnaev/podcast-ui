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
}
</script>
<style lang="scss">
  form{
    text-align: center;
    input.invalid{
      border-color: #cc0808;
      color: #cc0808;
    }
    .helper-text{
      color: #730606;
    }
  }
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
  .btn-outline-gray{
    color: gray;
    cursor: pointer;
    vertical-align: middle;
    height: 100%;
    display: flex;
    align-items: center;
    float: right;
    margin-right: 5px;
    :hover{
      color: black;
    }
  }

</style>