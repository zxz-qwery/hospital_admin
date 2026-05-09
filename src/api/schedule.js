import request from '@/utils/request'

// 列表
export const getSchedules = (params) =>
    request.get('/admin/schedules', { params })

// 新增
export const addSchedule = (data) =>
    request.post('/admin/schedules', data)

// 修改
export const updateSchedule = (id, data) =>
    request.put(`/admin/schedules/${id}`, data)

// 删除
export const deleteSchedule = (id) =>
    request.delete(`/admin/schedules/${id}`)