<template>
  <div>
    <h2>Log-file</h2>
    <br>
    <table class="table table-zebra table-compact">
      <thead>
      <tr>
        <th></th>
        <th>Item</th>
        <th>Action</th>
        <th>Timestamp</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(data, index) in data" key="data.id">
        <td>{{ index + 1 }}</td>
        <td>{{ data.item }}</td>
        <td>{{ data }}</td>
        <td> {{}}</td>
      </tr>
      </tbody>
    </table>
  </div>


</template>

<script>
import {$http} from '../utils/http'
// get info, action and timestamp from backend from log-file
export default {
  data() {
    return {
      info: '',
      level: 'info',
      message: '',
      action: '',
      timestamp: '',
      item: '',
    }
  },

  methods: {
    async getLog() {
      const response = await $http.get('/logs', {})
      // get all data from log.file from backend
      this.data = response.body.data
      // give me level entries from log.file from backend
      console.log('Log.vue', response.body.data)
    },
  },
  mounted() {
    this.getLog()
  },
}

</script>

<style scoped>

</style>