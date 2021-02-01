<template>
  <div class="content podcast-progress-content">
    <div class="container-fluid">
      <h2>Current Progress</h2>
      <div class="row">
        <div class="col-md-8">
          <div  v-for="progress in progressItems" :key="progress.episode_id">
            <pre>
              {{JSON.stringify(progress)}}
            </pre>
          </div>
        </div>
        <div class="col-md-4">
          <user-card>
          </user-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: 'Progress',
    data: () => ({
        loading: true,
        progressItems: [],
        timeInterval: null,
    }),
    async mounted() {
      this.loading = true
      this.timeInterval = setInterval(() => {
        // this.progressItems = [{"episode_id": 1, "test": "foo"}]
        const response = axios.get(`progress/`)
        console.log(this.progressItems)
        if (response){
          this.progressItems = response.data
        }
      }, 500)
    },
    destroyed() {
      clearInterval(this.timeInterval)
    }
  }

</script>