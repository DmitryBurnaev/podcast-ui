<template>
  <div id="mainLayout">
    <Navbar @navClick="sidebarIsOpen = !sidebarIsOpen"/>
    <Sidebar v-model="sidebarIsOpen" />
    <main class="app-content" :class="{full: !sidebarIsOpen}">
      <router-view/>
    </main>
  </div>
</template>

<script>
import Sidebar from "@/components/app/Sidebar";
import Navbar from "@/components/app/Navbar";
export default {
  name: "MainLayout",
  components: {Sidebar, Navbar},
  data: () => ({
    sidebarIsOpen: true
  }),
}
</script>
