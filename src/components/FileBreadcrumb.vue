<template>
  <div>
    <v-breadcrumbs v-if="keyword === ''" :items="breadcrumb" class="pa-3 custom-breadcrumb">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="'#'" @click="openFolder(item)" :disabled="item.disabled">
          {{ item.text.toUpperCase() }}
        </v-breadcrumbs-item>
      </template>
      <template v-slot:divider>
        <v-icon>navigate_next</v-icon>
      </template>
    </v-breadcrumbs>
    <h3 v-if="keyword !== ''" style="line-height: 45px">Search result</h3>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
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
      ...mapState({
        keyword: state => state.fileManager.keyword,
      }),
    },
    methods: {
      ...mapActions({
        getByFolder: 'fileManager/getByFolder',
      }),
      openFolder(item) {
        this.getByFolder(item)
      }
    }
  }
</script>
