<template>
  <nav class="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle" :class="{'toggled': sidebarIsOpen}" @click="setSidebarOpen">
          <button type="button" class="navbar-toggler">
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
              v-for="breadcrumb in breadcrumbs"
              :key="breadcrumb.title"
              :to="breadcrumb.route">
            {{breadcrumb.title}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
  </nav>

</template>

<script>
import {Breadcrumb, BreadcrumbItem} from 'element-ui';

export default {
  name: "NavbarComponent",
  components: {
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
  },
  methods: {
    setSidebarOpen(){
      this.$store.commit('setSidebarOpen', !this.sidebarIsOpen)
    }
  },
  computed: {
    breadcrumbs() {
      return this.$store.getters.breadcrumbs
    },
    sidebarIsOpen(){
      return this.$store.getters.sidebarIsOpen
    }
  },

}
</script>
<style lang="scss">
  .btn-sign-out{
    cursor: pointer;
    color: #626468 !important;
    :hover{
      color: #6bd098 !important;
    }
  }
  .sign-out{
    position: absolute;
    right: 20px;
    top: 12px;
    font-size: 18px;
    @media (max-width: 576px) {right: 5px;}
  }
  .navbar{
    height: 63px;
  }
  .el-breadcrumb__separator{
    @media (max-width: 576px) {
      display: block;
      float: left;
      margin: 0 2px !important;
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
    @media (max-width: 576px) {
      max-width: 25vw;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      float: left;
      overflow: hidden;
    }
  }
  .el-breadcrumb__inner a:hover, .el-breadcrumb__inner.is-link:hover {
    color: #186a30 !important;
    cursor: pointer;
  }
</style>
