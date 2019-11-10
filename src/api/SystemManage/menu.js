import http from '../../utils/request';

export function getMenuTree() {
    return http({
        url: '/menu/getmenutree',
        method: 'get'
      })
};

export function getMenuTreeList() {
    return http({
        url: '/menu/getmenutreelist',
        method: 'get'
      })
};

export function deleteMenu(param) {
    return http({
        url: '/menu/delete',
        method: 'delete',
        params: param
      })
};



