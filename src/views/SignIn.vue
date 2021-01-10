<template>
  <div class="about">
    <h1>Sign-IN</h1>

    <form class="form-signin" method="post" @submit.prevent="submitSignIn" >
        <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
        <input
            type="text" name="email" id="email"
            v-model.trim="email"
            :class="{invalid: ($v.email.$dirty && !$v.email.required ) || ($v.email.$dirty && !$v.email.email ) }">
        <br/>
        <small class="helper-text" v-if="($v.email.$dirty && !$v.email.required)">
          Email is required field
        </small>
        <small class="helper-text" v-else-if="($v.email.$dirty && !$v.email.email )">
          Email is invalid
        </small>
        <br/>
        <input
            type="password" name="email" id="password"
            v-model.trim="password"
            :class="{invalid: ($v.password.$dirty && !$v.password.required ) || ($v.password.$dirty && !$v.password.minLength ) }">
        <br/>

        <small class="helper-text" v-if="($v.password.$dirty && !$v.password.required )">
          Password is required field
        </small>
        <small class="helper-text" v-else-if="($v.password.$dirty && !$v.password.minLength )">
          Password must be at least {{$v.password.$params.minLength.min}} chars. Now it is {{password.length}}
        </small>
        <br/>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign In</button><br/>
      or <router-link to="/sign-up">sign-up</router-link>
    </form>




  </div>
</template>

<script>

import {email, required, minLength} from "vuelidate/lib/validators";

export default {
  name: "SignIn",
  data: () => ({
    email: "",
    password: "",
  }),
  validations:{
    email: {email, required},
    password: {required, minLength: minLength(8)}
  },
  methods: {
    submitSignIn() {
      console.log("SignIn submitting")
      if (this.$v.$invalid){
        this.$v.$touch()
        console.log("Is invalid..")
        return
      }
      const formData = {
        email: this.email,
        password: this.password
      }
      console.log(formData)
      this.$router.push("/")
    }
  }
}
</script>


<style>
form{
  text-align: center;
}
.invalid{
  background-color: red;
}

</style>