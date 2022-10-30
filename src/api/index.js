// 统一暴露接口，并挂载在 vue 原型上

import * as trademark from "@/api/product/tradeMark"
import * as attrmanage from "@/api/product/attrManage"
import * as spumanage from "@/api/product/spuManage"
import * as skumanage from "@/api/product/skuManage"

export default {
  trademark,
  attrmanage,
  spumanage,
  skumanage
}
