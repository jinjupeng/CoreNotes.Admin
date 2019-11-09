// 用户状态
const statusValues = [{
    value: '0',
    desc: '全部'
  },
  {
    value: '1',
    desc: '启用'
  },
  {
    value: '99',
    desc: '禁用'
  }
]
// 性别
const SexValues = [{
    value: '-1',
    desc: '未知'
  },
  {
    value: '0',
    desc: '女'
  },
  {
    value: '1',
    desc: '男'
  }
]
const RoleStatus = [{
    name: '激活',
    value: true
  },
  {
    name: '禁用',
    value: false
  }
]
const MenuStatus = [{
  name: '激活',
  value: true
},
{
  name: '禁用',
  value: false
}
]
export {
  statusValues,
  SexValues,
  RoleStatus,
  MenuStatus
}