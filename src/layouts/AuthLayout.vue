<template>
  <div class="auth">
    <router-view/>
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
  mounted(){
    console.log("AuthLayout mounted")
    // console.log(this.$router)
  }
}
</script>

<style scoped>

</style>