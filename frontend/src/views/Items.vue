<template>
  <button class="btn btn-primary" v-if="sessionId" @click="signOut" id="sign-out-button">Sign Out</button>
  <br>
  <h2>Here are our list of items: </h2>
  <button class="btn btn-primary" @click="addItemButton">Add Item</button>
  <br>
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
      <tr>
        <th></th>
        <th>Item</th>
        <th>Description</th>
        <th>Image</th>
        <th></th>
        <th></th>
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
        <td>
          <button class="btn btn-primary" @click="getRefilledForm(item.id, item.name, item.description, item.image)"
                  id="edit">
            Edit
          </button>
        </td>
        <td>
          <button id="delete-item" class="btn btn-primary" @click="deleteItem(item.id)">
            Delete
          </button>
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
console.log('Items.vue', sessionId)

// Fetch the items from backend
export default {
  data() {
    return {
      items: [],
      name: '',
      description: '',
      image: '',
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
    },
    // Add addItem method
    addItemButton() {
      // Redirect to the modify page
      this.$router.push('/modify')
    },
    // add getRefilledForm method with data for the form fields and push to modify page
    getRefilledForm(id, name, description, image) {
      $http.get(`/items?id=${id}&name=${name}&description=${description}&image=${image}`).then(response => {
        this.$router.push({path: '/modify', query: {id: id, name: name, description: description, image: image}})
      })
    },
    // add deleteItem method
    deleteItem(id) {
      // add confirm for delete
      if (confirm('Are you sure you want to delete this item?')) {
        // Send a DELETE /items request to the backend
        $http.delete(`/items?id=${id}`).then(response => {
          // Redirect to list of items page
          this.$router.push('/items')
        })
      }
    }
  }
}

</script>

<style scoped>
</style>