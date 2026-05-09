import request from '@/utils/request'

// 列表
export const getRecords = (params) =>
    request.get('/admin/medical-records', { params })

// 新增
export const addRecord = (data) =>
    request.post('/admin/medical-records', data)

// 删除
export const deleteRecord = (id) =>
    request.delete(`/admin/medical-records/${id}`)