import http from '../plugins/http'


export const getAdvertList = data => http('advert/list', data, 'GET')
export const addAdvert = data => api('advert/list', data, 'POST')


