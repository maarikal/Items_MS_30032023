

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
import { mapState, mapActions } from 'vuex';
import store from "./store/itemsStore.js";

// get sessionId from localStorage (4c)
const sessionId = localStorage.getItem('sessionId')


export default {
  name: 'App',
  data() {
    return {
      sessionId: sessionId,
      loggedIn: sessionId ? true : false,
      // for ws functionality
      wss: null,
      socket: {},
      message: this.message,
    }
  },
  computed: {
    ...mapState(['itemList']),
    newItem: '',
  },
  created() {
    this.checkLoggedIn()
    //console.log('App.vue, loggedIn: ', this.loggedIn)
    //console.log('Problm araises when another view is mounted after user action. loggedIn has to be updated before new view is mounted. So the created() has to be used. But used emit instead')

  },
  async mounted() {
    // Define socket and attach it to our data object
    this.socket = await new WebSocket('wss://localhost:3000/ws');

    // When it opens, console log that it has opened. and send a message to the server to let it know we exist
    this.socket.onopen = () => {
      console.log('Websocket connected.');
      this.sendMessage(JSON.stringify({"message" : "Hello, server."}));
    }

    // When we receive a message from the server, we can capture it here in the onmessage event.
    this.socket.onmessage = (event) => {
      console.log('Received WebSocket message:', event.data);
      // We can parse the data we know to be JSON, and then check it for data attributes
      let parsedMessage = JSON.parse(event.data);
      // If those data attributes exist, we can then console log or show data to the user on their web page.
      //console.log(parsedMessage);
      if(typeof parsedMessage.message !== "undefined") {
        this.message = parsedMessage.message;
        console.log('We have received a message from the server!')
      }

      // Handle ws message type 'addItem'
      const data = JSON.parse(event.data);
      //console.log('Parsed WebSocket data:', data);
      if (data.type === 'addItem') {
        console.log('Received WebSocket message type "addItem"');
        // Add the new item to dom
        this.addItem(data.item);
      } else if (data.type === 'deleteItem') {
        console.log('Received WebSocket message type "deleteItem"');
        // Delete the item from dom
        this.deleteItemFromStore(data.id);
      } else if (data.type === 'updateItem') {
        console.log('Received WebSocket message type "updateItem"');
        // Update the item in dom
        this.updateItemInStore(data.item);
      }
    }
  },
  methods: {
    ...mapActions(['addItem', 'deleteItemFromStore', 'updateItemInStore']),
    addItemToList() {
      this.addItem(this.newItem); // Invoke the addItem action with the new item
      this.newItem = ''; // Clear the input field after adding the item
    },
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
    },
    // ws support starts here
    waitForOpenConnection: function() {
      // We use this to measure how many times we have tried to connect to the websocket server
      // If it fails, it throws an error.
      return new Promise((resolve, reject) => {
        const maxNumberOfAttempts = 10
        const intervalTime = 200

        let currentAttempt = 0
        const interval = setInterval(() => {
          if (currentAttempt > maxNumberOfAttempts - 1) {
            clearInterval(interval)
            reject(new Error('Maximum number of attempts exceeded.'));
          } else if (this.socket.readyState === this.socket.OPEN) {
            clearInterval(interval)
            resolve()
          }
          currentAttempt++
        }, intervalTime)
      })
    },
    sendMessage: async function(message) {
      // We use a custom send message function, so that we can maintain reliable connection with the
      // websocket server.
      if (this.socket.readyState !== this.socket.OPEN) {
        try {
          await this.waitForOpenConnection(this.socket)
          this.socket.send(message)
        } catch (err) { console.error(err) }
      } else {
        this.socket.send(message)
      }
    }
    // ws support ends here
  }
};


</script>
