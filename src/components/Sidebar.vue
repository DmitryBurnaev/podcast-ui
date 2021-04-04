<template>
    <div class="sidebar" data-color="black" data-active-color="warning">
    <div class="logo">
      <a href="https://www.creative-tim.com" class="simple-text logo-mini">
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
    </div>
  </div>

</template>

<script>
export default {
  name: "Sidebar",
  data: () => ({
    links: [
      {"title": "Home", "url": "/", "icon": "nc-badge", "exact": true},
      {"title": "Podcast List", "url": "/podcasts/", "icon": "nc-bullet-list-67"},
      {"title": "Progress", "url": "/progress/", "icon": "nc-user-run"},
    ],
  }),
}
</script>
