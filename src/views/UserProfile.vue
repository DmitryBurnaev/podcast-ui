<template>
  <div class="content" v-if="!loading" ref="myContent">
    <div class="row">
      <div class="col-md-4">
        <div class="card card-profile card-user card-user-left-column" ref="profileLeftComponent">
          <div class="image card-background" >
            <img src="../assets/img/podcast-background.jpg" alt="avatar">
          </div>
          <div class="card-body">
            <div class="author">
              <img class="avatar border-gray" src="../assets/img/python-avatar.jpg" alt="...">
              <p class="profile-title">{{ profile.email }}</p>
            </div>
          </div>
          <div class="card-footer">
            <hr>
            <div class="row mb-3" >
              <div class="col-10">
                <h5>Cookie files</h5>
              </div>
              <div class="col-2 text-right">
                <div class="btn-outline-gray btn-icon"
                    @click="uploadCookieOpenDialog()">
                  <i class="nc-icon nc-cloud-upload-94"></i>
                </div>
              </div>
            </div>
            <div class="cookies-list-container">
              <ul class="list-unstyled episode-details">
                <li v-for="cookie in cookies" :key="cookie.id">
                  <div class="row cookie-row">
                    <div class="col-2">
                      <source-type-icon
                          :source-type="cookie.sourceType"
                          :source-label="`Uploaded cookie file for ${cookie.sourceType}`">
                      </source-type-icon>
                    </div>
                    <div class="col-8 cookie-info pl-0">
                      {{cookie.createdAt | date}}
                    </div>
                    <div class="col-2 text-right">
                      <div class="btn-outline-gray btn-icon" @click="deleteCookie(cookie)">
                        <i class="nc-icon nc-simple-remove"></i>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card card-podcast card-user card-user-right-column" id="profile-form-component">
          <div class="card-header card-header-squash">
            <h5 class="card-title" >Profile</h5>
            <div class="header-controls d-block d-sm-none">
              <el-switch
                v-model="showEditOnSmall"
                active-color="rgb(107, 208, 152)"
                inactive-color="rgb(203, 203, 203)"
              >
              </el-switch>
            </div>
          </div>
          <div class="card-body pt-0" :class="{'hide-on-small': !showEditOnSmall}">
            <el-form :model="profileEdit.form" :rules="profileEdit.rules" ref="profileEditForm">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group  text-left">
                    <label>Email (used as login)</label>
                    <el-form-item prop="email" :class="{'is-error': profileEdit.serverErrors.email.length > 0}">
                      <el-input placeholder="Profile Email" v-model="profileEdit.form.email"></el-input>
                      <input-errors :errors="profileEdit.serverErrors.email"></input-errors>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group text-left">
                    <label>Your password (if you need to change it)</label>
                    <el-form-item prop="password_1" :class="{'is-error': profileEdit.serverErrors.password_1.length > 0}">
                      <el-input type="password" placeholder="Password" v-model="profileEdit.form.password_1"></el-input>
                      <input-errors :errors="profileEdit.serverErrors.password_1"></input-errors>
                    </el-form-item>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group text-left">
                    <label>Repeat your password (for changing)</label>
                    <el-form-item prop="password_2" :class="{'is-error': profileEdit.serverErrors.password_2.length > 0}">
                      <el-input type="password" placeholder="Confirm Your Password" v-model="profileEdit.form.password_2"></el-input>
                      <input-errors :errors="profileEdit.serverErrors.password_2"></input-errors>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </el-form>
            <div class="row control-container bottom-controllers">
              <div class="col-md-3 offset-md-9 col-xs-12 text-right">
                <el-button type="info" plain @click="updateProfile" icon="el-icon-edit">
                  Update
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row user-ips-container" v-if="ipAddresses.length > 0">
      <div class="col-12">
        <div class="card">
          <div class="card-header card-header-episodes">
            <h4 class="card-title">Allowed IP Addresses </h4>
          </div>
          <div class="card-body">
            <ul class="list-unstyled team-members">
              <li v-for="ipAddress in ipAddresses" :key="ipAddress.id">
                <div class="row row-episode">
                  <div class="col-10 ip-address-value">
                    <div class="float-left mr-3">
                      {{ipAddress.ip_address}}
                    </div>
                    <div v-if="ipAddress.by_rss_podcast" class="podcast-link-container">
                      (RSS
                      <span @click="goToPodcast(ipAddress.by_rss_podcast.id)"
                            title="Created by downloading RSS for podcast (ex.: server or client that tries to get podcast's RSS)">
                        "{{ ipAddress.by_rss_podcast.name }}"
                      </span>
                      )
                    </div>
                  </div>
                  <div class="col-2 episode-controls">
                      <div
                          class="btn-outline-gray btn-icon"
                          @click="deleteIPAddress(ipAddress)">
                        <i class="nc-icon nc-simple-remove"></i>
                      </div>
                    </div>
                </div>
                <hr class="hr__row-episode">
              </li>
            </ul>
          </div>
          <infinite-loading @infinite="loadMoreIPAddresses" >
            <span slot="no-results"></span>
            <span slot="no-more"></span>
          </infinite-loading>
        </div>
      </div>
    </div>


<!-- UPLOAD COOKIES DIALOG -->
    <el-dialog :title="cookiesUploading.title" :visible.sync="cookiesUploading.dialog">
      <el-form
          ref="cookiesUploadingForm"
          class="cookie-upload-form"
          :model="cookiesUploading.form"
          :rules="cookiesUploading.rules"
      >
        <div class="row">
          <div class="col-md-4 col-xs-12 input-container">
            <el-select
                v-model="cookiesUploading.form.source_type"
                placeholder="Select the source"
                :class="{'is-error': cookiesUploading.serverErrors.source_type.length > 0}"
            >
              <el-option
                v-for="item in cookiesUploading.choices.sourceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <div class="text-left">
                    <source-type-icon
                        :source-type="item.value"
                        :source-label="`Upload cookie file for ${item.label}`"
                        :source-suffix="'green'"
                    >
                    </source-type-icon>
                    {{ item.label }}
                </div>
              </el-option>
            </el-select>
            <input-errors :errors="cookiesUploading.serverErrors.source_type"></input-errors>
          </div>
          <div class="col-md-8 col-xs-12 input-container">
            <div class="el-input">
              <input class="el-input__inner" type="file" @change="onChangeUploadingCookieFile" name="file" accept="text/plain" />
            </div>
            <input-errors :errors="profileEdit.serverErrors.file"></input-errors>
          </div>
        </div>
        <hr class="hr__row-episode">
        <div class="row control-container">
          <div class="col-md-3 offset-md-9 col-xs-12 text-right">
            <el-button type="info" plain @click="submitCookieFormUpload">
              Upload
            </el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
<!-- END DIALOG -->


  </div>

</template>

<script>

import InputErrors from "@/components/InputErrors";
import SourceTypeIcon from "@/components/SourceTypeIcon";
import {fillFormErrors, formIsValid, goToPodcast} from "@/utils/podcast";
import axios from "axios";
import InfiniteLoading from 'vue-infinite-loading';
import app from "@/main";

export default {
  name: "UserProfile",
  components: {InputErrors, SourceTypeIcon, InfiniteLoading},
  data: () => ({
    loading: true,
    profile: null,
    cookies: [],
    ipAddresses: [],
    showEditOnSmall: true,
    profileFormHeight: null,
    rightColStyles: { },
    profileEdit:{
      form: {
        email: '',
        password_1: '',
        password_2: '',
      },
      rules: {
        email: [
          { type: 'email', required: true, trigger: 'blur' },
        ],
        password_1: [
          {message: 'Please input your password', trigger: 'change'},
          {max: 32, message: 'Password should up to 32', trigger: 'blur'}
        ],
        password_2: [
          {message: 'Please repeat your password', trigger: 'change'},
          {max: 32, message: 'Password should up to 32', trigger: 'blur'}
        ],
      },
      serverErrors:{
        email: [],
        password_1: [],
        password_2: [],
      },
    },
    cookiesUploading:{
      dialog: false,
      title: "Uploading new cookie's file",
      fileChosen: false,
      form: {
        source_type: null,
        file: null
      },
      rules: {
        source_type: [
          { required: true, trigger: 'blur' },
        ],
        file: [
          { required: true, trigger: 'blur' },
        ],
      },
      choices: {
        sourceTypes: [
          {
            "label": "Yandex",
            "value": "YANDEX",
          },
          {
            "label": "YouTube",
            "value": "YOUTUBE",
          },
        ],
      },
      serverErrors:{
        source_type: [],
        file: [],
      },
      podcast: null,
      episode: null,
      fileList: [],
    },
  }),
  async created() {
    await this.fetchData()
    this.profileEdit.form.email = this.profile.email;
    this.loading = false;
    this.$store.commit('setBreadcrumbs', [
      {
        "title": "Home",
        "route": {name: "Home"}
      },
      {
        "title": "My Profile",
        "route": null
      },
    ])
  },
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    // changing route calls fetching data
    $route: 'fetchData',
    error(serverErrors){
      fillFormErrors(serverErrors, [
          this.profileEdit.serverErrors,
          this.cookiesUploading.serverErrors,
      ])
    }
  },
  methods: {
    async fetchData() {
      this.profile = await this.$store.dispatch('getMe'); // TODO: use already fetched profile
      this.cookies = await this.$store.dispatch('getCookies');
      this.ipAddresses = await this.getIPAddresses()
    },
    async updateProfile(){
      const formValid = await formIsValid(this, 'profileEditForm')
      if (formValid){
        await this.patchProfile()
      }
    },
    async patchProfile(){
      const response = await axios.patch(`auth/me/`, this.profileEdit.form);
      this.profile = response.data.payload
      let msg;
      if (this.profileEdit.form.password_1.length > 0){
        msg = 'Profile data and password successful updated.'
      } else {
        msg = 'Profile successful updated.'
      }
      this.$message({type: 'success', message: msg});
    },
    async deleteCookie(cookie){
      await axios.delete(`cookies/${cookie.id}/`);
      this.$message({
        type: 'success',
        message: `Cookie file for ${cookie.sourceType} was successful deleted`
      });
      this.cookies = await this.$store.dispatch('getCookies');
    },
    async uploadCookieOpenDialog(){
      this.cookiesUploading.dialog = true
    },
    onChangeUploadingCookieFile(event){
      this.cookiesUploading.form.file = event.target.files[0]
    },
    async getIPAddresses(){
      let ipsResponse = await this.$store.dispatch('getIPAddresses', {offset: 0})
      return ipsResponse.items;
    },
    async submitCookieFormUpload() {
      const formValid = await formIsValid(this, 'cookiesUploadingForm')
      if (formValid){
        const formData = new FormData();
        formData.append("file", this.cookiesUploading.form.file)
        formData.append("source_type", this.cookiesUploading.form.source_type)
        await axios.post(
            `/cookies/`,
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}}
        );
        let msg = `Cookie for the source ${this.cookiesUploading.form.source_type} successful uploaded`
        this.$message({type: 'success', message: msg});
        this.cookies = await this.$store.dispatch('getCookies');
        this.cookiesUploading.dialog = false;
      }
    },
    async deleteIPAddress(ipAddress){
      console.log(`Removing ${ipAddress.ip_address}`)
      if (ipAddress.by_rss_podcast !== null) {
        app.$confirm(`This IP seems like access IP, created by rss-read server. Are you sure?`, 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          cancelButtonClass: 'is-plain',
          type: 'warning',
        }).then(() => {
          axios.post(`auth/ips/delete/`, {"ips": [ipAddress.ip_address]}).then(() => {
            app.$message({type: 'success', message: `IP successful deleted.`});
            this.ipAddresses = this.getIPAddresses()
          })
        });
      } else {
        await axios.post(`auth/ips/delete/`, {"ips": [ipAddress.ip_address]} );
        this.ipAddresses = await this.getIPAddresses()
      }
    },
    async loadMoreIPAddresses($state){
      let ipAddressesResponse = await this.$store.dispatch(
          'getIPAddresses',
          {offset: this.ipAddresses.length}
      )
      this.ipAddresses.push(...ipAddressesResponse.items)
      if (ipAddressesResponse.hasNext){
        $state.loaded();
      } else {
        $state.complete()
      }
    },
    goToPodcast: goToPodcast,
  }
}
</script>

<style lang="scss">
  .card-background{
    img{
      filter: blur(1.5px);
    }
  }
  .card-profile{
    .card-body{
      min-height: initial;
    }
    .avatar{
      margin-bottom: 25px;
    }
    .profile-title{
      color: #7b7979;
      font-weight: bold;
    }
  }
  .control-container{
    margin-top: 30px;
    button{
      width: 100%;
    }
  }
  .cookie-info{
    padding-top: 2px;
  }
  .cookie-row{
    margin-bottom: 10px;
  }
  .cookie-upload-form{
    .input-container{
      margin-bottom: 15px;
      .el-select{
        width: 100%;
      }
    }
  }
  @media screen and (min-width: 768px){
    .card-user-right-column{
        height: 100%;
    }
    .card-user-left-column{
      margin-bottom: 0;
    }
    .bottom-controllers{
      position: absolute;
      right: 20px;
      bottom: 20px;
      width: 100%;
    }
  }
  .user-ips-container{
    margin-top: 20px;
  }
  .podcast-link-container{
    float: left;
    span{
      font-weight: bold;
      cursor: pointer;
    }
  }
</style>