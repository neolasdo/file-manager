<template>
  <div>
    <v-breadcrumbs v-if="keyword === ''" :items="breadcrumb" class="pa-3 custom-breadcrumb">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="'#'" @click="openFolder(item)" :disabled="item.disabled">
          {{ item.text.toUpperCase() }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <h3 v-if="keyword !== ''" style="line-height: 45px">Search result</h3>
  </div>
</template>

<script>
  export default {
    props: {
      breadcrumb: {
        type: Array,
        default() {
          return []
        }
      },
    },
    computed: {
      keyword() {
        return this.$fileStore.state.keyword
      },
    },
    methods: {
      getByFolder(payload) {
        this.$fileStore.dispatch('getByFolder', payload)
      },
      openFolder(item) {
        this.getByFolder(item)
      }
    }
  }
</script>
