// import request from '@/utils/request'
import axios from 'axios'

const uploadHttp = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export function upload(formData) {
  const url = process.env.UPLOAD_API
  return uploadHttp.post(url, formData, {
    method: 'post',
    header: {
      'content-type': 'multipart/form-data'
      // 'origin': 'https://pre.wx.app.kankan.com'
    }
  })
}
