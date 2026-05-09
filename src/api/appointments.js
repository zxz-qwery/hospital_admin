import request from '@/utils/request'

// 获取列表
export const getAppointments = (params) => {
    return request.get('/admin/appointments', { params });
};

// 修改状态
export const updateAppointmentStatus = (id, data) => {
    return request.put(`/admin/appointments/${id}/status`, data);
};

// 删除
export const deleteAppointment = (id) => {
    return request.delete(`/admin/appointments/${id}`);
};