import http from '../../utils/request';

// 角色分页列表
export function login(params) {
    return http({
        url: '/login/getjwttoken',
        method: 'post',
        params: params
      })
};