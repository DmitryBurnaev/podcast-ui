<template>
  <div>
    <img v-if="podcast.image_url" class="avatar border-gray" :src="podcast.image_url" :alt="podcast.name" @click="toggleShow">
    <img v-else class="avatar border-gray" src="../assets/img/cover-default.jpeg" :alt="podcast.name" @click="toggleShow">
    <!-- TODO: increase result image size: https://www.npmjs.com/package/vue-image-crop-upload -->
    <my-upload
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
      v-model="show"
      :params="params"
      :headers="headers"
      :lang-ext="langExt"
      img-format="png"
      :url="params.url"
      :field="params.name"
    >
    </my-upload>
  </div>
</template>

<script>
import store from "@/store";
import config from "@/config";
import myUpload from "vue-image-crop-upload/upload-2";

export default {
  name: "UploadImage",
  props: ['podcast'],
  data: function() {
    return {
      show: false,
      params: {
        name: 'image',
        with: 500,
        height: 500,
        url: `${config.apiURL}podcasts/${this.podcast.id}/upload-image/`
      },
      headers: {
        Authorization: `Bearer ${store.getters.accessToken}`
      },
      imgDataUrl: '', // the datebase64 url of created image
      langExt: {
          hint: 'Click or drag the file here to upload',
          loading: 'Uploading…',
          noSupported: 'Browser is not supported, please use IE10+ or other browsers',
          success: 'Upload success',
          fail: 'Upload failed',
          preview: 'Preview',
          btn: {
            off: 'Cancel',
            close: 'Close',
            back: 'Back',
            save: 'Save'
          },
          error: {
            onlyImg: 'Image only',
            outOfSize: 'Image exceeds size limit: ',
            lowestPx: 'Image\'s size is too low. Expected at least: '
          }
      },
    }
  },
  components: {
    'my-upload': myUpload
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
          /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field){
      console.log('-------- crop success -------- ' + field);
      this.podcast.image_url = imgDataUrl
    },
    /**
     * upload success
     *
     * [param] jsonData  server api return data, already json encode
     * [param] field
     */
    cropUploadSuccess(jsonData, field){
      console.log('-------- upload success --------');
      console.log(jsonData);
      console.log('field: ' + field);
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field){
      console.log('-------- upload fail --------');
      console.log(status);
      console.log('field: ' + field);
    },
  }
}
</script>

<style lang="scss">

</style>