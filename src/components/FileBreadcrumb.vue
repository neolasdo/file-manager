<template>
  <div>
    <v-breadcrumbs v-if="!isSearching" :items="breadcrumb" class="pa-3 custom-breadcrumb">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :href="'#'" @click="openFolder(item)" :disabled="item.disabled">
          {{ item.text.toUpperCase() }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <h3 v-if="isSearching" class="pl-3" style="line-height: 45px">{{ $trans('search_result') }}</h3>
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
      isSearching() {
        return this.$store.state.fileManager.isSearching
      },
    },
    methods: {
      getByFolder(payload) {
        this.$store.dispatch('fileManager/getByFolder', payload)
      },
      openFolder(item) {
        this.getByFolder(item)
      }
    }
  }
</script>
