<script>
export default {
  methods: {
    download(files) {
      let endpoint = this.$fileStore.$getEndpoint("download");
      this.$fileStore.dispatch("loading");

      this.$fileStore
        .$axios({
          method: endpoint.method ? endpoint.method: 'POST',
          url: endpoint.route,
          data: {
            files: files
          },
        })
        .then((res) => {
          this.$fileStore.dispatch("unloading");
          if (res.data && res.data.data) {
            window.open(res.data.data.link, "_self");
          }
        })
        .catch((errors) => {
          this.$fileStore.dispatch("unloading");
          if (
            errors.response &&
            errors.response.data &&
            errors.response.data.message
          ) {
            this.$snackbar(errors.response.data.message, {
              color: "error",
            });
          }
        });
    },
  },
};
</script>
