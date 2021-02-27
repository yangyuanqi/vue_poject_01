import http from '../plugins/http'


export const getAdvertList = data => http({
    url: 'menus',
    method: 'get',
    data
})

