import http from '../../utils/request';

// 角色分页列表
export function getRoleList(params) {
    return http({
        url: '/role/getlist',
        method: 'get',
        params: params
      })
};
// 不分页查询
export function getRoleAll() {
  return http({
    url: '/role/getall',
    method: 'get'
  })
}

// 单条删除
export function removeRole(params) {
    return http({
        url: '/role/delete',
        method: 'delete',
        params: params
      })
};

export function editRole(params) {
    return http({
        url: '/role/put',
        method: 'put',
        params: params
      })
};

export function addRole(params) {
    return http({
        url: '/role/post',
        method: 'post',
        params: params
      })
};
