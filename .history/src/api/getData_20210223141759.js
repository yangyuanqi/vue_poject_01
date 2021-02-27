import http from '../plugins/http'


export const getMenus = data => http({
    url: 'menus',
    method: 'get',
    data
})

