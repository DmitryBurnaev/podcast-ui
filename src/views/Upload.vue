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
                active-color="rgb(85, 168, 122)"
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
                      accept="audio/*"
                      :limit="uploadParams.maxFiles"
                      :on-exceed="handleUploadLimitExceed"
                      :on-success="handleUploadSuccess"
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
              <button
                  type="button"
                  class="el-button el-button--info is-plain"
                  @click="massUpdateOpenDialog"
                  :disabled="episodesCreating"
              >
                <i class="el-icon-edit"></i><span>Mass update chosen</span>
              </button>
            </div>
          </div>
          <div class="card-body">
            <ul class="list-unstyled team-members">
              <li
                  v-for="item in uploadedFiles"
                  :key="item.id"
              >
                <div class="row">
                  <div class="col-1 text-center uploaded-file-cover">
                    <el-switch
                      v-model="item.checked"
                      active-color="rgb(85, 168, 122)"
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
                      <div class="col-1 image-container" @click="showDetails(item)" >
                        <img v-if="item.episode !== null" :src="item.episode.image_url" alt="Episode's image" class="img-circle img-no-padding img-responsive">
                        <img v-else-if="item.file.cover" :src="item.file.cover.preview_url" alt="Uploading File as a new episode" class="img-circle img-no-padding img-responsive">
                        <img v-else src="../assets/img/upload-cover.png" alt="Uploading File as a new episode" class="img-circle img-no-padding img-responsive">
                      </div>
                      <div class="col-11 item-details">
                        <!-- Episode already created -->
                        <div v-if="item.episode !== null" class="created-episode-description">
                          <router-link
                              tag="a"
                              :to="{name: 'episodeDetails', params: {'episodeID': item.episode.id, 'podcastID': podcast.id}}"
                              target="_blank">
                            {{ item.episode.title }}
                          </router-link>
                          <pre class="text-muted small mb-0 mt-1">{{item.episode.description}}</pre>
                        </div>
                        <!-- Episode was not created yet -->
                        <div v-else class="uploaded-file-description">
                          <span>{{item.file.name}}</span>
                          <hr class="file-info-hr">
                          <ul class="file-info-list">
                            <li>Title: "{{item.file.meta.title}}"</li>
                            <li>Size: {{(item.file.size / 1024 / 1024).toFixed(2)}} MB</li>
                            <li>Duration: ~{{(item.file.meta.duration / 60).toFixed(0) }} min</li>
                          </ul>
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


<!--    dialog for mass changing -->

      <el-dialog :title="'Mass episodes changing'">
<!--        TODO: provide correct form here-->
        <el-form :model="episodeCreation.form" :rules="episodeCreation.rules" ref="createEpisodeForm" @submit.native.prevent="createEpisode">
          <el-form-item prop="source_url" :class="{'is-error': episodeCreation.serverErrors.source_url.length > 0}">
            <el-input
                placeholder="Link to the source"
                v-model="episodeCreation.form.source_url"
                :disabled="episodeCreation.inProgress"
            >
              <el-button slot="append" icon="el-icon-edit" type="success" @click="createEpisode"></el-button>
            </el-input>
            <input-errors :errors="episodeCreation.serverErrors.source_url"></input-errors>
          </el-form-item>
        </el-form>
        <hr class="hr__row-episode">
        <div class="d-flex justify-content-center" v-if="episodeCreation.inProgress">
          <img class="preload ml-1" src="../assets/img/down-arrow.gif" alt=""/>
        </div>
        <div v-else-if="episodeCreation.episode">
          <div class="row row-episode">
            <div class="col-md-2 col-1 episode-content" @click="goToEpisode(episodeCreation.episode, episodeCreation.podcast.id)">
              <div class="episode-image">
                <img :src="episodeCreation.episode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
              </div>
            </div>
            <div class="col-md-9 col-9 episode-title episode-content" @click="goToEpisode(episodeCreation.episode, episodeCreation.podcast.id)">
              {{ episodeCreation.episode.title }}
              <br/>
              <span
                  :class="{
                    'text-success': (episodeCreation.episode.status === 'PUBLISHED'),
                    'text-danger': (episodeCreation.episode.status === 'ERROR'),
                    'text-info': (['NEW', 'DOWNLOADING'].includes(episodeCreation.episode.status)),
                    'text-gray': (episodeCreation.episode.status === 'ARCHIVED')
                  }">
                <small>{{ humanStatus(episodeCreation.episode.status) }}</small>
              </span>
            </div>
            <div class="col-md-1 col-1 text-right episode-controls">
              <img class="preload mr-1 mt-2" v-if="episodeCreation.episode.status === 'DOWNLOADING'" src="../assets/img/down-arrow.gif" alt=""/>
            </div>
          </div>
        </div>
      </el-dialog>
  </div>

</template>

<script>
import axios from "axios";
import config from "@/config";
import store from "@/store";
import app from "@/main";
import InputErrors from "@/components/InputErrors.vue";

export default {
  name: 'UploadView',
  components: {InputErrors},
  data: () => ({
    loading: true,
    podcast: null,
    uploadedFiles: [],
    episodesCreating: false,
    podcastEdit:{
      form: {
        download_automatically: false,
      },
      inProgress: false,
    },
    episodesMassUpdateEdit:{
      form: {
        album: "",
        title: "",
        cover: {}
      },
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
    massUpdateOpenDialog(){
      this.$message({type: 'success', message: 'Open dialog'});
      // TODO: open dialog with form here
    },
    createEpisodes(){
      this.uploadedFiles.forEach((uploadedFile, i) => {
        setTimeout(() => {
          this.createEpisode(uploadedFile);
        }, i*1000);
      });
    },
    createEpisode(uploadedFile){
      console.log(`Creating episode for file ${uploadedFile.file.name}`)
      uploadedFile.status = this.uploadFileStatus.EPISODE_CREATING
      axios.post(
          `podcasts/${this.podcast.id}/episodes/uploaded/`,
          uploadedFile.file
      ).then((response) => {
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
      })
    },
    handleUploadLimitExceed(files, fileList) {
      this.$message.warning(
          `The limit is ${this.uploadParams.maxFiles},
                you selected ${files.length} files this time,
                add up to ${files.length + fileList.length} totally`
      );
    },
    async handleUploadSuccess(fileResponse){
      const existsEpisodeResponse = await axios.get(
          `podcasts/${this.podcast.id}/episodes/uploaded/${fileResponse.payload.hash}/`,
      );
      let episode = null;
      if (existsEpisodeResponse.data.status === 'OK') {
        episode = existsEpisodeResponse.data.payload
      }
      this.insertUploadedFile(
          {
            status: episode !== null ? this.uploadFileStatus.EPISODE_CREATED : this.uploadFileStatus.UPLOADED,
            checked: true,
            episode: episode,
            file: fileResponse.payload,
          },
      )
      this.sortUploadedFiles()
      this.removeFileFromFileList(fileResponse.payload.name)
    },
    removeFileFromFileList(fileName){
      const indexOfObject = this.$refs.upload.uploadFiles.findIndex(file => {
        return file.name === fileName;
      });
      this.$refs.upload.uploadFiles.splice(indexOfObject, 1);
    },
    insertUploadedFile(insertItem){
      const indexOfObject = this.uploadedFiles.findIndex(uploadedFile => {
        return uploadedFile.file.name === insertItem.file.name;
      });
      if (indexOfObject === -1){
        this.uploadedFiles.push(insertItem)
      }
    },
    sortUploadedFiles(){
        let compare;
        compare = function( a, b ) {
          if ( a.file.name < b.file.name ){
            return -1;
          }
          if ( a.file.name > b.file.name ){
            return 1;
          }
          return 0;
        }
        this.uploadedFiles.sort(compare)
    },
    showDetails(uploadedFile) {
      // noinspection JSCheckFunctionSignatures
      let msg = JSON.stringify(uploadedFile, null, 2)
      app.$confirm(
        `<pre>${msg}</pre>`,
        uploadedFile.file.name, {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          cancelButtonClass: 'is-plain',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {});
    }
  }
}
</script>
<style lang="scss">
  pre {font-family: inherit}
  .uploader{
    height: 200px;
    width: 100%;
    border: 1px dashed black;
    display: flex;
    justify-content: center;
    line-height: 200px;
  }
  .row-uploaded-file{
    .image-container{
      padding-top: 5px;
      cursor: pointer;
      img{
        width: 60px;
      }
    }
  }
  .uploaded-file-cover{
    padding-top: 13px;
  }
  .el-message-box{
    width: 680px;
  }
  .file-info-hr{
    margin-top: 5px;
    margin-bottom: 8px;
  }
  .file-info-list{
    display: inline;
    li{
      display: inline;
      list-style-type: none;
      padding-right: 20px;
      float: left;
    }
  }
  .el-message-box__wrapper{
    overflow-y: scroll;
  }
  .item-details{
    a{
      color: #55a87a;
      text-decoration: none;
    }
  }
</style>