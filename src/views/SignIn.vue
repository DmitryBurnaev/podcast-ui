<template>
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Sign IN</h4>
      </div>
      <div class="card-body">
          <form class="form-signin" method="post" @submit.prevent="submitSignIn" >
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <input
                      type="text" name="email" id="email" placeholder="email" class="form-control"
                      v-model.trim="email"
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
                      type="password" name="password" id="password" placeholder="password" class="form-control"
                      v-model.trim="password"
                      :class="{invalid: ($v.password.$dirty && !$v.password.required ) || ($v.password.$dirty && !$v.password.minLength ) }">
                  <small class="helper-text" v-if="($v.password.$dirty && !$v.password.required )">
                    Password is required field
                  </small>
                  <small class="helper-text" v-else-if="($v.password.$dirty && !$v.password.minLength )">
                    Password must be at least {{$v.password.$params.minLength.min}} chars. Now it is {{password.length}}
                  </small>
                </div>
              </div>
            </div>
            <button class="btn btn-lg btn-primary btn-block mt-4" type="submit">Sign IN</button>
            or <router-link to="/sign-up?token=registration-invite">Sign UP</router-link>
          </form>
      </div>
    </div>
</template>

<script>

import {email, required, minLength} from "vuelidate/lib/validators";
import messages from "@/utils/messages";

export default {
  name: "SignIn",
  data: () => ({
    email: "",
    password: "",
    signInForm: {
      email: "",
      password: ""
    },
  }),
  validations:{
    email: {email, required},
    password: {required, minLength: minLength(2)}
  },
  mounted() {
    let message = messages[this.$route.query.message];
    if (message){
      this.$message("SignIn | " + message)
    }
  },
  methods: {
    async submitSignIn() {
      console.log("SignIn submitting")
      if (this.$v.$invalid){
        this.$v.$touch()
        this.$error("Form is invalid..")
        return
      }
      const formData = {
        email: this.email,
        password: this.password
      }
      let success = await this.$store.dispatch("signIn", formData)
      if (success) {
        await this.$router.push("/")
      }
    }
  }
}
</script>
