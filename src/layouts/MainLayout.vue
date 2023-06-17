<template>
  <div id="mainLayout" :class="{'nav-open': sidebarIsOpen}">
    <div id="bodyClick" v-if="sidebarIsOpen" @click="setSidebarOpen"></div>
    <SidebarComponent/>
    <div class="preloader text-center" v-if="loading">
      <i class="icon el-icon-loading"></i>
    </div>
    <div class="main-panel" v-else>
      <NavbarComponent/>
      <router-view/>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "@/components/Sidebar";
import NavbarComponent from "@/components/Navbar";
import {closeSidebar} from "@/utils/podcast";

export default {
  name: "MainLayout",
  components: {SidebarComponent, NavbarComponent},
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
    // changing route calls fetching data
    $route: 'closeSidebar',
  },
  methods: {
    setSidebarOpen(){
      this.$store.commit('setSidebarOpen', !this.sidebarIsOpen)
    },
    closeSidebar: closeSidebar
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
    padding-top: 100px;
    .icon{
      font-size: 50px;
    }
  }
  .cursor-pointer{
    cursor: pointer;
  }
  .row-episode{
    position: relative;
  }
  .row-episode .episode-content{
    cursor: pointer;
  }
  .row-episode .episode-title{
    margin-top: -3px;
    @media (max-width: 576px) {
      margin-top: -5px;
      padding-left: 0;
      padding-right: 35px;
    }
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
    @media (max-width: 576px) {
      float: initial;
      margin-top: 10px;
    }
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
    .card-header-squash{
      .card-title{
        @media (max-width: 576px) {
          margin-top: 0 !important;
          margin-bottom: 20px;
        }
      }
    }
    .card-header{
      position: relative;
      .header-controls{
        position: absolute;
        right: 15px;
        top: 24px;
        @media (max-width: 576px) {
          top: 20px;
        }
        .el-switch__label{
          @media (max-width: 576px) {
            margin-right: -40px;
            margin-top: -42px;
          }
          span{
            @media (max-width: 576px) {
              font-size: 11px;
            }
          }
          &.is-active{
            color: #A1A4A9 !important;
          }
        }
        div{
          margin-left: 5px;
        }
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
  .el-dialog, .el-message-box{
    @media (max-width: 576px) {
      width: 95%;
    }
  }
  .hide-on-small{
    @media (max-width: 576px) {
      display: none;
    }
  }
  .hide-on-large{
    @media (min-width: 577px) {
      display: none !important;
    }
  }
  .sidebar-wrapper{
    overflow-x: hidden !important;
  }
  .el-button--primary{
    background-color: #168a4a !important;
    border-color: #168a4a !important;
    &:hover{
      background-color: #1db764 !important;
    }
  }
  .el-message-box__btns{
    .is-plain:hover{
        border-color: #168a4a;
        color: #168a4a;
    }
  }
</style>