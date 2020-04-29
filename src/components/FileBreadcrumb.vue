<template>
  <v-breadcrumbs :items="breadcrumb" class="pa-3 custom-breadcrumb">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item :href="'#'" @click="openFolder(item)" :disabled="item.disabled">
        {{ item.text.toUpperCase() }}
      </v-breadcrumbs-item>
    </template>
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    props: {
      breadcrumb: {
        type: Array,
        default() {
          return []
        }
      },
    },
    methods: {
      ...mapActions({
        getByFolder: 'getByFolder',
      }),
      openFolder(item) {
        this.getByFolder(item)
      }
    }
  }
</script>
