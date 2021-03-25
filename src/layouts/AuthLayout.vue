<template>
    <div class="content content-auth">
      <div class="row d-flex justify-content-center ml-0 mr-0">
        <div class="col-lg-4 auth-container">
          <router-view/>
        </div>
      </div>
    </div>
</template>

<script>
import app from "@/main";

export default {
  name: "AuthLayout",
  computed: {
    error() {
      return this.$store.getters.error
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
  body{
    background-color: #f4f2f2 !important;
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
  }
  .auth-container {
    margin-top: 100px;
  }

</style>