<template>
  <div>
    <small class="el-form-item__error" v-for="error in errors" v-bind:key="error">
      {{error}}
    </small>
  </div>
</template>

<script>
export default {
  name: "input-errors",
  props: ["errors"],
}
</script>

