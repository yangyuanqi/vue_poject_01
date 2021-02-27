import http from '../plugins/http'


export const getAdvertList = data => http({
    url:'advert/list',  'GET',data
})
export const addAdvert = data => http({
    'advert/list', data, 'POST'
})


