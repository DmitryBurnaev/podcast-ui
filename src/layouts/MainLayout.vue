<template>
  <div id="mainLayout" :class="{'nav-open': sidebarIsOpen}">
    <div id="bodyClick" v-if="sidebarIsOpen" @click="setSidebarOpen"></div>
    <Sidebar/>
    <div class="preloader text-center" v-if="loading">
      <i class="icon el-icon-loading"></i>
    </div>
    <div class="main-panel" v-else>
      <Navbar/>
      <router-view/>
    </div>
    <Footer/>
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
    },
    sidebarIsOpen(){
      return this.$store.getters.sidebarIsOpen
    }
  },
  watch: {
    // при изменениях маршрута запрашиваем данные снова
    $route: 'closeSidebar',
  },
  methods: {
    setSidebarOpen(){
      this.$store.commit('setSidebarOpen', !this.sidebarIsOpen)
    },
    closeSidebar(){
      this.$store.commit('setSidebarOpen', false)
    }
  }
}
</script>
<style lang="scss">
  .nav .active{
    a, i{
      color: #6bd098 !important;
    }
    }
  form{
    text-align: center;
    input.invalid{
      border-color: #cc0808;
      color: #cc0808;
    }
    .helper-text{
      color: #730606;
    }
    textarea:focus, input:focus{
      border-color: #6bd098 !important;
    }
  }
  .invalid{
    color: #cc0808;
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
  .el-breadcrumb__inner{
    font-size: 16px !important;
    a:hover{
      color: #6bd098 !important;
    }
    &.is-link{
      font-weight: inherit;
      :hover{
        color: #6bd098 !important;
      }
    }
  }
  .el-breadcrumb__inner a:hover, .el-breadcrumb__inner.is-link:hover {
    color: #186a30 !important;
    cursor: pointer;
  }
  .card{
    .card-header-with-controls{
      position: relative;
      .controls{
        position: absolute;
        top: 14px;
        right: 14px;
        img{
          width: 25px;
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
    .card-title{
      @media (max-width: 576px) {
        margin-top: 0 !important;
        margin-bottom: 20px;
      }
    }
  }
  button:disabled,
  button[disabled]{
    cursor: not-allowed;
    background-color: #f5f7fa !important;
    color: #a0a3a8 !important;
    border-color: #ddd !important;
  }
  .el-dialog{
    @media (max-width: 576px) {
      width: 95%;
    }
  }
  .hide-on-small{
    @media (max-width: 576px) {
      display: none;
    }
  }
</style>