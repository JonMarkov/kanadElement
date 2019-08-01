
import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@title(2, 3)',
    manager: '@title(2, 3)',
    phone: 12345678912,
    email: '@email',
    home_url: '@url',
    deck: '@title(5, 10)',
    created_at: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")'),
    updated_at: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
  }))
}

export default {
  getChannelList: (config) => {
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
  getChannel: (config) => {
    console.log(config.url)
    const id = config.url.split('/container/channels/')[1]
    for (const account of List) {
      if (account.id === +id) {
        return {
          code: 0,
          data: account
        }
      }
    }
  },
  createChannel: () => ({
    code: 0,
    data: 'success'
  }),
  updateChannel: () => ({
    code: 0,
    data: 'success'
  })
}
