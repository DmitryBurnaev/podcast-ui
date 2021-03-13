<template>
    <div class="content content-auth">
      <div class="row">
        <div class="col-lg-4 auth-container">
          <router-view/>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "AuthLayout",
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(serverError){
      this.$error(serverError.details)
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
    margin-left: 30%;
    margin-top: 100px;
  }

</style>