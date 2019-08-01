
import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    username: '@title(2, 3)',
    realname: '@title(2, 3)',
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
  getAccountList: (config) => {
    const { id, username, realname, page = 1, perpage = 20 } = param2Obj(config.url)

    const mockList = List.filter(item => {
      if (id && item.id !== +id) return false
      if (username && item.username.indexOf(username) < 0) return false
      if (realname && item.realname.indexOf(realname) < 0) return false
      if (status && item.status !== +status) return false
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
  getAccount: (config) => {
    // console.log(config.url)
    const id = config.url.split('edit/')[1]
    for (const account of List) {
      if (account.id === +id) {
        return {
          code: 0,
          data: account
        }
      }
    }
  },
  createAccount: () => ({
    code: 0,
    data: 'success'
  }),
  updateAccount: () => ({
    code: 0,
    data: 'success'
  })
}
