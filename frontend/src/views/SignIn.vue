<!-- src/views/SignIn.vue -->
<script>
import {$http} from '../utils/http'

export default {
  // If the listener is intended to be a component custom event listener only, declare it using the "emits" option.
  emits: ['loggedInChange'], // Declare the emitted event
  data() {
    return {
      signInEmail: '',
      signInPassword: '',
      sessionId: '',
    }
  },
  methods: {
    signIn() {

      // Send a POST request to the backend
      $http.post('/sessions', {
        email: this.signInEmail,
        password: this.signInPassword
      }).then(response => {
        // Save to localStorage (4a)
        const sessionId = response.body.sessionId
        localStorage.setItem('sessionId', sessionId)
        console.log('signIn.vue', sessionId)

        // Share loggedIn state with parent component
        // Set the loggedIn property to true
        this.loggedIn = true
        // Emit the 'loggedInChange' event to notify the parent component
        this.$emit('loggedInChange', this.loggedIn)

        // Redirect to list of items page
        this.$router.push('/items')
      })
    },
  }
}
</script>

<template>
  <div>
    <h1>Sign In</h1>

    <!-- Email -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Email</span>
      </label>
      <input type="text" name="email" placeholder="Type here" class="input input-bordered w-full max-w-xs"
             v-model="signInEmail"/>
      <label class="label">
      </label>
    </div>

    <!-- Password -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Password</span>
      </label>
      <input type="password" name="password" placeholder="Type here" class="input input-bordered w-full max-w-xs"
             v-model="signInPassword"/>
      <label class="label">
        <!-- Show red text if the password is too short -->
        <span class="label-text-alt text-red-600" id="password-error"
              :class="{ invisible: !(signInPassword.length > 0 && signInPassword.length < 8) }">Password must be at least 8 characters long</span>
      </label>
    </div>
  </div>
  <div class="h-30">&nbsp;</div>
  <button id="sign-in" class="btn btn-primary" @click="signIn">Sign In</button>
</template>


<style>
.invisible {
  visibility: hidden;
}
</style>

