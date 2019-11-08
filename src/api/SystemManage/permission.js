import http from '../../utils/request';

// 分页列表
export function getPermissionList(params) {
    return http({
        url: '/permission/getlist',
        method: 'get',
        params: params
      })
};

// 单条删除
export function removePermission(params) {
    return http({
        url: '/permission/delete',
        method: 'delete',
        params: params
      })
};

export function editPermission(params) {
    return http({
        url: '/permission/put',
        method: 'put',
        params: params
      })
};

export function addPermission(params) {
    return http({
        url: '/permission/post',
        method: 'post',
        params: params
      })
};

