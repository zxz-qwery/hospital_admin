import request from "@/utils/request";

// 获取统计数据
export const getStatistics = () => {
    return request.get("/admin/dashboard/statistics");
};

// 获取7天趋势
export const getTrend = () => {
    return request.get('/admin/dashboard/trend')
}