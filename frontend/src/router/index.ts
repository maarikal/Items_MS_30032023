import {createRouter, createWebHistory} from 'vue-router';

// Import your components here
// @ts-ignore
import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import Intro from '../views/Intro.vue';
import Items from '../views/Items.vue';
import Modify from '../views/ItemAddUpdate.vue';
import Log from '../views/Log.vue'

const routes = [

    {
        path: '/',
        name: 'Intro',
        component: Intro,
    },
    {
        path: '/signup',
        name: 'Sign Up',
        component: SignUp,
    },
    {
        path: '/signin',
        name: 'Sign In',
        component: SignIn,
    },
    {
        path: '/items',
        name: 'List of items',
        component: Items,
    },
    {
        path: '/modify',
        name: 'Modify items',
        component: Modify,
    },
    {
        path: '/logs',
        name: 'Log-file',
        component: Log,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
