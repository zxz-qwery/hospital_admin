import { defineStore } from "pinia";

export const useTagsStore = defineStore("tags", {
    state: () => ({
        // 默认首页标签
        tags: [
            {
                path: "/",
                title: "首页",
            },
        ],
    }),
    actions: {
        // 新增标签
        addTag(tag) {
            if (!this.tags.some((item) => item.path === tag.path)) {
                this.tags.push(tag);
            }
        },
        // 删除标签
        removeTag(path) {
            this.tags = this.tags.filter((item) => item.path !== path);
        },
        // 清空标签（除首页）
        clearTags() {
            this.tags = this.tags.filter((item) => item.path === "/");
        },
    },
});