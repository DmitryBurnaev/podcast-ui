<template>
  <nav class="navbar">
    <div class="nav-wrapper">

      <div id="nav">
        <button style="margin-right: 5px" class="sandwich" @click="$emit('navClick')">X</button>
        <router-link to="/">Home</router-link>
        |
        <router-link to="/podcasts">Podcast List</router-link>
        |
        <router-link to="/sign_up">SignUp</router-link>
        |
        <router-link to="/sign_in">SignIn</router-link>
      </div>
    </div>


  </nav>
</template>

<script>
export default {
  name: "Navbar"
}
</script>

<style scoped>

</style>