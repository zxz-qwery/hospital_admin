import { baseURL } from "@/utils/request";
export const getAvatarUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return baseURL + "/images" + url.replace("/images", "");
};