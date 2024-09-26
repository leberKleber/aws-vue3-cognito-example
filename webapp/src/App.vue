<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-app-bar title="Application bar"></v-app-bar>
      <navigation></navigation>
      <v-main
        class="d-flex align-center justify-center"
        style="min-height: 300px"
      >
        <router-view/>
      </v-main>
    </v-layout>

    <v-dialog v-model="showLoginOverlay" max-width="600" persistent>
      <login></login>
    </v-dialog>
  </v-app>
</template>


<script>
import Navigation from "@/components/Navigation.vue";
import Login from "@/components/Login.vue";
import {mapState} from "pinia";
import {useAuthenticationStore} from "@/stores/authentication";

export default {
  components: {Login, Navigation},
  data: () => ({
    showLoginOverlay: false,
  }),
  computed: {
    ...mapState(useAuthenticationStore, ["isAuthenticated"]),
  },
  mounted() {
    this.showLoginOverlay = !this.isAuthenticated
  },
  watch: {
    isAuthenticated() {
      this.showLoginOverlay = !this.isAuthenticated
    }
  }
}
</script>
