

<template>
  <div id="app">
    <nav>
      <router-link v-if="!loggedIn" to="/signup">Sign Up</router-link>
      <router-link v-if="!loggedIn" to="/signin">Sign In</router-link>
      <router-link v-if="loggedIn" to="/items" :id="'listOfItems'">List of Items</router-link>
      <a v-if="loggedIn" href="#" @click="logout">Sign Out</a>

    </nav>
    <router-view @loggedInChange="handleLoggedInChange" />
  </div>
</template>

<style scoped>

</style>

<script>
// get sessionId from localStorage (4c)
const sessionId = localStorage.getItem('sessionId')

export default {
  name: 'App',
  data() {
    return {
      sessionId: sessionId,
      loggedIn: sessionId ? true : false,
    }
  },
  created() {
    this.checkLoggedIn()
    console.log('App.vue, loggedIn: ', this.loggedIn)
    console.log('Problm araises when another view is mounted after user action. loggedIn has to be updated before new view is mounted. So the created() has to be used. But used emit instead')
  },
  methods: {
    handleLoggedInChange(loggedIn) {
      this.loggedIn = loggedIn;

      // Trigger re-mounting of the parent component
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    checkLoggedIn() {
      const sessionId = localStorage.getItem('sessionId')
      if (sessionId) {
        // Check with server to validate session
        // If valid, set loggedIn to true
        this.loggedIn = true
      }
    },
    logout() {
      localStorage.removeItem('sessionId')
      this.loggedIn = false
      this.$router.push('/')
    }
  }
};

</script>
