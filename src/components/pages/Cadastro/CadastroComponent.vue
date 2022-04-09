<template>
  <v-card id="teste">
    <v-card-title>
      Usuários
    </v-card-title>
    <div v-if="errors" class="bg-red-500 text-white py-2 px-4 pr-0 rounded font-bold mb-4 shadow-lg">
      <div v-for="(v, k) in errors" :key="k">
        <v-alert
            v-for="error in v" :key="error"
            dismissible
            type="error">

          {{ error }}
        </v-alert>
      </div>
    </div>
    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="mx-4"
        hide-details
        item-key="id"
        label="Search"
        single-line
    ></v-text-field>

    <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
            flat
        >

          <v-spacer></v-spacer>
          <v-dialog
              v-model="dialog"
              max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  class="mb-2"
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
              >
                Adicionar
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                        cols="12">
                      <v-text-field
                          v-model="editedItem.name"
                          label="Nome"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                        sm="6">
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                        cols="12">
                      <v-text-field
                          v-model="editedItem.email"
                          label="E-mail"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12">
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                        cols="12">
                      <v-text-field
                                    label="Senha"
                                    type="password"
                      ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12">
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                >
                  Cancelar
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                >
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Tem certeza que quer deletar?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">Ok</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            class="mr-2"
            small
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>


  </v-card>
</template>

<script>

export default {
  name: 'CadastroComponent',
  data: () => ({
    errors: [],
    success: false,
    dialog: false,
    search: '',
    dialogDelete: false,
    headers: [
      {
        text: 'Código',
        align: 'start',
        sortable: true,
        value: 'id',
      },
      {text: 'Nome', value: 'name', sortable: true},
      {text: 'E-mail', value: 'email', sortable: true},
      {text: 'Senha', value: 'senha', sortable: true, align: ' d-none'},
      {text: 'Actions', value: 'actions', sortable: false},
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      nome: '',
      email: '',
      senha: '',
    },
    defaultItem: {
      id: '',
      nome: '',
      email: '',
      senha: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Item' : 'Editar Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    showError(msg){
      this.$Simplert.open({type:'error',message: msg});
    },
    showSuccess(msg){
      this.$Simplert.open({type:'success',message: msg});
    },
    initialize() {
      this.$http.get('http://localhost:8085/api/users')
          .then(result => {
            this.users = result.data.data
          }).catch((error) => {

        this.showError(error.response.data.message);
      }).finally();
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$http.delete(`http://localhost:8085/api/users/${this.editedItem.id}`).then(result => {
        this.initialize();
        this.showSuccess(result.data.message);
      }).catch((error) => {
        this.showError(error.response.data.message);
      }).finally(() => {
        this.closeDelete()

      });
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },


    //salvar
    save() {
        if (this.editedIndex > -1) {
          this.$http.put(`http://localhost:8085/api/users/${this.editedItem.id}`, {
            email: this.editedItem.email,
            name: this.editedItem.name,
            password: this.editedItem.password,
          }).then(result => {
            this.initialize();
            this.showSuccess(result.data.message);
          }).catch((error) => {
            if (error.response.status == 403) {
              this.errors = error.response.data.errors;
              return false;
            }
            this.showError(error.response.data.message);
          }).finally(() => {
            this.closeDelete()

          });

          //atualizar
        } else {
          this.$http.post('http://localhost:8085/api/users', {
            email: this.editedItem.email,
            name: this.editedItem.name,
            password: this.editedItem.password,
          }).then(result => {
            this.initialize();
            this.showSuccess(result.data.message);
          }).catch((error) => {
            if (error.response.status == 403) {
              this.errors = error.response.data.errors;
              return false;
            }
            this.showError(error.response.data.message);
          }).finally(() => {
            this.closeDelete()

          });


        }

        this.close()
    },
  },
}
</script>

<style>

</style>
