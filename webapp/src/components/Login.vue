<template>
  <v-card prepend-icon="mdi-login" title="Login to continue">
    <v-form @submit.prevent="login(email, password)">
      <v-card-text>
        <v-row dense>
          <v-col>
            <v-text-field label="EMail*" type="email" v-model="email" required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field label="Password*" type="password" v-model="password" required></v-text-field>
          </v-col>
        </v-row>

        <small class="text-caption text-medium-emphasis">*required</small>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text="Login" type="submit" variant="tonal"></v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useAuthenticationStore} from "@/stores/authentication";
import {mapActions} from "pinia";

export default defineComponent({
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    ...mapActions(useAuthenticationStore, ["login"])
  },
})
</script>

<style scoped>

</style>
