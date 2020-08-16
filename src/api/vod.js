import request from '@/utils/request'

export default {
  removeByVodId(id) {
    return request({
      url: `/admin/vod/media/remove/${id}`,
      method: 'delete'
    })
  }
}
