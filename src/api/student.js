import http from '../utils/request';

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

export function edit(param) {
  return http({
    url: '/student/edit',
    method: 'post',
    params: param
  })
}