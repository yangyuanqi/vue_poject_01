import http from '../plugins/http'

export const getAdminList = data =>{
    http({
        url:'auth/admin',
        method:'get',
        data
    })
}
