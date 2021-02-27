import api from '../plugins/api'
import http from '../plugins/http'

export const getAdvertList = data => api('advert/list', data, 'GET')
export const addAdvert = data => api('advert/list', data, 'POST')

export const login = data => http({
    url:'/login',
    method:'post'
})