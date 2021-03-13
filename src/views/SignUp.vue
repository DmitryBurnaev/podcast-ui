<template>
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Sign UP</h4>
      </div>
      <div class="card-body">
        <form class="form-signup" method="post" @submit.prevent="submitSignUp" >
          <div class="form-group">
            <input
                type="text" name="email" id="email" placeholder="email"
                v-model.trim="email" class="form-control"
                :class="{invalid: ($v.email.$dirty && !$v.email.required ) || ($v.email.$dirty && !$v.email.email ) }">
            <small class="helper-text" v-if="($v.email.$dirty && !$v.email.required)">
              Email is required field
            </small>
            <small class="helper-text" v-else-if="($v.email.$dirty && !$v.email.email )">
              Email is invalid
            </small>
          </div>

          <div class="form-group">
            <input
                type="password" name="email" id="password_1" placeholder="password"
                v-model.trim="password_1" class="form-control"
                :class="{invalid: ($v.password_1.$dirty && !$v.password_1.required ) || ($v.password_1.$dirty && !$v.password_1.minLength ) }">
            <small class="helper-text" v-if="($v.password_1.$dirty && !$v.password_1.required )">
              Password is required field
            </small>
            <small class="helper-text" v-else-if="($v.password_1.$dirty && !$v.password_1.minLength )">
              Password must be at least {{$v.password_1.$params.minLength.min}} chars. Now it is {{password_1.length}}
            </small>
          </div>

          <div class="form-group">
            <input
                type="password" name="email" id="password_2"
                placeholder="Repeat your password"
                v-model.trim="password_2" class="form-control"
                :class="{invalid: ($v.password_2.$dirty && !$v.password_2.required ) || ($v.password_2.$dirty && !$v.password_2.minLength ) }">
            <small class="helper-text" v-if="($v.password_2.$dirty && !$v.password_2.required )">
              Password is required field
            </small>
            <small class="helper-text" v-else-if="($v.password_2.$dirty && !$v.password_2.minLength )">
              Password must be at least {{$v.password_2.$params.minLength.min}} chars. Now it is {{password_2.length}}
            </small>
          </div>
          <button class="btn btn-lg btn-primary btn-block mt-4" type="submit">Sign UP</button>
          or <router-link to="/sign-in">Sign IN</router-link>
        </form>
      </div>
    </div>
</template>

<script>

import {email, required, minLength} from "vuelidate/lib/validators";

export default {
  name: "SignUp",
  data: () => ({
    email: "",
    password_1: "",
    password_2: "",
    token: "",
  }),
  validations:{
    email: {email, required},
    password_1: {required, minLength: minLength(2)},
    password_2: {required, minLength: minLength(2)},
  },
  mounted() {
    this.token = this.$route.query.token || "[UNKNOWN token]"
    console.log(this.token)
  },
  methods: {
    async submitSignUp() {
      console.log("SignUp submitting")
      if (this.$v.$invalid){
        this.$v.$touch()
        console.log("Is invalid..")
        return
      }
      const formData = {
        email: this.email,
        password_1: this.password_2,
        password_2: this.password_2,
        token: this.token,
      }
      console.log(formData)
      let success = await this.$store.dispatch('signUp', formData)
      if (success) {
        await this.$router.push("/")
      }
    }
  }
}
</script>
