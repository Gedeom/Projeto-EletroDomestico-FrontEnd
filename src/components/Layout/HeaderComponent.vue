<template>
  <div>

    <v-app-bar app
               class="indigo"
               dark>
      <v-tabs>
        <v-tab class="text-h5" :to="{name:'Eletrodomestico'}">
          Eletrodomésticos
        </v-tab>

        <v-spacer></v-spacer>

        <v-tab :to="{name:'Login'}" v-if="logado === false">
          Login
        </v-tab>

        <v-tab v-if="logado" @click="logout()">
          Logout
        </v-tab>


        <v-tab :to="{name:'Cadastro'}">
          Cadastro
        </v-tab>

        <v-tab v-if="logado">
          {{ getNameLogado }}

        </v-tab>
      </v-tabs>



    </v-app-bar>
  </div>
</template>

<script>

export default {
  name: 'HeaderComponent',
  data() {
    return {
    }
  },
  methods: {
    getToken(){
      return localStorage.getItem('token');
    },
    clearToken(){
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('name');
      return true
    },
    logout: function(){
      this.$http.post(`http://localhost:8085/api/logout`, {
        token: this.getToken(),
      }).then(() => {
        this.success = true
        this.clearToken();

        setTimeout(() => {
          this.$router.go('/');
        },1000)
      }).catch((error) => {
        if (error.response.status == 403) {
          this.errors = error.response.data.errors;
          return false;
        }
        this.messageError = error.response.data.error;
      });
    }
  },
  computed: {
    logado: function(){
      return localStorage.getItem('token') != null
    },
    getNameLogado: function(){
      return localStorage.getItem('name')
    },

  }
}
</script>

<style>
img {
  height:100vh;
}
</style>
