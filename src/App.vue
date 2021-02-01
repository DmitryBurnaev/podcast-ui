<template>
  <div>
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>
  import AuthLayout from "@/layouts/AuthLayout";
  import MainLayout from "@/layouts/MainLayout";
  export default {
    computed: {
      layout() {
        return (this.$route.meta.layout || "main")+ "-layout"
      }
    },
    components: {
      AuthLayout, MainLayout
    }
  }

</script>
<style lang="scss">
  @import 'assets/css/bootstrap.min.css';
  @import 'assets/scss/paper-dashboard';

</style>