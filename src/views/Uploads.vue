<template>
  <div class="content" v-if="!loading">

    <div class="row">
      <div class="col-md-12">
        <div class="card card-podcast card-user">
          <div class="card-header card-header-squash">
            <h5 class="card-title">Upload New Episodes to "{{podcast.name}}"</h5>
            <div class="header-controls">
              <el-switch
                v-model="podcastEdit.form.download_automatically"
                active-color="rgb(107, 208, 152)"
                inactive-color="rgb(203, 203, 203)"
                inactive-text="Auto Download"
                @change="setDownloadAuto()"
              >
              </el-switch>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                  <div class="d-none d-sm-block">
<!--                    <el-button type="info" plain @click="uploadFiles" icon="el-icon-magic-stick">-->
<!--                      Upload Files-->
<!--                    </el-button>-->
<!--                    <label>Files-->
<!--                      <input type="file" id="files" ref="files" multiple v-on:change="uploadFiles()"/>-->
<!--                    </label>-->

                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      :action="uploadParams.url"
                      :headers="uploadParams.headers"
                      multiple
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      :limit="3"
                      :on-exceed="handleExceed"
                      :file-list="fileList"
                      :auto-upload="false"
                      drag

                    >
                      <el-button slot="trigger" size="small" type="primary">select file</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">upload to server</el-button>
                      <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>

<!--                      <el-button size="small" type="primary">Click to upload</el-button>-->
<!--                      <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>-->
                    </el-upload>




                  </div>
<!--                  or-->
              </div>
            </div>
<!--            <div class="row">-->
<!--              <div class="col-md-12">-->
<!--                <div class="uploader">-->
<!--                  Drag and Drop Here-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->

          </div>
        </div>
      </div>
    </div>


<!--    <div class="row" v-if="uploadedEpisodes.length > 0">-->
<!--      <div class="col-12">-->
<!--        <div class="card">-->
<!--          <div class="card-header card-header-with-controls">-->
<!--            <h4 class="card-title">-->
<!--              <span v-if="!playlistSrc.inProgress && playlistTitle">{{playlistTitle}}</span>-->
<!--              <i class="el-icon-caret-right"></i> &lt;!&ndash; " > " &ndash;&gt;-->
<!--              {{podcast.name}}-->
<!--            </h4>-->
<!--            <div class="controls">-->
<!--              <div class="icon-container">-->
<!--                <i v-if="episodesCreating" class="el-icon-loading"></i>-->
<!--              </div>-->
<!--              <button-->
<!--                  type="button"-->
<!--                  class="el-button el-button&#45;&#45;info is-plain"-->
<!--                  @click="createEpisodes"-->
<!--                  :disabled="episodesCreating || playlistSrc.inProgress"-->
<!--              >-->
<!--                <i class="el-icon-edit"></i><span>Add chosen</span>-->
<!--              </button>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="card-body">-->
<!--            <ul class="list-unstyled team-members" v-if="!playlistSrc.inProgress">-->
<!--              <li-->
<!--                  v-for="item in uploadedEpisodes"-->
<!--                  :key="item.id">-->
<!--                <div class="row row-episode">-->

<!--                  <div class="col-md-1 col-1 text-center pt-2">-->
<!--                    <el-switch-->
<!--                      v-model="item.checked"-->
<!--                      active-color="rgb(107, 208, 152)"-->
<!--                      inactive-color="rgb(203, 203, 203)"-->
<!--                      :disabled="episodesCreating || item.downloaded"-->
<!--                    >-->
<!--                    </el-switch>-->
<!--                    <div class="item-status">-->
<!--                      <i v-if="item.downloading" class="el-icon-loading" title="episode is creating now"></i>-->
<!--                      <i v-else-if="item.downloaded" class="el-icon-finished" title="episode successfully created"></i>-->
<!--                      <i v-else-if="item.failed" class="el-icon-document-delete invalid" title="episode creation failed"></i>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  <div class="col-md-2 col-2 image-container">-->
<!--                    <img :src="item.thumbnail_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">-->
<!--                  </div>-->
<!--                  <div class="col-md-9 col-9 item-details">-->
<!--                    <a :href="item.url" target="_blank" :title="item.title"> {{ item.title }}</a>-->
<!--                    <br/>-->
<!--                    <span class="text-muted">-->
<!--                      <small>{{item.description}}</small>-->
<!--                    </span>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <hr class="hr__row-episode">-->
<!--              </li>-->

<!--            </ul>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>

</template>

<script>
// import {fillFormErrors} from "@/utils/podcast";
// import {fillFormErrors, formIsValid} from "@/utils/podcast";
import axios from "axios";
import config from "@/config";
import store from "@/store";
// import app from "@/main";

export default {
  name: 'PodcastDetails',
  components: {},
  data: () => ({
    loading: true,
    podcast: null,
    uploadedEpisodes: [],
    podcastEdit:{
      form: {
        download_automatically: false,
      },
      inProgress: false,
    },
    fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
    uploadParams: {
      name: 'file',
      url: `${config.apiURL}media/upload/audio/`,
      headers: {
        Authorization: `Bearer ${store.getters.accessToken}`
      },
    },
  }),
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    $route: 'fetchData',
  },
  async mounted() {
    await this.fetchData()
    this.$store.commit('setBreadcrumbs', [
      {
        "title": "Home",
        "route": {name: "Home"}
      },
      {
        "title": this.podcast.name,
        "route": {
          name: "podcastDetails",
          params: {
            id: this.podcast.id
          }
        }
      },
      {
        "title": "Upload New Episodes",
        "route": null
      },
    ])
  },
  methods: {
    async fetchData() {
      const podcastID = this.$route.params.podcastID;
      this.podcast = await this.$store.dispatch('getPodcastDetails', podcastID);
      this.podcastEdit.form.download_automatically = this.podcast.download_automatically;
      this.loading = false;
    },
    async setDownloadAuto(){
      const response = await axios.patch(`podcasts/${this.podcast.id}/`, this.podcastEdit.form);
      this.podcast = response.data.payload;
      this.$message({type: 'success', message: 'Podcast successful updated.'});
    },
    uploadFiles(){
      console.log("Uploading files here")
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file, fileList) {
      // eslint-disable-next-line no-debugger
      debugger;
      return this.$confirm(`Cancel the transfert of ${ file.name } ? ( ${fileList})`);
    },
      submitUpload() {
        this.$refs.upload.submit();
      }
  }
}
</script>
<style lang="scss">

  .uploader{
    height: 200px;
    width: 100%;
    border: 1px dashed black;
    display: flex;
    justify-content: center;
    line-height: 200px;
  }
</style>