<template>
    <file-manager></file-manager>
</template>

<script>
  import FileManager from "./components/FileManager";

  export default {
    name: 'App',
    components: {
      'file-manager': FileManager
    },
  }
</script>
