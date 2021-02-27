import http from '../plugins/http'


export const getAdvertList = data => http({
    'advert/list', data, 'GET'
})
export const addAdvert = data => http({
    'advert/list', data, 'POST'
})


