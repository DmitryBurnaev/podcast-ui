<template>
    <div class="card"  v-if="signUpForm.email">
      <div class="card-header">
        <h4 class="card-title">Sign UP</h4>
      </div>
      <div class="card-body text-center">
        <el-form :model="signUpForm" :rules="rules" ref="signUpForm" class="demo-signUpForm">
          <el-form-item prop="email" :class="{'is-error': serverErrors.email.length > 0}">
            <el-input v-model="signUpForm.email" placeholder="Email" disabled></el-input>
            <div class="el-form-item__error" v-for="error in serverErrors.email" v-bind:key="error">
              {{error}}
            </div>
          </el-form-item>
          <el-form-item prop="password_1" :class="{'is-error': serverErrors.password_1.length > 0}">
            <el-input v-model="signUpForm.password_1" placeholder="Password" type="password"></el-input>
            <small class="el-form-item__error" v-for="error in serverErrors.password_1" v-bind:key="error">
              {{error}}
            </small>
          </el-form-item>
          <el-form-item prop="password_2" :class="{'is-error': serverErrors.password_2.length > 0}">
            <el-input v-model="signUpForm.password_2" placeholder="Repeat your password" type="password"></el-input>
            <small class="el-form-item__error" v-for="error in serverErrors.password_2" v-bind:key="error">
              {{error}}
            </small>
          </el-form-item>
        </el-form>

        <button class="btn btn-lg btn-primary btn-block mt-4" @click="submitForm('signUpForm')">Sign UP</button>
        or <router-link to="/sign-in">Sign IN</router-link>

      </div>
    </div>
</template>

<script>

import {fillFormErrors, formIsValid} from "@/utils/podcast";

export default {
  name: "SignUpView",
  data: () => ({
    signUpForm: {
      email: '',
      password_1: '',
      password_2: '',
      token: '',
    },
    rules: {
      email: [
        { type: 'email', required: true, trigger: 'blur' },
      ],
      password_1: [
        {required: true, message: 'Please input your password', trigger: 'change'},
        {min: 6, max: 32, message: 'Password should be 6 to 32', trigger: 'blur'}
      ],
      password_2: [
        {required: true, message: 'Please repeat your password', trigger: 'change'},
        {min: 6, max: 32, message: 'Password should be 6 to 32', trigger: 'blur'}
      ],
    },
    serverErrors: {
      email: [],
      password_1: [],
      password_2: [],
    }
  }),
  mounted() {
    let inviteData = {}
    let token = this.$route.query.i || 'unknown-token'

    try {
      inviteData = JSON.parse(atob(token))
    } catch (e){
      console.error(`Couldn't parse invite data. i=${token}`)
      this.$message({
          message: 'Sorry... Your invitation link seems incorrect.',
          type: 'error',
          duration: 0
      })
    }
    if (inviteData){
      this.signUpForm.token = inviteData.token
      this.signUpForm.email = inviteData.email
    }
  },
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(serverErrors){
      fillFormErrors(serverErrors, [this.serverErrors])
    }
  },
  methods: {
    async submitForm(formName) {
      const valid = await formIsValid(this, formName)
      if (valid){
        this.$store.dispatch('signUp', this.signUpForm).then(() => {this.$router.push("/")})
      }
    },
  }
}
</script>
