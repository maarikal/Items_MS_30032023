import { createApp } from 'vue';
import { createStore } from 'vuex';

const app = createApp({});
const store = createStore({
    state: {
        itemList: []
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
        }
    },
    actions: {
        addItem({ commit }, item) {
            commit('addItem', item);
        },
        deleteStore({ commit }) {
            commit('deleteStore');
        },
        deleteItemFromStore({ commit, state }, itemId) {
            console.log('deleteItemFromStore');
            commit('deleteItemFromStore', itemId);
        }
    },
    getters: {
        getItemList(state) {
            return state.itemList;
        }
    }
});

app.use(store);

export default store;
