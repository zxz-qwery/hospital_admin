import request from '@/utils/request'

// 登录
export const adminLogin = (data) => request.post('/admin/login', data)

// 获取用户列表
export const getUsers = (params) => request.get('/admin/users', { params })

// 删除用户
export const deleteUser = (id) =>
    request.delete(`/admin/users/${id}`)

// 修改用户
export const updateUser = (id, data) =>
    request.put(`/admin/users/${id}`, data)

// 重置密码
export const resetPassword = (id, data) =>
    request.post(`/admin/users/${id}/reset-password`, data)

