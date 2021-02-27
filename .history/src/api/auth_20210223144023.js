import http from '../plugins/http'

export const getAdminList = data => {
    return http({
        url: 'auth/admin',
        method: 'get',
        data
    })
}
