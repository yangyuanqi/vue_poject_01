import http from '../plugins/http'


export const getAdvertList = data => http({
    url: 'advert/list',
    method: 'GET',
    data
})
export const addAdvert = data => http({
    url: 'advert/list',
    method: 'post',
    data
})


