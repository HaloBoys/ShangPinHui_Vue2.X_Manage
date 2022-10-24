import request from '@/utils/request'
/* 
  API: /admin/product/getCategory1
  Method: GET
*/
export const reqGetCategory1 = () => request({
  url: `/admin/product/getCategory1`,
  method: "get"
})

/* 
  API: /admin/product/getCategory2/{category1Id}
  Method: GET
*/
export const reqGetCategory2 = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: "get"
})

/* 
  API: /admin/product/getCategory3/{category2Id}
  Method: GET
*/
export const reqGetCategory3 = (category2Id) => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: "get"
})

/* 
  API: /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  Method: GET
*/

export const reqGetAttrInfoList = (catInfo) => request({
  url: `/admin/product/attrInfoList/${catInfo.catList1id}/${catInfo.catList2id}/${catInfo.catList3id}`,
  method: "get"
})

/* 
  API: /admin/product/saveAttrInfo
  Method: POST
  参数格式:
  {
    "attrName": "string",
    "attrValueList": [
      {
        "attrId": 0,
        "valueName": "string"
      }
    ],
    "categoryId": 0,
    "categoryLevel": 0,
  }
*/

export const reqaddOrUpdateAttrSave = (data) => request({
  url: `/admin/product/saveAttrInfo`,
  method: "post",
  data
})
