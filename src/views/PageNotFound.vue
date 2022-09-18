<template>
    <div class="card">
      <div class="card-header">
        <h4 class="card-title text-center">Page Not Found</h4>
      </div>
      <div class="card-body text-center">
        <button class="btn btn-lg btn-primary btn-block mt-4" @click="goHome()">Home</button>
      </div>
    </div>
</template>

<script>
import router from "@/router";

export default {
  name: "PageNotFoundView",
  methods: {
    async goHome() {
      router.push(`/`).then(() => {})
    },
  }
}
</script>
