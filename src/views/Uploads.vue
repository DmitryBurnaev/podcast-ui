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
                inactive-text="Auto Publish"
                @change="setDownloadAuto()"
              >
              </el-switch>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                  <div class="d-none d-sm-block">
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      :action="uploadParams.url"
                      :headers="uploadParams.headers"
                      drag
                      multiple
                      :limit="uploadParams.maxFiles"
                      :on-exceed="handleExceed"
                      :on-success="handleSuccess"
                      :file-list="fileList"
                      :auto-upload="true"
                    >
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                      <div class="el-upload__tip" slot="tip">audio/mpeg files with a size less than 100Mb</div>
                    </el-upload>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="row" v-if="uploadedFiles.length > 0">
      <div class="col-12">
        <div class="card">
          <div class="card-header card-header-with-controls">
<!--            <h4 class="card-title">-->
<!--              <span v-if="!playlistSrc.inProgress && playlistTitle">{{playlistTitle}}</span>-->
<!--              <i class="el-icon-caret-right"></i> &lt;!&ndash; " > " &ndash;&gt;-->
<!--              {{podcast.name}}-->
<!--            </h4>-->
            <div class="controls">
              <div class="icon-container">
                <i v-if="episodesCreating" class="el-icon-loading"></i>
              </div>
              <button
                  type="button"
                  class="el-button el-button--info is-plain"
                  @click="createEpisodes"
                  :disabled="episodesCreating"
              >
                <i class="el-icon-edit"></i><span>Add chosen</span>
              </button>
            </div>
          </div>
          <div class="card-body">
            <ul class="list-unstyled team-members">
              <li
                  v-for="item in uploadedFiles"
                  :key="item.id"
              >
                <div class="row row-episode">
                  <div class="col-1 text-center pt-2">
                    <el-switch
                      v-model="item.checked"
                      active-color="rgb(107, 208, 152)"
                      inactive-color="rgb(203, 203, 203)"
                      :disabled="item.status === uploadFileStatus.EPISODE_CREATING || item.status === uploadFileStatus.EPISODE_CREATED"
                    >
                    </el-switch>
                    <div class="item-status">
                      <i v-if="item.status === uploadFileStatus.EPISODE_CREATING" class="el-icon-loading" title="episode is creating now"></i>
                      <i v-else-if="item.status === uploadFileStatus.EPISODE_CREATED" class="el-icon-finished" title="episode successfully created"></i>
                      <i v-else-if="item.status === uploadFileStatus.ERROR" class="el-icon-document-delete invalid" title="episode creation failed"></i>
                    </div>
                  </div>
                  <div class="col-9">
                    <div class="row row-uploaded-file">
                      <div class="col-1 image-container">
                        <img v-if="item.downloaded" :src="item.episode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
                        <img v-else src="../assets/img/upload-cover.png" @click="showUploadedFileDetails(item)" alt="Uploading File as a new episode" class="img-circle img-no-padding img-responsive">
                      </div>
                      <div class="col-11 item-details">
                        <!-- Episode already created -->
                        <div v-if="item.downloaded" class="created-episode-description">
                          <a :href="item.episode.url" target="_blank" :title="item.episode.title"> {{ item.episode.title }}</a>
                          <br/>
                          <span class="text-muted">
                            <small>{{item.episode.description}}</small>
                          </span>
                        </div>
                        <!-- Episode was not created yet -->
                        <div v-else class="uploaded-file-description">
                          <span>{{item.file.name}}</span>
                          <hr>
                          <ul>
                            <li>Title: "{{item.file.meta.title}}"</li>
                            <li>Size: {{(item.file.size / 1024 / 1024).toFixed(2)}} MB</li>
                            <li>Duration: ~{{(item.file.meta.duration / 60).toFixed(0) }} min</li>
                          </ul>

<!--                          <br/>-->
<!--                          <pre>{{ JSON.stringify(item.file.meta, null, 2) }}</pre>-->

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="hr__row-episode">
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import config from "@/config";
import store from "@/store";
import app from "@/main";

export default {
  name: 'PodcastDetails',
  components: {},
  data: () => ({
    loading: true,
    podcast: null,
    uploadedFiles: [
      {
        status: "UPLOADED",
        checked: false,
        episode: null,
        file: {
          "name": "01. Пролог.mp3",
          "hash": "881acf707e9008175f320169b943efed",
          "meta": {
            "title": "Пролог",
            "duration": 1211,
            "author": "Джеймс Кори",
            "track": "01",
            "album": "Падение Левиафана"
          },
          "path": "tmp/audio/uploaded_audio_881acf707e9008175f320169b943efed.mp3",
          "size": 29680824
        },
      }
    ],
    episodesCreating: false,

    podcastEdit:{
      form: {
        download_automatically: false,
      },
      inProgress: false,
    },
    fileList: [],
    uploadParams: {
      name: 'file',
      maxFiles: 100,
      // todo: use method http-request for manual handling upload requests
      //       (see https://element.eleme.io/#/en-US/component/upload)
      url: `${config.apiURL}media/upload/audio/`,
      headers: {
        Authorization: `Bearer ${store.getters.accessToken}`
      },
    },
    uploadFileStatus: {
      NEW: 'NEW',
      UPLOADED: 'UPLOADED',
      EPISODE_CREATING: 'EPISODE_CREATING',
      EPISODE_CREATED: 'EPISODE_CREATED',
      ERROR: 'ERROR',
    }
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
    async createEpisodes(){
      console.log("Sending files: " + this.uploadedFiles)
      this.uploadedFiles.forEach((uploadedFile) => {
        this.createEpisode(uploadedFile)
      })
    },
    async createEpisode(uploadedFile){
      console.log(`Creating episode for file ${uploadedFile.file.name}`)
      uploadedFile.status = this.uploadFileStatus.EPISODE_CREATING
      const response = await axios.post(
          `podcasts/${this.podcast.id}/episodes/uploaded/`,
          uploadedFile.file
      );
      if (response.data.status === 'OK'){
        let episode = response.data.payload
        uploadedFile.status = this.uploadFileStatus.EPISODE_CREATED
        uploadedFile.episode = episode
        uploadedFile.episode.url = `/podcasts/${this.podcast.id}/episodes/${episode.id}`
        console.log(`Created episode #${episode.id} '${episode.title}'`)
      } else {
        uploadedFile.status = this.uploadFileStatus.ERROR
        console.log(`Got ERROR for ${uploadedFile.file.name}: ${response.data.details}`)
      }
    },
    removeUploadedFile(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
          `The limit is ${this.uploadParams.maxFiles},
                you selected ${files.length} files this time,
                add up to ${files.length + fileList.length} totally`
      );
    },
    // eslint-disable-next-line no-unused-vars
    async handleSuccess(fileResponse){
      // TODO: add with sorting by name
      const existsEpisodeResponse = await axios.get(
          `podcasts/${this.podcast.id}/episodes/uploaded/${fileResponse.payload.hash}/`,
      );
      let episode = null;
      if (existsEpisodeResponse.data.status === 'OK') {
        episode = existsEpisodeResponse.data.payload
      }
      this.uploadedFiles.push({
        status: episode !== null ? this.uploadFileStatus.EPISODE_CREATED : this.uploadFileStatus.UPLOADED,
        checked: episode !== null,
        episode: episode,
        file: fileResponse.payload,
      })
      // eslint-disable-next-line no-debugger
      // debugger;
    },
    showUploadedFileDetails(uploadedFile) {
      let msg = JSON.stringify(uploadedFile, null, 2);
      //TODO: make "pre" output
      app.$confirm(`<pre>${msg}</pre>`, 'Info', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          cancelButtonClass: 'is-plain',
          type: 'info'
      }).then(() => {
      });
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
  .row-uploaded-file{
    .image-container img{
      width: 60px;
    }
  }
</style>