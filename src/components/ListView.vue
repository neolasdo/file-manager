<template>
    <div>
        <folder-list ref="folderList"/>
        <file-list ref="fileList"/>
    </div>
</template>

<script>
import FolderList from "./FolderList";
import FileList from "./FileList";
export default {
    components: {
        FolderList,
        FileList
    },
    methods: {
        
    }
}
</script>
