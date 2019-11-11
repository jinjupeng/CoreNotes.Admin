import http from '../../utils/request';

// 保存分配过的权限
export function saveAssign(params) {
    return http({
        url: '/modulepermission/post',
        method: 'post',
        params: params
      })
};
