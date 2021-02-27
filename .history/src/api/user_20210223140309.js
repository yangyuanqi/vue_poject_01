import http from '../plugins/http'

export const login = data => http({
    url: 'user/login',
    method: 'post',
    data
})