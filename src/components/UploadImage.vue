<template>
  <div>
    <img
        v-if="podcast.image_url"
        class="avatar border-gray"
        :src="podcast.image_url"
        :alt="podcast.name"
        @click="toggleShow"
        @error="defaultImage"
    >
    <img v-else class="avatar border-gray" src="../assets/img/cover-default.jpeg" :alt="podcast.name" @click="toggleShow">
    <my-upload
      @crop-success="cropSuccess"
      v-model="show"
      :headers="headers"
      :lang-ext="langExt"
      img-format="png"
      :url="params.url"
      :field="params.name"
      :width="500"
      :height="500"
    >
    </my-upload>
  </div>
</template>

<script>
import store from "@/store";
import config from "@/config";
import myUpload from "vue-image-crop-upload/upload-2";
import {defaultImage} from "@/utils/podcast";

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
    defaultImage,
    toggleShow() {
      this.show = !this.show;
    },
    /** crop success
    *
    * [param] imgDataUrl
    * [param] field
    */
    cropSuccess(imgDataUrl, field){
      console.log('-------- crop success -------- ' + field);
      // eslint-disable-next-line
      this.podcast.image_url = imgDataUrl
    },
  }
}
</script>

<style lang="scss">
  img.avatar{
    cursor: pointer;
  }
  img.vicp-img{
    max-width: none;
  }
</style>