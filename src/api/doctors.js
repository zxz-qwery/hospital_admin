import request from '@/utils/request'

// 获取列表
export const getDoctors = (params) => {
    return request.get('/admin/doctors', { params })
}

// 添加
export const addDoctor = (data) => {
    return request.post('/admin/doctors', data)
}

// 修改
export const updateDoctor = (id, data) => {
    return request.put(`/admin/doctors/${id}`, data)
}

// 删除
export const deleteDoctor = (id) => {
    return request.delete(`/admin/doctors/${id}`)
}

// 上传封面
export const uploadMovieCover = (data) => {
    return request.post('/admin/upload', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}