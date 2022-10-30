import request from '@/utils/request'
/* 
  API: /admin/product/list/{page}/{limit}
  Method: GET
*/
export const reqGetSkuAllList = (page, limit) => request({
  url: `/admin/product/list/${page}/${limit}`,
  method: "get"
})

/* 
  API: /admin/product/onSale/{skuId}
  Method: GET
*/
export const reqOnSale = (skuId) => request({
  url: `/admin/product/onSale/${skuId}`,
  method: "get"
})

/* 
  API: /admin/product/cancelSale/{skuId}
  Method: GET
*/
export const reqCancelSale = (skuId) => request({
  url: `/admin/product/cancelSale/${skuId}`,
  method: "get"
})

/* 
  API: /admin/product/getSkuById/{skuId}
  Method: GET
*/
export const reqGetSkuById = (skuId) => request({
  url: `/admin/product/getSkuById/${skuId}`,
  method: "get"
})

/* 
  API: /admin/product/deleteSku/{skuId}
  Method: DELETE
*/
export const reqDeleteSkuById = (skuId) => request({
  url: `/admin/product/deleteSku/${skuId}`,
  method: "DELETE"
})
