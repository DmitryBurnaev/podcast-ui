<template>
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Sign IN</h4>
      </div>
      <div class="card-body text-center">
        <el-form :model="signInForm" :rules="rules" ref="signInForm" class="demo-signInForm">
          <el-form-item prop="email" :class="{'is-error': serverErrors.email.length > 0}">
            <el-input v-model="signInForm.email" placeholder="Email"></el-input>
            <div class="el-form-item__error" v-for="error in serverErrors.email" v-bind:key="error">
              {{error}}
            </div>
          </el-form-item>
          <el-form-item prop="password" :class="{'is-error': serverErrors.password.length > 0}">
            <el-input v-model="signInForm.password" placeholder="Password" type="password"></el-input>
            <small class="el-form-item__error" v-for="error in serverErrors.password" v-bind:key="error">
              {{error}}
            </small>
          </el-form-item>
        </el-form>
        <button class="btn btn-lg btn-primary btn-block mt-4" @click="submitForm('signInForm')">Sign IN</button>
      </div>
    </div>
</template>

<script>

import messages from "@/utils/messages";
import {fillFormErrors, formIsValid} from "@/utils/podcast";

export default {
  name: "SignInView",
  data: () => ({
    signInForm: {
      email: '',
      password: '',
    },
    rules: {
      email: [
        { type: 'email', required: true, trigger: 'blur' },
      ],
      password: [
        {required: true, message: 'This field is required', trigger: 'change'},
        {min: 6, max: 32, message: 'Password should be 6 to 32', trigger: 'blur'}
      ],
    },
    serverErrors: {
      email: [],
      password: [],
    }
  }),
  mounted() {
    let message = messages[this.$route.query.message];
    if (message){
      this.$message("SignIn | " + message)
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
        this.$store.dispatch('signIn', this.signInForm).then(() => {this.$router.push("/")})
      }
    },
  }
}
</script>
