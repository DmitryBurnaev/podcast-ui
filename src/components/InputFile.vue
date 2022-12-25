<template>
  <input type="file" @change="onChangeFile" name="file" :accept="accept" />
</template>

<script>
export default {
  name: "input-file",
  props: ["accept"],
  methods: {
    onChangeFile(event) {
      this.$emit('update:modelValue', event.target.files[0])
    }
  }
}
</script>
