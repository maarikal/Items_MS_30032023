<template>
  <button v-if="sessionId" @click="signOut">Sign Out</button>
  <br>

  <h2>Here are our list of items: </h2>

  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
      <tr>
        <th></th>
        <th>Item</th>
        <th>Description</th>
        <th>Image</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in items" key="item.id">
        <th>{{ index + 1 }}</th>
        <td>{{ item.name }}</td>
        <td>{{ item.description }}</td>
        <td>
          <div class="flex items-center space-x-3">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img :src="item.image" :alt="item.name"/>
              </div>
            </div>
          </div>
        </td>
      </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
import {$http} from "../utils/http";
// get sessionId from localStorage (4c)
const sessionId = localStorage.getItem('sessionId')
console.log('items.vue', sessionId)

// Fetch the items from backend
export default {
  data() {
    return {
      items: [],
      sessionId: sessionId,
    }
  },
  created() {
    $http.get('/items').then(response => {
      this.items = response.body
    })
  },
  // add signOut method
  methods: {
    signOut() {
      // Send a DELETE /sessions request to the backend
      $http.delete('/sessions').then(response => {
        // Remove the sessionId from localStorage (4b)
        localStorage.removeItem('sessionId')

        // Redirect to the intro page
        this.$router.push('/')
      })
    }
  }
}

</script>

<style scoped>

</style>