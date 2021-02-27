import axios from 'axios'

const service = axios.create({
    baseURL:process. process.env.VUE_APP_BASE_API,
    timeout: 5000
})

// 拦截器
service.interceptors.request.use(
    config => {
        console.log(config)
        // if (store.getters.token) {
        //     config.headers['X-Token'] = getToken()
        // }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        console.log(123, process.env.VUE_APP_BASE_API)
        console.log(res)
        // if the custom code is not 20000, it is judged as an error.
        // if (res.code !== 200) {
        //     Message({
        //         message: res.message || 'Error',
        //         type: 'error',
        //         duration: 5 * 1000
        //     })

        //     // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        //     if (res.code === 401) {
        //         // to re-login
        //         MessageBox.confirm('您已退出登录, 可以取消并停留在当前页面, 或者重新登录', '确认退出', {
        //             confirmButtonText: '重新登录',
        //             cancelButtonText: '取消',
        //             type: 'warning'
        //         }).then(() => {
        //             store.dispatch('user/resetToken').then(() => {
        //                 location.reload()
        //             })
        //         })
        //     }
        //     return Promise.reject(new Error(res.message || 'Error'))
        // } else {
        //     return res
        // }
    },
    error => {
        console.log('err' + error) // for debug
        // Message({
        //     message: error.message === 'Network Error' ? '网络错误' : error.message,
        //     type: 'error',
        //     duration: 5 * 1000
        // })
        return Promise.reject(error)
    }
)

export default service
