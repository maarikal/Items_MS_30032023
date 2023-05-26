<template>
  <br>
  <h2>Here is our list of items: </h2>
  <button class="btn btn-primary btn-wide " @click="addItemButton" data-cy="addItem">Add Item</button>
  <div>
    <table class="table table-zebra table-compact">
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
      <tr v-for="(item, index) in itemList" key="item.id">
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
          <button id="delete-item" class="btn btn-primary" @click="deleteItem(item.id)" data-cy="delete">
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
import {mapState, mapActions} from 'vuex';
import store from "../store/itemsStore.js";

// get sessionId from localStorage (4c)
const sessionId = localStorage.getItem('sessionId')

// Fetch the items from backend
export default {
  data() {
    return {
      name: '',
      description: '',
      image: '',
      sessionId: sessionId,
    }
  },
  computed: {
    ...mapState(['itemList']),
    newItem: '',
  },
  created() {
    $http.get('/items', {}).then(response => {
      // Dispatch the deleteStore action
      store.dispatch('deleteStore');
      response.body.forEach(item => {
        this.addItem(item); // Dispatch the addItem action for each item
      });
    })
    this.checkLoggedIn()
  },
  methods: {
    ...mapActions(['addItem', 'deleteItemFromStore', 'updateItemInStore']),
    addItemToList() {
      this.addItem(this.newItem); // Invoke the addItem action with the new item
      this.newItem = ''; // Clear the input field after adding the item
    },
    // Add checkLoggedIn method
    checkLoggedIn() {
      const sessionId = localStorage.getItem('sessionId')
      if (sessionId) {
        // Check with server to validate session
        // If valid, set loggedIn to true
        this.loggedIn = true
      } else {
        // If not signed in, alert (HTTP) 401 Unauthorized
        alert('You are not signed in (HTTP) 401 Unauthorized')

        // If not signed in, redirect to intro page
        this.$router.push('/')
        this.loggedIn = false
      }
      return this.loggedIn
    },
    // Add addItem method
    addItemButton() {
      // Redirect to the modify page
      this.$router.push('/modify')
    },
    // add getRefilledForm method with data for the form fields and push to modify page
    getRefilledForm(id, name, description, image) {
      $http.get(`/items?id=${id}&name=${name}&description=${description}&image=${image}`, {}).then(response => {
        this.updateItemInStore(response.body); // Invoke the 'updateItemInStore' action with the updated item data
        this.$router.push({path: '/modify', query: {id: id, name: name, description: description, image: image}})
      })
    },
    // add deleteItem method
    deleteItem(id) {
      // add confirm for delete
      if (confirm('Are you sure you want to delete this item?')) {
        // Send a DELETE /items request to the backend
        $http.delete(`/items?id=${id}`).then(response => {
          if (response.ok) {
            // Refresh the list of items
            $http.get('/items', {}).then(response => {
              console.log(response)
              if (response.ok) {
                console.log('Item deleted')
                store.dispatch('deleteItemFromStore', {itemId: id});
              }
            })
          }
        })
      }
    }
  }
}

</script>

<style scoped>
</style>