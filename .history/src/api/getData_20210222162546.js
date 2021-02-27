import api from '../plugins/api'

export const getAdvertList = data => api('advert/list', data, 'GET')
export const addAdvert = data => api('advert/list', data, 'POST')

