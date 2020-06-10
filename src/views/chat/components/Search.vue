<template>
    <transition name="fade">
        <div class="search">
            <mt-search ref="search"
            :placeholder="searchText"
            :cancel-text="cancelText"
            :autofocus="true"
            @click.native="handleClick"
            v-model.trim="value"
            @keyup.enter.native="onSearch">
                <mt-cell v-if="value" :title="title" is-link @click.native="onSearch"></mt-cell>
            </mt-search>
            <div v-if="friendInfo !== null">
                <div class="line"></div>
                <div class="user-info">
                     <p>{{ friendInfo.friendName || friendInfo.username }}</p>
                     <mt-button v-if="friendInfo.friendName" type="primary" :disabled="true" size="small" @click="addFriend">已添加</mt-button>
                    <mt-button v-else type="primary" size="small" @click="addFriend">添加</mt-button>
                </div>
            </div>
        </div>
    </transition>
</template>