<template>
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Sign UP</h4>
      </div>
      <div class="card-body text-center">
        <el-form :model="signUpForm" :rules="rules" ref="signUpForm" class="demo-signUpForm">
          <el-form-item prop="email">
            <el-input v-model="signUpForm.email" placeholder="Email"></el-input>
          </el-form-item>
          <el-form-item prop="password_1">
            <el-input v-model="signUpForm.password_1" placeholder="Password"></el-input>
          </el-form-item>
          <el-form-item prop="password_2">
            <el-input v-model="signUpForm.password_2" placeholder="Repeat your password"></el-input>
          </el-form-item>
        </el-form>

          <button class="btn btn-lg btn-primary btn-block mt-4" @click="submitForm('signUpForm')">Sign UP</button>
          or <router-link to="/sign-in">Sign IN</router-link>





<!--        <form class="form-signup" method="post" @submit.prevent="submitSignUp" >-->
<!--          <div class="form-group">-->
<!--            <input-->
<!--                type="text" name="email" id="email" placeholder="email"-->
<!--                v-model.trim="email" class="form-control"-->
<!--                :class="{invalid: ($v.email.$dirty && !$v.email.required ) || ($v.email.$dirty && !$v.email.email ) }">-->
<!--            <small class="helper-text" v-if="($v.email.$dirty && !$v.email.required)">-->
<!--              Email is required field-->
<!--            </small>-->
<!--            <small class="helper-text" v-else-if="($v.email.$dirty && !$v.email.email )">-->
<!--              Email is invalid-->
<!--            </small>-->
<!--          </div>-->

<!--          <div class="form-group">-->
<!--            <input-->
<!--                type="password" name="email" id="password_1" placeholder="password"-->
<!--                v-model.trim="password_1" class="form-control"-->
<!--                :class="{invalid: ($v.password_1.$dirty && !$v.password_1.required ) || ($v.password_1.$dirty && !$v.password_1.minLength ) }">-->
<!--            <small class="helper-text" v-if="($v.password_1.$dirty && !$v.password_1.required )">-->
<!--              Password is required field-->
<!--            </small>-->
<!--            <small class="helper-text" v-else-if="($v.password_1.$dirty && !$v.password_1.minLength )">-->
<!--              Password must be at least {{$v.password_1.$params.minLength.min}} chars. Now it is {{password_1.length}}-->
<!--            </small>-->
<!--          </div>-->

<!--          <div class="form-group">-->
<!--            <input-->
<!--                type="password" name="email" id="password_2"-->
<!--                placeholder="Repeat your password"-->
<!--                v-model.trim="password_2" class="form-control"-->
<!--                :class="{invalid: ($v.password_2.$dirty && !$v.password_2.required ) || ($v.password_2.$dirty && !$v.password_2.minLength ) }">-->
<!--            <small class="helper-text" v-if="($v.password_2.$dirty && !$v.password_2.required )">-->
<!--              Password is required field-->
<!--            </small>-->
<!--            <small class="helper-text" v-else-if="($v.password_2.$dirty && !$v.password_2.minLength )">-->
<!--              Password must be at least {{$v.password_2.$params.minLength.min}} chars. Now it is {{password_2.length}}-->
<!--            </small>-->
<!--          </div>-->
<!--          <button class="btn btn-lg btn-primary btn-block mt-4" type="submit">Sign UP</button>-->
<!--          or <router-link to="/sign-in">Sign IN</router-link>-->
<!--        </form>-->
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
        {required: true, message: 'Please input your email', trigger: 'blur'},
        {min: 3, max: 5, message: 'Email should be 3 to 5', trigger: 'blur'},
        // TODO: ADD email validation here
      ],
      password_1: [
        {required: true, message: 'Please input your password', trigger: 'change'},
        {min: 6, max: 32, message: 'Password should be 6 to 32', trigger: 'blur'}
      ],
      password_2: [
        {required: true, message: 'Please repeat your password', trigger: 'change'},
        {min: 6, max: 32, message: 'Password should be 6 to 32', trigger: 'blur'}
      ],
    }
  }),
  mounted() {
    this.token = this.$route.query.token || "[UNKNOWN token]"
    console.log("invite token", this.token)
  },
  methods: {
    // async submitSignUp() {
    //   console.log("SignUp submitting")
    //   if (this.$v.$invalid) {
    //     this.$v.$touch()
    //     console.log("Is invalid..")
    //     return
    //   }
    //   console.log(this.formData)
    //   let success = await this.$store.dispatch('signUp', this.formData)
    //   if (success) {
    //     await this.$router.push("/")
    //   }
    // },
    async submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("Form is valid")
          // todo: fix sending!
          // this.$store.dispatch('signUp', this.formData).then(() => {this.$router.push("/")})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
