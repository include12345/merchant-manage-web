<template>
    <div v-for="item in routes" v-if="!item.hidden&&item.children">
        <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children && !item.alwaysShow" :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name">

        </router-link>

    </div>
</template>
