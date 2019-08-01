import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import { statusOptions } from '@/views/deliver/component/options'

const status = statusOptions.slice(1).map(item => item.value)

const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    created_at: Math.floor(new Date(Mock.Random.datetime()) / 1000), // 秒时间戳
    updated_at: Math.floor(new Date(Mock.Random.datetime()) / 1000), // 秒时间戳
    deleted_at: Math.floor(new Date(Mock.Random.datetime()) / 1000), // 秒时间戳
    'status|1': status,
    'max_num': 1000, // 应用投放数量
    'app_num|1-1000': 10, // 应用已投放数量
    'active_app_num|1-1000': 100, // 应用激活数量
    'desc': '@title(5, 10)', // 备注
    'list|2': [ // 行为列表
      {
        'type|1': [1, 2], // 投放行为 1-安装 2-卸载
        'notify': false, // 是否一并激活应用
        'app_id|1': [1, 2], // 投放应用的id
        'app_version_id': 1, // 投放应用的版本
        'weight|1': [1, 2, 3, 4],
        'auto_uninstall_time|1': [7, 15, 30], // 自动卸载时间
        'manufacturers|2': [ // 对应内容方的投放百分比，单位%
          {
            'id|1-100': 1, // 内容方ID
            'name|1': ['豌豆荚', '安卓市场', '应用宝', '小米应用商店', 'XXXX'], // 内容方名称
            weight: 10 // 投放占比
          },
          {
            'id|1-100': 1, // 内容方ID
            'name|1': ['豌豆荚', '安卓市场', '应用宝', '小米应用商店', 'XXXX'], // 内容方名称
            weight: 14 // 投放占比
          }
        ],
        // 'is_imei_deliver': false, // 是否选择IMEI投放
        'imei': [], // IMEI值
        'devices': [ // 投放的手机品牌与对应机型
          {
            'id': 1, // 手机品牌ID
            'types': [2, 3, 1] // 机型id列表
          },
          {
            'id': 2,
            'types': [1]
          }
        ],
        'channels': [1, 2], // 投放集成方ID列表
        'not_these_areas': false, // 是否选定'不投所选区域'
        'areas': [ // 投放区域列表
          ['110000'], // 对应的省份或直辖市编码
          ['120000'],
          ['130000'], // 河北省
          ['130000', '130200'], // 对应的省份/城市，如此处对应为：河北省/唐山市
          ['130000', '130300'], // 河北省/秦皇岛市
          ['140000'],
          ['150000'],
          ['310000']
        ]
      }
    ]
  }))
}

export default {
  getDeliverList: (config) => {
    const { id, user, name, status, sort, page = 1, perpage = 20 } = param2Obj(config.url)

    const mockList = List.filter(item => {
      if (id && item.id !== +id) return false
      if (name && item.name.indexOf(name) < 0) return false
      if (user && item.user.indexOf(user) < 0) return false
      if (status && item.status !== +status) return false
      return true
    })

    if (sort) {
      mockList.sort((a, b) => {
        const bool = /^-/.test(sort)
        const key = bool ? sort.slice(1) : sort
        // console.log(bool, key)
        return bool ? b[key] - a[key] : b[key] - a[key]
      })
    }

    const pageList = mockList.filter((item, index) => index < perpage * page && index >= perpage * (page - 1))
    return {
      code: 0,
      data: {
        items: pageList,
        last_page: Math.ceil(mockList.length / perpage),
        current_page: +page,
        per_page: perpage,
        total: mockList.length
      }
    }
  },
  getDeliver: (config) => {
    // console.log(config.url)
    const id = config.url.split('/container/tasks/')[1]
    for (const ad of List) {
      if (ad.id === +id) {
        return {
          code: 0,
          data: ad
        }
      }
    }
  },
  getDeliverDetail: (config) => {
    // console.log(config.url)
    const id = config.url.split('/container/tasks/detail/')[1]
    let data
    for (const item of List) {
      if (item.id === +id) {
        data = item
      }
    }
    return {
      code: 0,
      data: Object.assign({}, data, Mock.mock({
        'list|1-3': [
          {
            'type|1': ['安装', '卸载'],
            'app|1': ['今日头条', '腾讯新闻', 'XXXX'],
            'app_version': 'v1.0',
            'manufacturers|2': [
              {
                'id|1-100': 1,
                'name|1': ['豌豆荚', '安卓市场', '应用宝', '小米应用商店', 'XXXX'],
                weight: 10
              }
            ],
            'devices|1-3': [
              {
                'id': 1,
                'name|1': ['华为', '小米', '苹果', 'OPPO', 'VIVO'],
                'types|1-10': ['XXXX']
              }
            ],
            'channels': ['深圳天天看看', '深圳说好网络'],
            'not_these_areas': false,
            'areas': ['北京市', '河北省/唐山市']
          }
        ]
      }))
    }
  },
  createDeliver: () => ({
    code: 0,
    data: {
      id: 123
    }
  }),
  updateDeliver: () => ({
    code: 0,
    data: 'success'
  }),
  updateStatus: () => ({
    code: 0,
    data: 'success'
  }),
  getAppList: () => ({
    code: 0,
    data: {
      last_page: 1,
      current_page: 1,
      per_page: 20,
      total: 2,
      items: [
        {
          name: '今日头条',
          id: 1
        },
        {
          name: '豆瓣',
          id: 2
        }
      ]
    }
  }),
  getAppVersionList: () => ({
    code: 0,
    data: {
      last_page: 1,
      current_page: 1,
      per_page: 20,
      total: 2,
      items: [
        {
          name: 'v1.0',
          id: 1
        },
        {
          name: 'v2.0',
          id: 2
        }
      ]
    }
  }),
  getAppInfo: () => ({
    code: 0,
    data: {
      app_name: '应用名称xxx',
      package: '包名xxxxxx',
      manufaturer_id: 1,
      download_url: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
      icon: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
      size: 100000,
      code: 1,
      name: '版本名称',
      tag_name: '标签名称',
      selected_tag_id: '1,2,3',
      manufacturers: [
        {
          id: 1,
          name: '豌豆荚',
          weight: 0
        },
        {
          id: 2,
          name: '安卓市场',
          weight: 0
        }
      ]
    }
  })
}
