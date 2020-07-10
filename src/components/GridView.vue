<template>
    <div>
        <folder-grid ref="folderGrid"/>
        <file-grid ref="fileGrid"/>
    </div>
</template>

<script>
import FolderGrid from "./FolderGrid";
import FileGrid from "./FileGrid";
export default {
    components: {
        FolderGrid,
        FileGrid
    },
    methods: {
        
    }
}
</script>
