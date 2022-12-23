<template>
  <div class="source-type-img-container text-center ">
    <img
      :src="getSourceBadgeIcon()" alt=""
      :title="sourceLabel"
    >
  </div>
</template>

<script>
  export default {
    name: "source-type-icon",
    props: ["sourceType", "sourceLabel"],
    methods: {
      getSourceBadgeIcon() {
        console.log("sourceType", this.sourceType)
        return require(`../assets/img/source-${this.sourceType.toLowerCase()}.png`)
      }
    }
  }
</script>

<style lang="scss">
  .source-type-img-container{
    width: 20px;
    margin-right: 10px;
    float: left;
    img{
      width: 100%;
    }
  }
</style>
