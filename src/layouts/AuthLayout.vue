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
      console.error(serverError)
    }
  }
}
</script>

<style scoped>

</style>