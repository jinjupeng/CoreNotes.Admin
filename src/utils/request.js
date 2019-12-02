import axios from 'axios';
import { Message, MessageBox } from 'element-ui'

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    baseURL: '/api',
    timeout: 5000
});

// request拦截
service.interceptors.request.use(
    config => {
        // 在这里对请求拦截做些处理
        // 将token放入请求头Header中
        // https://www.cnblogs.com/xiaoyingainiaa/p/9810610.html
        config.headers.common['Authorization'] = localStorage.getItem('token');
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

// response拦截
service.interceptors.response.use(
    response => {
        // 对后端返回的状态进行判断

        // 登录失效跳转
        // 无权限跳转
        // 等情况
        
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        // console.log(error.response.data.code); // => 401
        // console.log(error);
        // console.log(error.config)
        // console.log(error.code)
        // console.log(error.message)
        // console.log('error.response:')
        // console.log(error.response)
        // 401会话失效，请重新登录
        if (error.response.status === 401) {
            Message({
                message: '您的登录已过期，请重新登录！',
                type: 'error',
                duration: 5 * 1000
              });
        }
        if (error.response.status === 403) {
            Message({
                message: '您暂无权限！',
                type: 'error',
                duration: 5 * 1000
              });
        }
        return Promise.reject(error);
    }
);

export default service;
