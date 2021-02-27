import http from '../plugins/http'

export const getMenus = () => http({
    url: '/menus',
    method: 'get',
})

