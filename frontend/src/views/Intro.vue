<script>
export default {
  created() {
    console.log("Intro.vue created");
  }
}
</script>
<template>
  <div>
    <br>
    <h1>Items intro page</h1>
    <br>


    <br>
    <p>If you want to see list of items or add/delete items, please
      <router-link to="/signup">Sign Up</router-link>
      or
      <router-link to="/signin">Sign In</router-link>
    </p>

  </div>
</template>
