import http from '../plugins/http'


export const getAdvertList = data => http({
    url: 'menus',
    method: 'get',
    data
})
export const addAdvert = data => http({
    url: 'advert/list',
    method: 'post',
    data
})


