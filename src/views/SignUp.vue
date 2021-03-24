<template>
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Sign UP</h4>
      </div>
      <div class="card-body text-center">
        <el-form :model="signUpForm" :rules="rules" ref="signUpForm" class="demo-signUpForm">
          <el-form-item prop="email" :class="{'is-error': serverErrors.email.length > 0}">
            <el-input v-model="signUpForm.email" placeholder="Email"></el-input>
            <div class="el-form-item__error" v-for="error in serverErrors.email" v-bind:key="error">
              {{error}}
            </div>
          </el-form-item>
          <el-form-item prop="password_1">
            <el-input v-model="signUpForm.password_1" placeholder="Password" type="password"></el-input>
            <small class="helper-text" v-for="error in serverErrors.password_1" v-bind:key="error">
              {{error}}
            </small>
          </el-form-item>
          <el-form-item prop="password_2">
            <el-input v-model="signUpForm.password_2" placeholder="Repeat your password" type="password"></el-input>
            <small class="helper-text" v-for="error in serverErrors.password_2" v-bind:key="error">
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

export default {
  name: "SignUp",
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
    this.signUpForm.token = this.$route.query.token || "[UNKNOWN token]"
  },
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(serverError){
      if ( typeof serverError.details === 'object'){
        this.serverErrors = serverError.details
      }
    }
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('signUp', this.signUpForm).then(() => {this.$router.push("/")})
        } else {
          console.log("Form is invalid.")
          return false;
        }
      });
    },
  }
}
</script>
