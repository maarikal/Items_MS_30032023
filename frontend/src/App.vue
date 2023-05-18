

<template>
  <div id="app">
    <nav>
      <router-link v-if="!sessionId" to="/signup">Sign Up</router-link>
      <router-link v-if="!sessionId" to="/signin">Sign In</router-link>
      <router-link v-if="sessionId" to="/items" :id="'listOfItems'">List of Items</router-link>

    </nav>
    <router-view></router-view>
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
    }
  },
};


</script>
