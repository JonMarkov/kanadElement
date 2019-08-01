
import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@title(2, 3)',
    manufacturers: [
      {
        id: 1,
        name: '豌豆荚',
        weight: 50
      },
      {
        id: 2,
        name: '安卓市场',
        weight: 50
      }
    ],
    created_by_user: {
      id: '@increment',
      realname: '@title(2, 3)',
      username: '@title(2, 3)'
    },
    created_at: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
    updated_at: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
  }))
}

export default {
  getContainerConfigList: (config) => {
    const { id, name, page = 1, perpage = 20 } = param2Obj(config.url)

    const mockList = List.filter(item => {
      if (id && item.id !== +id) return false
      if (name && item.name.indexOf(name) < 0) return false
      return true
    })

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
  getContainerConfig: (config) => {
    console.log(config.url)
    const id = config.url.split('/container/manufacturers/')[1]
    for (const account of List) {
      if (account.id === +id) {
        return {
          code: 0,
          data: account
        }
      }
    }
  },
  createContainerConfig: () => ({
    code: 0,
    data: 'success'
  }),
  updateContainerConfig: () => ({
    code: 0,
    data: 'success'
  }),
  getManufacturerOptions: () => ({
    code: 0,
    data: {
      items: [
        {
          id: 1,
          name: '豌豆荚'
        },
        {
          id: 2,
          name: '安卓市场'
        }
      ]
    }
  })
}
