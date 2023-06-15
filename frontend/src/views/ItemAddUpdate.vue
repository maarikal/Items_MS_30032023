<!-- src/views/ItemAddUpdate.vue -->
<script>
import {$http} from '../utils/http'


export default {
  created() {
    const name = this.$route.query.name;
    const description = this.$route.query.description;
    const image = this.$route.query.image;
    this.name = name;
    this.description = description;
    this.image = image;
  },
  data() {
    return {
      name: '',
      description: '',
      image: ''
    }
  },
  methods: {
    // send a POST request to the backend
    addItem() {
      $http.post('/items', {
        name: this.name,
        description: this.description,
        image: this.image
      }).then(response => {
        // Redirect to list of items page
        this.$router.push('/items')
      })
    },
    // send a PATCH request to the backend using query string filling the form
    updateItem() {
      $http.patch(`/items?id=${this.$route.query.id}`, {
        name: this.name,
        description: this.description,
        image: this.image
      }).then(response => {
        // Redirect to list of items page
        this.$router.push('/items')
      })
      console.log("uuendatud", this.$route.query.id)
    }
  }
}

</script>

<template>
  <div>
    <h1>{{ $route.query.id ? 'Modify' : 'Add' }} Item</h1>
    <div class="h-30">&nbsp;</div>
    <!-- Name -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Name</span>
      </label>
      <input type="text" name="name" placeholder="Name" class="input input-bordered w-full max-w-xs"
             v-model="name"/>
      <label class="label">
      </label>
    </div>
    <!-- Description -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Description</span>
      </label>
      <input type="text" name="description" placeholder="Description" class="input input-bordered w-full max-w-xs"
             v-model="description"/>
      <label class="label">
      </label>
    </div>
    <!-- Image -->
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">Image</span>
      </label>
      <input type="text" name="image" placeholder="Image url" class="input input-bordered w-full max-w-xs"
             v-model="image"/>
      <label class="label">
      </label>
    </div>
    <div class="h-30">&nbsp;</div>
    <!--    // Check if query is present and show the Modify button else show the Save button-->
    <button id="update-item" class="btn btn-primary" v-if="$route.query.id" @click="updateItem" data-cy="updateItem">
      Save
    </button>
    <button id="add-item" class="btn btn-primary" v-else @click="addItem" data-cy="addItem">Save</button>
  </div>

</template>