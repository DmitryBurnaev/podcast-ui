<template>
    <div class="sidebar" data-color="black" data-active-color="warning" v-if="!loading">
      <div class="logo">
        <a href="/" class="simple-text logo-mini">
          <div class="logo-image-small">
            <img src="../assets/img/podcast-logo.jpeg" alt="...">
          </div>
        </a>
        <router-link tag="a" :to="{name: 'Home'}" class="simple-text logo-normal">Podcasts</router-link>
      </div>
      <div class="sidebar-wrapper">
        <ul class="nav">
          <router-link
              v-for="link in links"
              :key="link.url"
              tag="li"
              active-class="active"
              :to=link.url
              :exact=link.exact
          >
            <a href="#">
              <i class="nc-icon" :class="link.icon"></i>
              <p>{{link.title}}</p>
            </a>
          </router-link>
        </ul>
        <ul class="nav bottom-nav">
          <hr />
          <li>
            <a @click="signOut">
              <i class="nc-icon nc-button-power"></i>
              <p>Sign Out</p>
            </a>
          </li>
        </ul>
      </div>
  </div>

</template>

<script>
import {closeSidebar} from "@/utils/podcast";
import app from "@/main";

export default {
  name: "SidebarComponent",
  data: () => ({
    links: [
      {"title": "Home", "url": "/", "icon": "nc-badge", "exact": true},
      {"title": "Podcast List", "url": "/podcasts/", "icon": "nc-bullet-list-67"},
      {"title": "Progress", "url": "/progress/", "icon": "nc-user-run"},
    ],
  }),
  computed: {
    loading () {
      return this.$store.getters.globalLoading
    },
  },
  methods: {
    signOut() {
      closeSidebar()
      app.$confirm('You will be logged out and redirected to sign-in page. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          cancelButtonClass: 'is-plain',
          type: 'warning'
      }).then(() => {
          app.$store.dispatch('signOut').then(() => {
            app.$router.push("/sign-in?message=signed-out").then()
          })
      });
    },
  }
}
</script>
<style lang="scss">
  .sidebar{
    position: relative;
  }
  .sidebar-sign-out{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
    font-size: 24px;
    color: white;
  }
  .bottom-nav{
    width: 100%;
    position: absolute;
    bottom: 0;
    hr{
      border-color: #b1b2b4;
      margin-bottom: 0;
      width: 90%;
    }
  }
</style>