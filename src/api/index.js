// 统一暴露接口，并挂载在 vue 原型上

import * as trademark from "@/api/product/tradeMark"
import * as attrmanage from "@/api/product/attrManage"

export default {
  trademark,
  attrmanage
}
