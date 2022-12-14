<template>
  <div class="content" v-if="!loading" ref="myContent">
    <div class="row">
      <div class="col-md-4">
        <div class="card card-profile card-user" :style="leftColStyles">
          <div class="image card-background" >
            <img src="../assets/img/podcast-background.jpg" alt="avatar">
          </div>
          <div class="card-body">
            <div class="author">
              <img class="avatar avatar-episode border-gray" src="../assets/img/python-avatar.jpg" alt="...">
              <p class="profile-title">{{ profile.email }}</p>
            </div>
          </div>
          <div class="card-footer">
            <hr>
            <div class="button-container">
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card card-podcast card-user" id="profile-form-component" ref="profileFormComponent">
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
                    <el-form-item prop="password_1" :class="{'is-error': profileEdit.serverErrors.password_1.length > 0}">
                      <el-input placeholder="Password" v-model="profileEdit.form.password_1"></el-input>
                      <input-errors :errors="profileEdit.serverErrors.password_1"></input-errors>
                    </el-form-item>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group text-left">
                    <el-form-item prop="password_2" :class="{'is-error': profileEdit.serverErrors.password_2.length > 0}">
                      <el-input placeholder="Confirm Your Password" v-model="profileEdit.form.password_2"></el-input>
                      <input-errors :errors="profileEdit.serverErrors.password_2"></input-errors>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="row control-container">
                <div class="col-md-3 offset-md-9 col-xs-12 text-right">
                  <el-button type="info" plain @click="updateProfile" icon="el-icon-edit" :disabled="profileEdit.hasChanges">
                    Update
                  </el-button>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import InputErrors from "@/components/InputErrors";
import {fillFormErrors, formIsValid} from "@/utils/podcast";
import axios from "axios";


export default {
  name: "ProfilePage",
  components: {InputErrors},
  data: () => ({
    loading: true,
    profile: null,
    showEditOnSmall: true,
    profileFormHeight: null,
    leftColStyles: { },
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
          {required: true, message: 'Please input your password', trigger: 'change'},
          {max: 32, message: 'Password should up to 32', trigger: 'blur'}
        ],
        password_2: [
          {required: true, message: 'Please repeat your password', trigger: 'change'},
          {max: 32, message: 'Password should up to 32', trigger: 'blur'}
        ],
      },
      serverErrors:{
        email: [],
        password_1: [],
        password_2: [],
      },
      hasChanges: false,
      inProgress: false,
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
  mounted() {
    setTimeout(() => {this.matchHeight()}, 100)
  },
  destroyed() {
  },
  watch: {
    // changing route calls fetching data
    $route: 'fetchData',
    error(serverErrors){
      fillFormErrors(serverErrors, [
          this.profileEdit.form.serverErrors,
      ])
    }
  },
  methods: {
    async fetchData() {
      this.profile = await this.$store.dispatch('getMe'); // TODO: use already fetched profile
    },
    async updateProfile(){
      const valid = await formIsValid(this, 'profileEditForm')
      if (valid){
        if (this.profileEdit.form.password_1.length > 0){
          await this.changePassword()
        } else {
          await this.patchProfile()
        }
      }
    },
    async patchProfile(){
        const response = await axios.patch(`auth/me/`, this.profileEdit.form);
        this.profile = response.data.payload
        this.$message({type: 'success', message: 'Profile successful updated.'});
    },
    async changePassword(){
        await axios.post(`auth/change-password/`, this.profileEdit.form);
        this.$message({type: 'success', message: 'Password successful updated.'});
    },
    matchHeight () {
      let heightString = this.$refs.profileFormComponent.clientHeight + 'px';
      this.leftColStyles = {'height': heightString}
    }
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
</style>