<template>
  <div>
    <Sidebar/>
    <router-view/>
  </div>
</template>

<script>
import Sidebar from "@/components/app/Sidebar";
export default {
  name: "MainLayout",
  components: {Sidebar}
}
</script>
