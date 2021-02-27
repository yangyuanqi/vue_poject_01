import http from '../plugins/http'

export const getAdminList = data => http({
    url: 'auth/admin',
    method: 'get',
    data
})

export const adminStateChange = url => http({
    url: url,
    method: 'put'
})

export const addSave = data => http({
    url: 'auth/admin/add',
    method: 'post',
    data
})
