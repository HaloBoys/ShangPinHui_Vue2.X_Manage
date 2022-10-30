# 尚品汇后台管理端

后台管理端：可以让用户通过一个可视化工具，可以实现对于数据库进行增删改查的操作。

尚品汇后台管理项目教程：https://www.bilibili.com/video/BV1Vf4y1T7bw?p=122&vd_source=3ed70d49b47a074637711a68e7f42b04

## vue-admin-template

[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 是一个 vue2.x 管理模板，本项目基于此模板`二次开发`。

## API 接口文档

- http://39.98.123.211:8170/swagger-ui.html
- http://39.98.123.211:8510/swagger-ui.html

### 项目接口配置

项目中的接口统一写在 api 文件夹，为了方便管理进行如下操作：

1. 创建 `api>index.js`，将各个模块的 API 统一暴露
2. 在 `main.js` 中将 `api>index.js` 挂载到原型：
3. 所有组件的实例都可以通过 `$API.xxx` 发起请求

### 配置代理跨域

编辑 `vue.config.js` 中的 devServer：

```javascript
proxy: {
  "/dev-api": {
    target: "http://gmall-h5-api.atguigu.cn:80",
    pathRewrite: {"^/dev-api" : ""}
  }
}
```

devServer.proxy：https://www.webpackjs.com/configuration/dev-server/#devserver-proxy

## 目录结构

# 插件相关

## Element-UI

### 表单自定义校验规则



# 项目路由搭建

## views 目录结构

## 路由配置

# 全局组件封装

## 三级联动

![20221025104220](https://raw.githubusercontent.com/HaloBoys/PicGoMyDevice/main/img/20221025104220.png)

```html
<template>
  <div>
    <el-form :inline="true" :model="catInfo" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="catInfo.catList1id"
          placeholder="请选择"
          @change="catList1Handler"
          :disabled="iscontrol"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in catList1"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="catInfo.catList2id"
          placeholder="请选择"
          @change="catList2Handler"
          :disabled="iscontrol"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in catList2"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="catInfo.catList3id"
          placeholder="请选择"
          @change="catList3Handler"
          :disabled="iscontrol"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in catList3"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",

  data() {
    return {
      formInline: {
        region: "",
      },
      // 服务器获取的1~3级分类列表
      catList1: [],
      catList2: [],
      catList3: [],
      // el-form 数据绑定源
      catInfo: {
        // 选中的 id
        catList1id: "",
        catList2id: "",
        catList3id: "",
      },
    };
  },
  props: ["iscontrol"],
  mounted() {
    this.getCategory1();
  },
  methods: {
    async getCategory1() {
      let res = await this.$API.attrmanage.reqGetCategory1();
      if (res.code == 200) {
        this.catList1 = res.data;
      }
    },
    async catList1Handler() {
      let { catList1id } = this.catInfo;
      this.$emit("getCategoryId", { catListid: catList1id, level: 1 });
      // 二次选择清空逻辑
      this.catList2 = [];
      this.catList3 = [];
      this.catInfo.catList2id = "";
      this.catInfo.catList3id = "";
      let res = await this.$API.attrmanage.reqGetCategory2(catList1id);
      if (res.code == 200) {
        this.catList2 = res.data;
      }
    },
    async catList2Handler() {
      let { catList2id } = this.catInfo;
      this.$emit("getCategoryId", { catListid: catList2id, level: 2 });
      // 二次选择清空逻辑
      this.catList3 = [];
      this.catInfo.catList3id = "";
      let res = await this.$API.attrmanage.reqGetCategory3(catList2id);
      if (res.code == 200) {
        this.catList3 = res.data;
      }
    },
    catList3Handler() {
      let { catList3id } = this.catInfo;
      this.$emit("getCategoryId", { catListid: catList3id, level: 3 });
    },
  },
};
</script>
```

# 登录与退出登录

## API

1. 将 `api>user.js` 中的相关接口地址换成项目的接口地址
2. 编辑 `utils>request.js` 
将请求拦截器中 X-Token 换成 token 字段
将响应拦截器中状态码判断逻辑更换 `if (res.code !== 20000 && res.code != 200)`

## 登录

用户登录 actions 重构成 async await 写法

```javascript
async login({
 commit
}, userInfo) {
 const {
   username,
   password
 } = userInfo
 let res = await login({
   username: username.trim(),
   password: password
 });
 if (res.code == 200 || res.code == 20000) {
   commit('SET_TOKEN', res.data.token)
   setToken(res.data.token)
 } else {
   return Promise.reject(new Error(res.message))
 }
},
```

## 退出登录

将 Navbar 组件中退出登录文字替换即可

# 商品管理

## 品牌管理

### 请求品牌列表 API

1. 在 api 文件夹下创建 `product> tradeMark.js`
2. 编写请求品牌列表接口：`/admin/product/baseTrademark/{page}/{limit}`
```javascript
import request from '@/utils/request'
/* 
  API: /admin/product/baseTrademark/{page}/{limit}
  Method: GET
*/
export const reqTradeMarkList = (page,limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: "get"
})
```
3. 在 tradeMark 组件中将请求品牌列表接口封装成一个 method，在 mounted 钩子函数中调用该 method
4. data 中定义并初始化变量（传递给服务器的参数与服务器返回的数据）
   1. page（第几页）
   2. limit（当前页展示的数据条数）
   3. total（服务器返回的总共数据条数）
   4. list（服务器返回的品牌列表数据）

### el-table 组件渲染数据

> el-table 组件展示的数据是以一列一列进行展示

1. 将 el-table 组件的 data 属性与服务器返回的 list 品牌列表数据(数组) 进行绑定
2. 序号: el-table-column 指定 `type="index"` 可以展示索引
3. 品牌：通过 el-table-column 的 prop 属性 指定服务器返回的属性即可
4. Logo: (展示图片)
   1. 使用作用域插槽
   2. img 展示插槽回传的数据
5. 操作：
   1. 使用作用域插槽
   2. 编辑按钮
   3. 删除按钮

### el-pagination 分页数据绑定

1. 相关数据跟data绑定
2. 事件
   1. @size-change 每页条数
   2. @current-change 当前页码

### dialog

添加/修改品牌对话框(复用)

> `:title="tradeInfo.id ? '修改品牌' : '添加品牌'"`

1. 添加/修改点击事件，控制 dialog 显示 `dialogFormVisible`
2. dialog 中：
   1. input
   2. upload

### 添加/修改品牌 API

添加/修改品牌 API：(复用)

两个接口的区别：修改需要携带 id，添加不用
添加：/admin/product/baseTrademark/save
修改：/admin/product/baseTrademark/update

```javascript
// tradeMark.js

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
```

### 添加品牌

1. 收集品牌相关数据（品牌名称和品牌logo）
   1. 品牌名称: form 绑定 :model="xxx" 将用户输入绑定到 data 的对象中，xxx 是一个对象，里面的属性根据接口来写
   2. 品牌logo 使用 upload 插件收集的，upload 相关属性：
      1. action：上传的地址 （`/dev-api/admin/product/fileUpload`）
      2. :on-success="handleAvatarSuccess" 上传成功的回调，在回调里面可以接收到服务器返回上传成功的地址
3. 将 data 对象中收集到的数据作为添加/修改品牌 API的参数发起请求
4. 成功之后将数据清空
```javascript
async addOrUpdateConfirm() {
  this.dialogFormVisible = false;
  let res = await this.$API.trademark.reqAddOrUpdateTradeMark(
    this.tradeInfo
  );
  if (res.code == 200) {
    this.$message.success(
      this.tradeInfo.id ? "修改品牌成功" : "添加品牌成功"
    );
    // 刷新列表
    this.getTradeMarkList();
    this.tradeInfo = { tmName: "", logoUrl: "" };
  } else {
    this.$message.error(
      this.tradeInfo.id ? "修改品牌失败" : "添加品牌失败"
    );
  }
},
```

### 修改品牌

1. 作用域插槽中的 row 就是对应品牌的信息，传递给修改对应的回调
2. 在回调中将对应的值同步到 data 进行展示（注意此处`浅拷贝`，防止表格数据直接被修改）
3. 点击确定刷新列表时，保持之前的页码
4. dialog title 根据 tradeInfo 中是否包含 id 动态展示 `:title="tradeInfo.id ? '修改品牌' : '添加品牌'"`

### dialog 表单验证

> Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可

1. 编写 rules 表单验证规则
```javascript
// dialog 表单验证规则
rules: {
  tmName: [
    { required: true, message: "请输入品牌名称", trigger: "change" },
    {
      min: 1,
      max: 10,
      message: "长度在 1 到 10 个字符",
      trigger: "change",
    },
  ],
  logoUrl: [{ required: true, message: "请上传品牌Logo" }],
},
```
2. Form-Item prop 属性设置为需校验的字段名
3. 在确定按钮的回调函数中进行判断，如果表单校验成功则发送请求
   1. 给 Form 标识一个 ref
   2. 获取表单，并通过 validate 回调函数返回的布尔值判断表单验证是否通过
```javascript
this.$refs.trademarkForm.validate(async (valid) => {
  // 校验成功
  if (valid) {
    this.dialogFormVisible = false;
    let res = await this.$API.trademark.reqAddOrUpdateTradeMark(
      this.tradeInfo
    );
    if (res.code == 200) {
      this.$message.success(
        this.tradeInfo.id ? "修改品牌成功" : "添加品牌成功"
      );
      // 刷新列表
      this.getTradeMarkList();
      this.tradeInfo = { tmName: "", logoUrl: "" };
    } else {
      this.$message.error(
        this.tradeInfo.id ? "修改品牌失败" : "添加品牌失败"
      );
    }
  } else {
    // 校验失败
    console.log("error submit!!");
    return false;
  }
});
```

### 删除品牌

1. 编写删除品牌接口。（API: /admin/product/baseTrademark/remove/{id} method: DELETE)
2. 删除回调传递作用域插槽中的 row （品牌信息）
3. messagebox 弹出框确认删除中调用接口。

## 属性管理

### 三级联动动态数据

1. 编写获取分类相关 API（二级分类根据一级分类id获取，三级分类根据二级分类id获取）
   1. GET /admin/product/getCategory1
   2. GET /admin/product/getCategory2/{category1Id}
   3. GET /admin/product/getCategory3/{category2Id}
2. 三级联动组件 mounted 生命周期函数中调用获取一级分类方法，获取的数据存储在 data 中
3. el-option 组件循环渲染数据展示，并通过 el-option 的 `:value` 属性收集一级分类的 id，保存于 data 自定义对象中，el-select v-model 绑定这个 id
4. 一级分类 el-option 绑定 change 事件，事件回调中根据 id 获取二级分类列表并渲染
5. 二级分类 el-option 绑定 change 事件，事件回调中根据 id 获取三级分类列表并渲染
6. 三级分类 el-option 绑定 change 事件
7. 一二级分类`二次选择清空逻辑`
   1. 当一级分类发生变化，清空二三级数据列表与 id
   2. 当二级分类发生变化，清空三级数据列表与 id

### 获取分类属性

商品基础属性接口 API: /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
Method: GET

1. 分类 change 事件回调中将分类 id 通过`自定义事件`发送给父组件，并`加上标识`用于区分一二三级分类
2. attrManage 父组件在自定义事件回调中接收到传过来的 id，并保存，
3. 收集完毕，调用接口请求数据
4. 数据在 attrManage 组件表格中展示

### 添加属性按钮功能

1. 禁用效果：三级分类 id 没有的情况下，禁用状态。
2. 点击添加按钮 attrManage 表格组件隐藏，添加属性组件显示（使用变量控制）

### 收集组件中的属性

![20221024104532](https://raw.githubusercontent.com/HaloBoys/PicGoMyDevice/main/img/20221024104532.png)

添加属性与属性值接口 API: /admin/product/saveAttrInfo
Method: POST
参数描述：（saveAttrInfo）
```json
{
  "attrName": "string", // 属性名
  // 相关属性值列表
  "attrValueList": [
    {
      "attrId": 0, // 属性名的 id (归属于哪个属性名)
      "valueName": "string" // 属性值
    }
  ],
  "categoryId": 0, // 分类3 id
  "categoryLevel": 3,
}
```

收集属性逻辑：

1. 收集属性名
   1. v-model 双向绑定到 data 中
2. 收集属性值
   1. 属性值表格数据 data 绑定到 attrValueList，表格根据 attrValueList 数组内容而呈现
   2. 属性值名称使用作用域插槽回传 attrValueList 中对应元素，插槽中放 el-input 数据双向绑定到回传数据的 valueName 属性
   3. 添加属性值按钮
      1. 禁用条件：`:disabled="!attrInfo.attrName.trim().length"`
      2. 点击事件 attrValueList push 一个新元素 `{ attrId: undefined, valueName: "",}`

### 取消按钮数据回显问题

> 解决添加属性操作中，上次的数据遗留问题

1. 给添加属性按钮绑定事件
2. 回调函数中初始化data中的数据
```javascript
addAttrHandler() {
  this.isShowAttrInfo = true;
  this.attrInfo = {
    attrName: "",
    attrValueList: [],
    // 注意此处的三级分类 id 只能在这里获取，不能在 data 中获取，因为对象中的数据是无序排列的
    categoryId: this.catInfo.catList3id,
    categoryLevel: 0,
  };
},
```

### 修改属性操作

1. 修改属性按钮添加回调，传入作用域插槽中的 row 对象
2. 将传过来的对象**深拷贝**，并赋值给 attrInfo (注意此处不能直接赋值,否则他们用的都是同一个地址)

### 查看模式与编辑模式操作

编辑并添加属性值操作: 新添加的属性值 id 应该为`对应编辑的属性值 id`: 

```javascript
this.attrInfo.attrValueList.push({
  // attrId: undefined,
  attrId: this.attrInfo.id,
  valueName: "",
});
```

#### 编辑模式与查看模式

属性值名称编辑模式与查看模式（input or span 切换）:

1. 定义变量：flag (注意这个变量不能定义在 data 中，而是定义在添加的属性值对象上)
   1. input 失去焦点（`@blur`）或者回车（`@keyup.native.enter`） 对应属性值对象 flag 改变状态
   2. span 点击事件，对应属性值对象 flag 改变状态
2. 使用 v-if 与 v-else 属性值对象身上变量 flag 切换 input or span 显示模式

#### 编辑模式优化

1. 编辑模式下之前的属性没有 flag
   1. 编辑事件回调中是直接对服务器的数据进行了深拷贝，而服务器数据中没有我们自定义的 flag 属性
   2. 深拷贝之后，对拷贝过来的对象进行遍历，使用 `$set` 方法对对象添加响应式数据。
2. 由编辑模式切换查看模式 input 输入框内容判断
   1. 不能为空
      1. input 失去焦点（`@blur`）回调函数中对 row 的值进行判断
      2. 如果为空，就直接 return 一个弹出框提示用户
   2. 不能有重复的属性值
      1. input 失去焦点（`@blur`）回调函数中对整个数组使用 some 方法进行判断（`排除自身`进行判断, 用自身的这个元素和数组中每一个元素比较）
      2. 如果结果为 false 则说明有重复的元素，return 一个弹出框提示用户

```javascript
// 属性值表单失去焦点事件 (写的太优雅!)
attrInfoBlurHandler(row) {
  // 属性值不能为空判断
  if (!row.valueName.trim()) {
    return this.$message("属性值不能为空！");
  }
  // 不能有重复的属性值判断
  let isRepeat = this.attrInfo.attrValueList.some((item) => {
    // 排除自身进行判断
    if (row != item) {
      // 返回的是一个布尔值
      return item.valueName == row.valueName;
    }
  });
  if (isRepeat) {
    // 删除这个重复的元素
    this.attrInfo.attrValueList.pop();
    return this.$message.error("属性值不能重复！");
  }
  row.flag = false;
},
```

#### 表单元素自动聚焦

由查看模式切换为编辑模式自动聚焦：

1. 给 input 元素打一个 ref 属性，属性值是 $index
2. 点击 span 标签回调函数中传入$index索引，用于获取 input 标签
3. 在 `nextTick 函数`中获取 input 并调用 focus 方法

点击添加属性值按钮自动聚焦：

1. 在添加属性值按钮回调函数中使用 nextTick 方法获取当前属性列表`数组中最后一个 input 元素`。
2. 为最后一个 input 元素调用 focus 方法

### 删除属性名称

API: 

```javascript
/* 
  API: /admin/product/deleteAttr/{attrId}
  Method: DELETE
*/

export const reqDeleteAttr = (attrId) => request({
  url: `/admin/product/deleteAttr/${attrId}`,
  method: "DELETE"
})
```

删除属性名称按钮绑定事件,并传入要删除的 attrId 调用接口

### 删除属性值名称

1. 删除点击弹出 Popconfirm 气泡确认框组件
```html
<el-table-column prop="prop" label="操作" width="width">
  <template slot-scope="{ row, $index }">
    <el-popconfirm
      :title="`确定删除${row.valueName}?`"
      @onConfirm="attrInfoDeleteHandler($index)"
    >
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="mini"
        slot="reference"
      ></el-button>
    </el-popconfirm>
  </template>
</el-table-column>
```
2. 回调函数中根据索引删除数组对应元素
```javascript
attrInfoDeleteHandler(index) {
  this.attrInfo.attrValueList.splice(index, 1);
},
```

### 添加属性与修改属性保存操作

#### 保存数据API

```javascript

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
```

#### 保存操作逻辑

保存按钮中对数据进行`整理`

1. 如果属性值为空，则不需要提交给服务器
2. 不需要传递 flag 属性

```javascript
// 保存按钮
async addOrUpdateAttrSave() {
  /* 
  整理参数
    1. 如果属性值为空，则不需要提交给服务器
    2. 不需要传递 flag 属性
  */
  this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
    (item) => {
      if (!item.valueName == "") {
        delete item.flag;
        return true;
      }
    }
  );
  // 发请求
  try {
    let res = await this.$API.attrmanage.reqaddOrUpdateAttrSave(
      this.attrInfo
    );
    if (res.code == 200) {
      this.getAttrInfoList();
      this.$message.success("保存成功!");
      this.isShowAttrInfo = true;
    }
  } catch (error) {
    this.$message.error("保存失败!");
  }
},
```

### 最后优化

#### 三级联动禁用状态

当点击添加属性,展示属性表格隐藏的时候,三级联动禁用

1. 通过 `props` 将 `isShowAttrInfo` (控制属性表格显示与隐藏) 的变量`取反`传递给三级联动组件
2. 三级联动组件 el-select 的禁用状态`通过这个变量来控制`

#### 保存按钮禁用状态

如果属性值列表为空,则保存按钮为禁用状态 `:disabled="attrInfo.attrValueList.length < 1"`

## SPU 管理

### 静态组件

![20221026223510](https://raw.githubusercontent.com/HaloBoys/PicGoMyDevice/main/img/20221026223510.png)

顶部：三级联动

底部：底部会有三部分进行切换: 通过定义数字 scene: `0 1 2` 来判断加载哪个场景

1. SPU 列表结构【场景0】
   1. 索引
   2. SPU 名称
   3. SPU 描述
   4. 操作(按钮)
      1. 添加
      2. 编辑
      3. 信息
      4. 删除
   5. 分页
2. 添加 / 修改 SPU (拆分成一个组件)【场景1】
   1. SPU名称
   2. 品牌
   3. SPU描述
   4. SPU图片（照片墙）
   5. 销售属性
   6. 保存/取消按钮
3. 添加 SKU (拆分成一个组件)【场景2】
   1. SPU名称
   2. SKU名称
   3. 价格（元）
   4. 重量（千克）
   5. 规格描述
   6. 平台属性
   7. 销售属性
   8. 图片列表
   9.  保存/取消按钮

### SPU 列表结构

#### API

```javascript
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
```

#### 展示逻辑

1. 三级分类选择完成调用接口，获取数据，渲染数据
2. SPU 列表操作按钮有鼠标 hover 提示效果.（两种方案）
   1. 使用 el-tooltip 组件包裹按钮
   2. 封装自定义按钮组件。`HintButton`
3. 分页器数据绑定事件绑定

#### 信息 info

接口：GET /admin/product/findBySpuId/{spuId}

点击 info 按钮会通过 dialog 对话框展示当前 spu 的 所有 sku

1. dialog 嵌套表格
2. title 动态
3. 根据 spu id 信息发请求获取 sku 列表数据
4. 保存数据，渲染数据

loading 效果：

> Loading 加载 https://element.eleme.cn/#/zh-CN/component/loading



#### 删除 SPU

删除场景 0 中的数据

1. 点击删除按钮传递 Row，（根据row中的spuid删除数据）
2. 在回调中发送请求删除数据
3. 删除成功后重新获取列表数据

### 添加 / 修改 SPU 组件数据请求与绑定【难点】

#### 修改 SPU 组件数据获取与展示逻辑

数据获取：

1. 点击修改按钮 spuEdit 子组件需要发送四个请求：
   1. 品牌信息 数据：GET /admin/product/baseTrademark/getTrademarkList
   2. 获取平台所有销售属性：GET /admin/product/baseSaleAttrList
   3. 根据 id 获取spu数据：GET /admin/product/getSpuById/{spuId}
   4. 根据 id 获取spu图片：GET /admin/product/spuImageList/{spuId}
2. 取消按钮点击事件：展示 `scene：0` SPU 列表结构场景
   1. 通过自定义事件将数字 0 传递给父组件，父组件同步到 data
3. spuEdit 子组件什么时候发请求？（不可以在mounted生命周期中发，因为只会执行一次。）
   1. 在编辑按钮事件中发请求。（每次点击都会发请求）
   2. 给 spuEdit 子组件打一个 ref
   3. 在编辑按钮事件回调中获取子组件，调用组件身上初始化数据的接口函数（注意此处用了 v-if 展示子组件，所以需要使用 nextTick 函数获取，否则获取不到）

数据展示：

> 此处不仅要考虑`如何展示数据`，还要考虑`如何收集数据`

整个表单数据绑定到 spuInfo 对象上：`:model="spuInfo"`

1. SPU名称
   1. v-model
2. 品牌
   1. `el-select` 收集到的数据双向绑定到 `spuInfo.tmId` 中
   2. 循环渲染数据源为 tradeMarkList，收集的数据为 item.id
3. SPU描述
   1. 双向数据绑定到 `spuInfo.description` 字段
4. SPU图片（照片墙）
   1. 数据展示
      1. 需要使用 `:file-list="spuImages"` 字段指定要展示的数据源，
         1. fileList 是一个数组对象
         2. 对象中包含两个属性：name url
      2. 而服务器返回的数据中没有这两个属性，所以在保存服务器返回的数据之前，需要对数据进行处理，加上 name url 字段
   2. 图片数据收集
      1. 照片墙删除事件：`:on-remove="handleRemove"` 会注入两个参数：file(被删除的元素)、fileList(删除后剩余的元素) 将 fileList(删除后剩余的元素) 保存在 data 中
      2. 照片墙上传图片：`:on-success="handleSpuImgSuccess"` 会注入三个参数：response、file、filelist 其中 filelist 是上传成功后所有的图片数据，将其保存在 data 中
      3. 数据整理
5. 销售属性【难点】
   1. 销售属性 select 选择【展示】
      1. 使用计算属性: 计算出还没有被选中的销售属性(平台一共有三个属性)使用计算出来的数据进行渲染，数据绑定在变量：spuSaleAttr
      ```html
      <el-select v-model="spuSaleAttr" :placeholder="`还有${getNoSelectSaleAttr.length}个属性`">
      <el-option
        v-for="item in getNoSelectSaleAttr"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
      </el-select>
      ```
      ```javascript
      computed: {
      getNoSelectSaleAttr() {
        let res = this.baseSaleAttrList.filter((item1) => {
          return this.spuInfo.spuSaleAttrList.every((item2) => {
            return item2.saleAttrName != item1.name;
          });
        });
        return res;
      },
      },
      ```
      2. 添加销售属性按钮禁用事件：`:disabled="!spuSaleAttr"` (spuSaleAttr 是 el-select 双向绑定的变量，el-select 没有选中属性，按钮就是禁用状态)
   2. table 组件【展示】: 已有销售属性(数据源绑定到 spuInfo.spuSaleAttrList)
      1. 属性名
      2. 属性名称列表
         1. 使用 Tag 动态编辑标签组件展示
         2. Tag 标签中的 input 和 按钮之间的切换
      3. 操作
   3. 销售属性操作
      1. 添加销售属性名
         1. 收集 el-select 双向绑定的数据：`:value="`${item.id}:${item.name}`"`
         2. 添加销售属性按钮点击事件：
            1. 对以上收集到的数据进行处理（split(":")）
            2. 处理完成后将数据添加到 `属性名 el-table` 的数据源上: `spuInfo.spuSaleAttrList`(pushh)
         3. 相关字段
            1. baseSaleAttrId
            2. saleAttrName
            3. spuSaleAttrValueList
      2. 展示 / 收集销售属性值
         1. `+ New Tag` 按钮点击事件：
            1. 给每一个 row 添加一个 `inputVisible` 属性，用于控制 input 和 span 状态的切换（注意此处要用 $set 方法为 row 添加响应式数据）
            2. 收集用户输入 input 中的数据（注意此处要用 $set 方法为 `row` 添加响应式数据）数据双向绑定到这个响应式数据
         2. input 失去焦点：
            1. inputVisible 属性为 false（由输入框变为 span）
            2. 将 input 中的数据整合并添加到  el-tag 绑定的数据源，字段格式：
               1. baseSaleAttrId
               2. saleAttrValueName
         3. input 失去焦点数据校验：
            1. 属性值不能为空
            2. 属性值不能重复
   4. 删除操作
      1. 删除 Tag
         1. 使用 splice 方法根据索引删除 `row.spuSaleAttrValueList` 数组中的数据
      2. 删除整个 Row
         1. 使用 splice 方法根据索引删除 spuSaleAttrList 数组中的数据
6. 三级联动操作性
   1. 除了场景 0 以外都不可以操作三级联动
7. 保存操作
   1. 修改和添加 SPU 封装成同一个请求（除了添加 SPU 接口参数`不携带 id` 外，其他参数都和修改接口一样）
      1. POST /admin/product/updateSpuInfo
      2. POST /admin/product/saveSpuInfo
   2. 整理参数【难点】
      1. 对照片墙收集到的数据进行整理
         1. 必须有 `imgName` 和 `imgUrl` 字段，新上传的图片没有这两个字段（但是有 name 和 url 字段），所以需要对新上传的数据进行处理。
         2. 使用数组 map 方法对原数组进行处理，返回处理后的数组，覆盖原数组
   3. 发请求
   4. 弹出 message 并回到场景 0，然后父组件中刷新场景 0 中的数据

#### 添加 SPU 数据逻辑

因为添加 SPU 中 spuInfo 对象没有被初始化是空对象。不利于后期收集数据，所以在 data 中直接将 spuInfo 对象根据接口参数初始化。
```json
{
  "category3Id": 0,
  "description": "string",
  "spuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "spuId": 0
    }
  ],
  "spuName": "string",
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "id": 0,
      "saleAttrName": "string",
      "spuId": 0,
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "id": 0,
          "isChecked": "string",
          "saleAttrName": "string",
          "saleAttrValueName": "string",
          "spuId": 0
        }
      ]
    }
  ],
  "tmId": ""
}
```

添加 SPU 数据

1. 点击添加按钮 spuEdit 子组件需要发送两个请求初始化组件 select：
   1. 品牌信息 数据：GET /admin/product/baseTrademark/getTrademarkList
   2. 获取平台所有销售属性：GET /admin/product/baseSaleAttrList
2. 三级分类 id 传递给子组件，初始化 data 中的数据
3. 添加完成后跳转到场景 0 的 第一页

### 添加 SKU

1. 传递参数 `row` 和 `categoryId` 并切换为场景 2
2. 父组件通知子组件（ref获取子节点调用方法）发送请求初始化组件数据
   1. 根据 Id 获取图片数据 GET /admin/product/spuImageList/{spuId}
   2. 根据 Id 获取销售属性 GET /admin/product/spuSaleAttrList/{spuId}
   3. 根据 Id 获取平台属性 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
3. 将接口请求的数据分别保存在 data 中
4. 数据展示与收集
   1. SPU名称
   2. SKU名称
   3. 价格（元）
      1. type = "number"
   4. 重量（千克）
   5. 规格描述
   6. 平台属性 【难点】
      1. 有两个 select 数据是动态的（使用循环渲染出来）
      2. 使用模板字符串`收集到平台属性对象身上`
   7. 销售属性
      1. 使用循环渲染
      2. 使用模板字符串`收集到平台属性对象身上`
   8. 图片列表（数据展示与收集）
      1. 绑定数据源，使用 table 渲染
      2. selection 的事件获取被勾选的 row（数组）存储在 data 中需要收集发给服务器的参数：
         1. imgName 
         2. imgurl
         3. spuImgId
         4. isDefault（控制是不是默认图片）
      3. 图片使用作用域插槽读取展示
      4. 两个按钮（设为默认、默认）
         1. 数据默认没有 isDefault 字段，所以在服务器返回数据存储之前，对数据进行处理，添加 isDefault 字段：默认值为 0
         2. 按钮根据 isDefault 字段的值进行 v-if 展示
         3. 按钮点击事件，使用排他操作（只能有一张图片设置为默认图）
         4. 收集默认图片地址
   9.  保存/取消按钮
       1. 保存：发请求
       2. 取消: 切换场景【清除数据】
5. 保存 SKU
   1. 接口：POST /admin/product/saveSkuInfo
   2. 参数格式：
  ```json
  {
    "category3Id": 0,
    "createTime": "2022-10-22T13:40:27.515Z",
    "id": 0,
    "isSale": 0,
    "price": 0,
    "skuAttrValueList": [
      {
        "attrId": 0,
        "attrName": "string",
        "id": 0,
        "skuId": 0,
        "valueId": 0,
        "valueName": "string"
      }
    ],
    "skuDefaultImg": "string",
    "skuDesc": "string",
    "skuImageList": [
      {
        "id": 0,
        "imgName": "string",
        "imgUrl": "string",
        "isDefault": "string",
        "skuId": 0,
        "spuImgId": 0
      }
    ],
    "skuName": "string",
    "skuSaleAttrValueList": [
      {
        "id": 0,
        "saleAttrId": 0,
        "saleAttrName": "string",
        "saleAttrValueId": 0,
        "saleAttrValueName": "string",
        "skuId": 0,
        "spuId": 0
      }
    ],
    "spuId": 0,
    "tmId": 0,
    "weight": "string"
  }
  ```
   3. 整理参数【难点】
      1. 平台属性数据整理
         1. forEach
         2. reduce
      2. 销售属性数据整理
         1. forEach
         2. reduce
      3. 图片数据整理

## SKU 管理

### 静态组件

1. el-table 展示数据，相关字段：
   1. 序号
   2. 名称
   3. 描述
   4. 默认图片
   5. 重量（KG)
   6. 价格（元）
   7. 操作
      1. 上架 （根据 row.isSale 属性展示）
      2. 下架 （根据 row.isSale 属性展示）
      3. 编辑
         1. 正在开发中..
      4. 信息
      5. 删除
2. 分页

### 渲染数据

1. 接口：GET /admin/product/list/{page}/{limit}
2. 初始化页码参数并绑定到 pagination
3. 根据参数调用接口发送请求
4. el-table 操作区域按钮
   1. 上下架操作
      1. 接口：
         1. GET /admin/product/onSale/{skuId}
         2. GET /admin/product/cancelSale/{skuId}
   2. 信息按钮
      1. Drawer 抽屉进行展示