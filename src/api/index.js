// 统一暴露接口，并挂载在 vue 原型上

import * as trademark from "@/api/product/tradeMark"
import * as attrmanage from "@/api/product/attrManage"
import * as spumanage from "@/api/product/spuManage"
import * as skumanage from "@/api/product/skuManage"

//引入权限相关的接口文件
import * as user from './acl/user';
import role from './acl/role';
import permission from './acl/permission'

export default {
  trademark,
  attrmanage,
  spumanage,
  skumanage,
  user,
  role,
  permission
}
