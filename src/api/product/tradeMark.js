import request from '@/utils/request'
/* 
  API: /admin/product/baseTrademark/{page}/{limit}
  Method: GET
*/
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: "get"
})

/* 
  API: 
    添加：/admin/product/baseTrademark/save Method: post
    修改：/admin/product/baseTrademark/update Method: put
*/

export const reqAddOrUpdateTradeMark = (trademarkinfo) => {
  // 修改品牌
  if (trademarkinfo.id) {
    return request({
      url: `/admin/product/baseTrademark/update`,
      method: "put",
      data: trademarkinfo
    })
  } else {
    // 添加品牌
    return request({
      url: `/admin/product/baseTrademark/save`,
      method: "post",
      data: trademarkinfo
    })
  }
}

/* 
  API: /admin/product/baseTrademark/remove/{id}
  Method: DELETE
*/

export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: "DELETE"
})
