import http from '../../utils/request';

// 用户分页列表
export function getUserList(params) {
    return http({
        url: '/user/getlist',
        method: 'get',
        params: params
      })
};

// 单条删除
export function removeUser(params) {
    return http({
        url: '/user/delete',
        method: 'delete',
        params: params
      })
};

export function editUser(params) {
    return http({
        url: '/user/put',
        method: 'put',
        params: params
      })
};

export function addUser(params) {
    return http({
        url: '/user/post',
        method: 'post',
        params: params
      })
};

// 批量删除
export function batchRemoveUser(params) {
    return http({
        url: '/user/BatchDelete',
        method: 'delete',
        params: params
      })
};
