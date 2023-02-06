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
    props: ["sourceType", "sourceLabel", "sourceSuffix"],
    methods: {
      getSourceBadgeIcon() {
        let suffix = this.sourceSuffix ? `-${this.sourceSuffix}` : ''
        return require(`../assets/img/source-${this.sourceType.toLowerCase()}${suffix}.png`)
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
