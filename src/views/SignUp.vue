<template>
  <div class="about">
    <h1>Sign-UP</h1>

    <form class="form-signin" method="post" @submit.prevent="submitSignUp" >
        <input
            type="text" name="email" id="email" placeholder="email"
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
            type="password" name="email" id="password_1" placeholder="password"
            v-model.trim="password_1"
            :class="{invalid: ($v.password_1.$dirty && !$v.password_1.required ) || ($v.password_1.$dirty && !$v.password_1.minLength ) }">
        <br/>

        <small class="helper-text" v-if="($v.password_1.$dirty && !$v.password_1.required )">
          Password is required field
        </small>
        <small class="helper-text" v-else-if="($v.password_1.$dirty && !$v.password_1.minLength )">
          Password must be at least {{$v.password_1.$params.minLength.min}} chars. Now it is {{password_1.length}}
        </small>

        <br/>
        <input
            type="password" name="email" id="password_2"
            placeholder="Repeat your password"
            v-model.trim="password_2"
            :class="{invalid: ($v.password_2.$dirty && !$v.password_2.required ) || ($v.password_2.$dirty && !$v.password_2.minLength ) }">
        <br/>

        <small class="helper-text" v-if="($v.password_2.$dirty && !$v.password_2.required )">
          Password is required field
        </small>
        <small class="helper-text" v-else-if="($v.password_2.$dirty && !$v.password_2.minLength )">
          Password must be at least {{$v.password_2.$params.minLength.min}} chars. Now it is {{password_2.length}}
        </small>
        <br/>


        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign UP</button><br/>
        or <router-link to="/sign-in">sign-in</router-link>
    </form>

  </div>
</template>

<script>

import {email, required, minLength} from "vuelidate/lib/validators";

export default {
  name: "SignIn",
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
  methods: {
    submitSignUp() {
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