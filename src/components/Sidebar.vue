<template>
    <div class="sidebar" data-color="black" data-active-color="warning">
    <div class="logo">
      <a href="https://www.creative-tim.com" class="simple-text logo-mini">
        <div class="logo-image-small">
          <img src="../assets/img/logo-small.png">
        </div>
        <!-- <p>CT</p> -->
      </a>
      <a href="https://www.creative-tim.com" class="simple-text logo-normal">
        Creative Tim
        <!-- <div class="logo-image-big">
          <img src="../assets/img/logo-big.png">
        </div> -->
      </a>
    </div>
    <div class="sidebar-wrapper">
      <ul class="nav">
<!--        <router-link-->
<!--            v-for="link in links"-->
<!--            :key="link.url"-->
<!--            tag="li"-->
<!--            active-class="active"-->
<!--            :to=link.url-->
<!--            :exact=link.exact-->
<!--        >-->
<!--          <a href="#" class="link-link">{{link.title}}</a>-->
<!--        </router-link>        -->
<!--        -->

        <li class="active ">
          <a href="./dashboard.html">
            <i class="nc-icon nc-bank"></i>
            <p>Dashboard</p>
          </a>
        </li>
        <li>
          <a href="./icons.html">
            <i class="nc-icon nc-diamond"></i>
            <p>Icons</p>
          </a>
        </li>
        <li>
          <a href="./map.html">
            <i class="nc-icon nc-pin-3"></i>
            <p>Maps</p>
          </a>
        </li>
        <li>
          <a href="./notifications.html">
            <i class="nc-icon nc-bell-55"></i>
            <p>Notifications</p>
          </a>
        </li>
        <li>
          <a href="./user.html">
            <i class="nc-icon nc-single-02"></i>
            <p>User Profile</p>
          </a>
        </li>
        <li>
          <a href="./tables.html">
            <i class="nc-icon nc-tile-56"></i>
            <p>Table List</p>
          </a>
        </li>
        <li>
          <a href="./typography.html">
            <i class="nc-icon nc-caps-small"></i>
            <p>Typography</p>
          </a>
        </li>
        <li class="active-pro">
          <a href="./upgrade.html">
            <i class="nc-icon nc-spaceship"></i>
            <p>Upgrade to PRO</p>
          </a>
        </li>
      </ul>
    </div>
  </div>

<!--  -->
<!--  -->
<!--  <div class="side-bar" :class="{open: value}">-->

<!--    <ul class="main-nav">-->
<!--      <router-link-->
<!--          v-for="link in links"-->
<!--          :key="link.url"-->
<!--          tag="li"-->
<!--          active-class="active"-->
<!--          :to=link.url-->
<!--          :exact=link.exact-->
<!--      >-->
<!--        <a href="#" class="link-link">{{link.title}}</a>-->
<!--      </router-link>-->
<!--    </ul>-->
<!--    <hr>-->
<!--    <h4 style="text-align: center">Podcasts list</h4>-->
<!--    <ul class="podcast-list-nav">-->
<!--      <router-link-->
<!--          v-for="podcast in podcasts"-->
<!--          :key="podcast.id"-->
<!--          tag="li"-->
<!--          active-class="active"-->
<!--          :to="{name: 'podcastDetails', params: {'id': podcast.id}}"-->
<!--      >-->
<!--        <a href="#" class="podcast-link">{{podcast.name}}</a>-->
<!--      </router-link>-->
<!--    </ul>-->
<!--  </div>-->

</template>

<script>
export default {
  name: "Sidebar",
  props: ['value', 'podcasts'],
  data: () => ({
    links: [
      {"title": "Home", "url": "/", "exact": true},
      {"title": "Podcast List", "url": "/podcasts/"},
      {"title": "Progress", "url": "/progress/"},
    ],
  }),
}
</script>

<style scoped>
  .side-bar{
    width: 25%;
    border: 1px solid gray;
    float: left;
  }
  .side-bar li.router-link-exact-active a{
      color: #42b983;
  }
</style>