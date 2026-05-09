import request from '@/utils/request'

// 列表
export const getAnnouncements = (params) =>
    request.get('/admin/announcements', { params })

// 新增
export const addAnnouncement = (data) =>
    request.post('/admin/announcements', data)

// 修改
export const updateAnnouncement = (id, data) =>
    request.put(`/admin/announcements/${id}`, data)

// 删除
export const deleteAnnouncement = (id) =>
    request.delete(`/admin/announcements/${id}`)