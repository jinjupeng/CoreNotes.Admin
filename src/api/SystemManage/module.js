import http from '../../utils/request';

// 角色分页列表
export function getModuleList(params) {
    return http({
        url: '/module/getlist',
        method: 'get',
        params: params
      })
};
// 不分页查询
export function getModuleAll() {
  return http({
    url: '/module/getall',
    method: 'get'
  })
}

// 单条删除
export function removeModule(params) {
    return http({
        url: '/module/delete',
        method: 'delete',
        params: params
      })
};

export function editModule(params) {
    return http({
        url: '/module/put',
        method: 'put',
        params: params
      })
};

export function addModule(params) {
    return http({
        url: '/module/post',
        method: 'post',
        params: params
      })
};
