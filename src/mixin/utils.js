import * as enumTypes from './enum'

function formatDate(format, dateObj) {
  if (!dateObj) {
    dateObj = new Date()
  }
  var date = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'H+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    'S+': dateObj.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return format
}

const utilsMixin = {
  filters: {
    firstItem: function(line) {
      if (!line) {
        return ''
      }
      let i = 0
      for (; i < line.length; i++) {
        if (line[i] === ' ') {
          break
        }
      }
      return line.substr(0, i)
    },
    // 格式化日期
    unixTime: function(val, format) {
      if (val) {
        var date = new Date(parseInt(val.replace('/Date(', '').replace(')/', ''), 10))
        if (!format) {
          format = 'yyyy-MM-dd HH:mm'
        }
        return formatDate(format, date)
      }
      return val
    },
    // js将数字格式化为千分位金额格式
    formatCurrency: function(num) {
      if (num === undefined || num === null) {
        return num
      }
      num = num.toString().replace(/\$|\, /g, '')
      if (isNaN(num)) {
        num = '0'
      }
      num = parseFloat(num)
      const sign = !(num < 0)
      num = Math.abs(num)
      num = Math.floor(num * 100 + 0.50000000001)
      let cents = num % 100
      num = Math.floor(num / 100).toString()
      if (cents < 10) {
        cents = '0' + cents
      }
      for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
      }
      return (((sign) ? '' : '-') + num + '.' + cents)
    },
    // 转为字符串
    toString: function(val) {
      return val.toString()
    },
    // 转为整数
    toInt: function(val) {
      return parseInt(val)
    },
    // 转为百分数
    toPercentage: function(val) {
      var str = Number(val * 100).toFixed(2)
      str += '%'
      return str
    },
    enumDesc: function(val, enumTypeName) {
      if (val === undefined || val === null) {
        return ''
      }
      const enumType = enumTypes[enumTypeName]
      if (!enumType) {
        return ''
      }
      if (enumType instanceof Array) {
        for (let i = 0; i < enumType.length; i++) {
          if (enumType[i].value.toString() === val.toString()) {
            return enumType[i].desc
          }
        }
      }
      return ''
    },
    toText: function(val) {
      if (val === true) {
        return '是'
      } else if (val === false) {
        return '否'
      }
    }
  },
  methods: {
    getFormatCurrency: function(num) {
      if (num === undefined) {
        return num
      }
      num = num.toString().replace(/\$|\, /g, '')
      if (isNaN(num)) {
        num = '0'
      }
      num = parseFloat(num)
      const sign = !(num < 0)
      num = Math.abs(num)
      num = Math.floor(num * 100 + 0.50000000001)
      let cents = num % 100
      num = Math.floor(num / 100).toString()
      if (cents < 10) {
        cents = '0' + cents
      }
      for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
      }
      return (((sign) ? '' : '-') + num + '.' + cents)
    },
    // 日期格式化 支持/Date(14444)/形式
    dateFormat(dateObj, format) {
      if (!dateObj) {
        dateObj = new Date()
      } else if (dateObj instanceof String && dateObj.indexOf('/Date(') === 0) {
        dateObj = new Date(parseInt(dateObj.replace('/Date(', '').replace(')/', ''), 10))
      }
      if (!format) {
        format = 'yyyy-MM-dd HH:mm:ss'
      }
      var date = {
        'M+': dateObj.getMonth() + 1,
        'd+': dateObj.getDate(),
        'H+': dateObj.getHours(),
        'm+': dateObj.getMinutes(),
        's+': dateObj.getSeconds(),
        'q+': Math.floor((dateObj.getMonth() + 3) / 3),
        'S+': dateObj.getMilliseconds()
      }
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in date) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
        }
      }
      return format
    },
    // 转为时间戳 支持/Date(14444)/形式
    convertToTimestamp(dateObj) {
      if (!dateObj) {
        dateObj = new Date()
        return dateObj.getTime()
      } else if (dateObj instanceof String && dateObj.indexOf('/Date(') === 0) {
        return parseInt(dateObj.replace('/Date(', '').replace(')/', ''), 10)
      }
    },
    // 转为日期 支持/Date(14444)/形式
    convertToDate(dateStr) {
      if (dateStr instanceof String && dateStr.indexOf('/Date(') === 0) {
        return new Date(parseInt(dateStr.replace('/Date(', '').replace(')/', ''), 10))
      } else {
        return new Date(dateStr.replace(/-/g, '/'))
      }
    },
    // 获得以空格分割的第一项
    getFirstItem(line) {
      if (!line) {
        return ''
      }
      let i = 0
      for (; i < line.length; i++) {
        if (line[i] === ' ') {
          break
        }
      }
      return line.substr(0, i)
    },
    getEnumType(enumTypeName) {
      const enumType = enumTypes[enumTypeName]
      if (!enumType) {
        return []
      }
      return enumType
    }
  }
}

export { utilsMixin }
