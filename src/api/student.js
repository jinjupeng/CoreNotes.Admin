import http from '../utils/request';

export function queryStudent() {
    return http({
      url: '/student/getname',
      method: 'get'
    })
  }