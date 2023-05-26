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
      <tr v-for="(item, index) in item" key="item.id">
        <td>{{ index + 1 }}</td>
        <td>{{ item.info }}</td>
        <td>{{ action }}</td>
        <td> {{ timestamp }}</td>
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
      item: '',
      action: '',
      timestamp: '',
    }
  },
  methods: {
    async getLog() {
      const response = await $http.get('/logs', {})
      this.item = response.data
    },
  },
  mounted() {
    this.getLog()
  },
}

</script>

<style scoped>

</style>