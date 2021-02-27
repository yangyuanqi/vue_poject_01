import http from '../plugins/http'


export const getAdvertList = data => http({
    url:'advert/list',  'GET'
})
export const addAdvert = data => http({
    'advert/list', data, 'POST'
})


