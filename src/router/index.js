import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/pages/Login/LoginComponent'
import eletrodomestico from '@/components/pages/Eletrodomestico/EletrodomesticoComponent'
import cadastro from '@/components/pages/Cadastro/CadastroComponent'

Vue.use(Router);

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: login
    },
    {
        path: '/',
        name: 'Eletrodomestico',
        component: eletrodomestico
    },
    {
        path: '/cadastro',
        name: 'Cadastro',
        component: cadastro
    }
];


export default new Router({
    routes
})