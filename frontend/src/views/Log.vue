<template>
  <div>
    <h2>Log-file</h2>
    <br>
    <table class="table table-zebra table-compact">
      <thead>
      <tr>
        <th></th>
        <th>Action</th>
        <th>Timestamp</th>
        <th>Name</th>

      </tr>
      </thead>
      <tbody>
      <tr v-for="(log, index) in logs" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ log.message }}</td>
        <td>{{ log.timestamp }}</td>
        <td>{{ log.item || log.user }}</td>

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
      message: '',
      action: '',
      timestamp: '',
      item: '',
      logs: [],
      data: [],
      user: '',
    }
  },

  methods: {
    async getLog() {
      const response = await $http.get('/logs', {})
      this.logs = response.body.logs
    },
  },
  mounted() {
    this.getLog()
  },
}

</script>

<style scoped>

</style>