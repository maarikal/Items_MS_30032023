<!-- src/views/SignIn.vue -->
<script>
import {$http} from '../utils/http'
import '../../googleGSI.js'



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
  created() {
    // Google Sign In (GSI) starts here
    window.onload = function () {
      google.accounts.id.initialize({
        client_id: '668250301704-q7j4t8tnkmk88j3d6jsrkujt74311unb.apps.googleusercontent.com',
        callback: handleCredentialResponse
      });
      // Google prompt
      // google.accounts.id.prompt();

      google.accounts.id.renderButton(
          document.getElementById('signInDiv'),
          {
            theme: 'filled_blue',
            size: 'large',
            text: 'long',
            type: 'standard'
          }
      )
    };

    const handleCredentialResponse = (response) => {
      console.log('handleCredentialResponse', response);

      // Send the response to the backend
      $http
          .post('/oAuth2Login', {
            token: response.credential,
          })
          .then((response) => {
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
          .catch((error) => {
            console.error(error);
          });
    };
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
    <div class="h-30">&nbsp;</div>
    <!-- Google Sign In -->
    <div id="signInDiv"></div>
    <div class="h-30">&nbsp;</div>
    <div class="h-30">or sign in with e-mail and password</div>
    <div class="h-30">&nbsp;</div>

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

