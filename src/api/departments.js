import request from '@/utils/request'

// 获取科室列表
export const getDepartments = (params) =>
    request.get('/admin/departments', { params })

// 添加科室
export const addDepartment = (data) =>
    request.post('/admin/departments', data)

// 修改科室
export const updateDepartment = (id, data) => {
    return request.put(`/admin/departments/${id}`, data)
}

//删除科室
export const deleteDepartment = (id) =>
    request.delete(`/admin/departments/${id}`)
