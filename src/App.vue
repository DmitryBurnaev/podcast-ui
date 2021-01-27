<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
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
  .vue-notifyjs.notifications{
    .list-move {
      transition: transform 0.3s, opacity 0.4s;
    }
    .list-item {
      display: inline-block;
      margin-right: 10px;

    }
    .list-enter-active {
      transition: transform 0.2s ease-in, opacity 0.4s ease-in;
    }
    .list-leave-active {
      transition: transform 1s ease-out, opacity 0.4s ease-out;
    }

    .list-enter {
      opacity: 0;
      transform: scale(1.1);

    }
    .list-leave-to {
      opacity: 0;
      transform: scale(1.2, 0.7);
    }
  }
</style>