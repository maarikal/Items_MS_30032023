<!-- src/views/SignUp.vue -->
<script>
import {$http} from '../utils/http'


export default {
  data() {
    return {
      signUpEmail: '',
      signUpPassword: '',
      emailCheckResult: ''
    }
  },
  methods: {
    signUp() {

      // Send a POST request to the backend
      $http.post('/users', {
        email: this.signUpEmail,
        password: this.signUpPassword
      }).then(response => {
        // Redirect to sign-in page
        this.$router.push('/signin')
      })
    },
    checkEmail() {

      // If the email is empty, don't send a request
      if (!this.signUpEmail) {
        this.emailCheckResult = ''
        return
      }

      // Send a POST /users/check-email request to the backend
      $http.post('/users/check-email', {
        email: this.signUpEmail
      }, {disableErrorHandling: true}).then(response => {
        this.emailCheckResult = '';
      }).catch(response => {
        this.emailCheckResult = response.body.error;
      })
    }
  }
}
</script>

<template>
  <div>
    <h1>Sign Up</h1>

    <!-- Email -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Email</span>
      </label>
      <input type="text" name="email" placeholder="Type here" class="input input-bordered w-full max-w-xs"
             v-on:blur="checkEmail"
             v-model="signUpEmail"/>
      <label class="label">
        <!-- Show red text if the email is already taken -->
        <span class="label-text-alt text-red-600" id="email-error"
              :class="{ invisible: emailCheckResult.length === 0 }">
          {{ emailCheckResult }}.
        </span>
      </label>
    </div>

    <!-- Password -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Password</span>
      </label>
      <input type="password" name="password" placeholder="Type here" class="input input-bordered w-full max-w-xs"
             v-model="signUpPassword"/>
      <label class="label">
        <!-- Show red text if the password is too short -->
        <span class="label-text-alt text-red-600" id="password-error"
              :class="{ invisible: !(signUpPassword.length > 0 && signUpPassword.length < 8) }">Password must be at least 8 characters long</span>
      </label>
    </div>
  </div>
  <div class="h-30">&nbsp;</div>
  <button id="sign-up" class="btn btn-primary" @click="signUp" data-cy="signUp">Sign Up</button>
</template>


<style>
.invisible {
  visibility: hidden;
}
</style>
