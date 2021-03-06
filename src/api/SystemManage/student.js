import http from '../../utils/request';

export function queryStudent(param) {
    return http({
      url: '/student/getname',
      method: 'get',
      params: param
    })
  }

export function queryList(param) {
  return http({
    url: '/student/getlist',
    method: 'get',
    params: param
  })
}

export function CreateOrUpdate(param) {
  return http({
    url: '/student/CreateOrUpdate',
    method: 'post',
    params: param
  })
}

// 删除/多条删除
