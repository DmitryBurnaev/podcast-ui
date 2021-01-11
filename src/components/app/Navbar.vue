<template>
  <nav class="navbar">
    <div class="date">{{date | date('datetime') }}</div>
    <div class="nav-wrapper">

      <div id="nav">
        <button style="margin-right: 5px" class="sandwich" @click="$emit('navClick')">X</button>
        <router-link to="/">Home</router-link>
        |
        <router-link to="/podcasts">Podcast List</router-link>
        |
        <router-link to="/sign-up">SignUp</router-link>
        |
        <router-link to="/sign-in">SignIn</router-link>
      </div>
    </div>

    <div class="dropdown">
      <ul>
        <li>
          <router-link to="/">Profile</router-link>
        </li>
        <li>
          <a href="#" @click.prevent="signOut">Выйти</a>
        </li>
      </ul>

    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data: () => ({
    date: new Date()
  }),
  mounted() {
    this.interval = setInterval(() => {
      this.date = new Date()
    }, 1000)
  },
  methods: {
    signOut() {
      this.$message("SignOut here...")
      this.$router.push("/sign-in?message=signed-out")
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>
  .date{
    position: absolute;
    top: 0;
    left: 10px;
  }
  .dropdown{
    width: 50px;
    position: absolute;
    top: 0;
    right: 80px;
  }
</style>