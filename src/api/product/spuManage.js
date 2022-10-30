import request from '@/utils/request'
/* 
  API: /admin/product/{page}/{limit}
  Method: GET
*/
export const reqGetSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: "get",
  params: {
    category3Id
  }
})

/* 
  API: /admin/product/baseTrademark/getTrademarkList
  Method: GET
*/
// 获取品牌信息
export const reqGetTradeMark = () => request({
  url: `/admin/product/baseTrademark/getTrademarkList`,
  method: "get"
})

/* 
  API: /admin/product/baseSaleAttrList
  Method: GET
*/
// 获取平台所有销售属性
export const reqGetBaseSaleAttrList = () => request({
  url: `/admin/product/baseSaleAttrList`,
  method: "get"
})

/* 
  API: /admin/product/getSpuById/{spuId}
  Method: GET
*/
// 根据 id 获取 spu 数据
export const reqGetSpuById = (spuId) => request({
  url: `/admin/product/getSpuById/${spuId}`,
  method: "get"
})

/* 
  API: /admin/product/spuImageList/{spuId}
  Method: GET
*/
// 根据 id 获取 spu 数据
export const reqGetSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: "get"
})

/* 
  API: 
    1. POST /admin/product/updateSpuInfo
    2. POST /admin/product/saveSpuInfo
  Method: POST
*/
// 编辑或添加 spu 信息数据保存
export const reqAddOrEditSpuSave = (spuInfo) => {
  if (spuInfo.id) {
    return request({
      url: `/admin/product/updateSpuInfo`,
      method: 'post',
      data: spuInfo
    })
  } else {
    return request({
      url: `/admin/product/saveSpuInfo`,
      method: 'post',
      data: spuInfo
    })
  }
}

/* 
  API: /admin/product/deleteSpu/{spuId}
  Method: DELETE
*/
// 根据 id 删除场景 0 spu 数据
export const reqDelteSpuById = (spuId) => request({
  url: `/admin/product/deleteSpu/${spuId}`,
  method: "DELETE"
})

/* 
 ---------------------------------------------------------------------------
*/

/* 
1. 根据 Id 获取图片数据 GET /admin/product/spuImageList/{spuId}
2. 根据 Id 获取销售属性 GET /admin/product/spuSaleAttrList/{spuId}
3. 根据 Id 获取平台属性 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
*/

/* 
  API: /admin/product/spuSaleAttrList/{spuId}
  Method: GET
*/
// 根据 Id 获取销售属性
export const reqGetSpuSaleAttrList = (spuId) => request({
  url: `/admin/product/spuSaleAttrList/${spuId}`,
  method: "GET"
})

/* 
  API: /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  Method: GET
*/
// 根据 Id 获取平台属性
export const reqGetAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: "GET"
})

/* 
  API: /admin/product/saveSkuInfo
  Method: POST
*/
// 保存数据
export const reqSaveSkuInfo = (skuInfo) => request({
  url: `/admin/product/saveSkuInfo`,
  method: "POST",
  data: skuInfo
})



/* 
  API: /admin/product/findBySpuId/{spuId}
  Method: GET 
*/
// 保存数据
export const reqGetSkuById = (spuId) => request({
  url: `/admin/product/findBySpuId/${spuId}`,
  method: "GET",
})
