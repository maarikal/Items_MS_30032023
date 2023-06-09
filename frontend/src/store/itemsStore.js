import {createApp} from 'vue';
import {createStore} from 'vuex';

const app = createApp({});
const store = createStore({
    state: {
        itemList: [],
        loggedIn: false,
    },
    mutations: {
        addItem(state, item) {
            state.itemList.push(item);
        },
        deleteStore(state) {
            // Reset the state and mutations
            state.itemList = [];
            Object.keys(this._mutations).forEach((mutation) => {
                delete this._mutations[mutation];
            });

            // Unregister the store module
            this.unregisterModule([]);
        },
        deleteItemFromStore(state, itemId) {
            const index = state.itemList.findIndex(item => item.id === itemId);
            if (index !== -1) {
                state.itemList.splice(index, 1);
            }
        },
        updateItemInStore(state, item) {
            const index = state.itemList.findIndex((existingItem) => existingItem.id === item.id);
            if (index !== -1) {
                // Replace the item in the list with the updated item
                state.itemList.splice(index, 1, item);
            }
        },
        // add manage loggedIn state
        setLoggedIn(state, loggedIn) {
            state.loggedIn = loggedIn;
        }
    },
    actions: {
        addItem({commit}, item) {
            commit('addItem', item);
        },
        deleteStore({commit}) {
            commit('deleteStore');
        },
        deleteItemFromStore({commit, state}, itemId) {
            console.log('deleteItemFromStore');
            commit('deleteItemFromStore', itemId);
        },
        updateItemInStore({commit}, item) {
            commit('updateItemInStore', item);
        },
        // add manage loggedIn state
        setLoggedIn({commit}, loggedIn) {
            commit('setLoggedIn', loggedIn);
        }
    },
    getters: {
        getItemList(state) {
            return state.itemList;
        },
        // add manage loggedIn state
        getLoggedIn(state) {
            return state.loggedIn;
        }
    }
});

app.use(store);

export default store;
