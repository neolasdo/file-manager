<template>
  <v-app>
    <file-manager></file-manager>
  </v-app>
</template>

<script>
  import FileManager from "./components/FileManager";

export default {
  name: 'App',
  components: {
    'file-manager': FileManager
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
