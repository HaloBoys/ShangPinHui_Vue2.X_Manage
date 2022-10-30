<template>
  <div>
    <el-card class="el_card">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :iscontrol="!isShowAttrInfo"
      ></CategorySelect>
    </el-card>
    <el-card class="el_card">
      <el-button
        type="primary"
        style="margin-bottom: 15px"
        :disabled="!catInfo.catList3id"
        @click="addAttrHandler"
        >添加属性</el-button
      >
      <!-- 展示属性列表 -->
      <div v-show="isShowAttrInfo">
        <el-table :data="attrInfoList" style="width: 100%" border>
          <el-table-column type="index" label="索引" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="item in row.attrValueList"
                :key="item.id"
                style="margin: 7px"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                style="margin-right: 15px"
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="editAttrInfo(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.attrName}?`"
                @onConfirm="deleteAttrInfo(row)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性相关表单 -->
      <div v-show="!isShowAttrInfo">
        <el-form :inline="true" class="demo-form-inline" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          :disabled="!attrInfo.attrName.trim().length"
          @click="addAttrValHandler"
          ref="addAttr"
          >添加属性值</el-button
        >
        <el-button @click="isShowAttrInfo = !isShowAttrInfo">取消</el-button>

        <!-- 添加、修改属性表格 -->
        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%; margin-top: 15px; margin-bottom: 15px"
          border
        >
          <el-table-column type="index" label="索引" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.flag"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="attrInfoBlurHandler(row)"
                @keyup.native.enter="attrInfoBlurHandler(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                style="display: block; padding: 0 15px"
                @click="attrInfoClickHandler(row, $index)"
              >
                {{ row.valueName }}
              </span>
            </template>
          </el-table-column>
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
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttrSave"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowAttrInfo = !isShowAttrInfo">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// lodash cloneDeep 深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "attrManage",

  data() {
    return {
      catInfo: {
        catList1id: "",
        catList2id: "",
        catList3id: "",
      },
      // 分类相关属性
      attrInfoList: [],
      // 控制分类属性表格显示与隐藏
      isShowAttrInfo: true,
      // 收集组件中的属性
      attrInfo: {
        attrName: "", // 属性名（v-model）
        attrValueList: [
          // {
          //   attrId: 0, // 属性名的 id (归属于哪个属性名)
          //   valueName: "string", // 收集的属性值
          // },
        ],
        // data 中初始化 categoryId 为 undefined，在添加属性按钮中初始化。
        categoryId: 0, // 分类3 id
        categoryLevel: 3,
      },
    };
  },

  mounted() {},

  methods: {
    getCategoryId({ catListid, level }) {
      if (level == 1) {
        this.catInfo.catList1id = catListid;
        // 清空操作
        this.catInfo.catList2id = "";
        this.catInfo.catList3id = "";
      } else if (level == 2) {
        this.catInfo.catList2id = catListid;
        // 清空操作
        this.catInfo.catList3id = "";
      } else {
        this.catInfo.catList3id = catListid;
        // 发送请求
        this.getAttrInfoList();
      }
    },
    async getAttrInfoList() {
      let res = await this.$API.attrmanage.reqGetAttrInfoList(this.catInfo);
      if (res.code == 200) {
        this.attrInfoList = res.data;
      }
    },
    // 添加属性值按钮事件
    addAttrValHandler() {
      this.attrInfo.attrValueList.push({
        // attrId: undefined,
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      // 点击添加属性值按钮自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮事件
    addAttrHandler() {
      this.isShowAttrInfo = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        // 注意此处的三级分类 id 只能在这里获取，不能在 data 中获取，因为对象中的数据是无序排列的
        categoryId: this.catInfo.catList3id,
        categoryLevel: 3,
      };
    },
    // 修改属性操作
    editAttrInfo(row) {
      this.isShowAttrInfo = false;
      // 注意此处使用深拷贝（row中有嵌套结构）
      this.attrInfo = cloneDeep(row);
      // 对拷贝过来的数据响应式添加一个属性，用于控制编辑模式与查看模式的切换
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 属性值表单失去焦点事件
    attrInfoBlurHandler(row) {
      // 属性值不能为空判断
      if (!row.valueName.trim()) {
        return this.$message("属性值不能为空！");
      }
      // 不能有重复的属性值判断
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 排除自身进行判断
        if (row != item) {
          return item.valueName == row.valueName;
        }
      });
      if (isRepeat) {
        this.attrInfo.attrValueList.pop();
        return this.$message.error("属性值不能重复！");
      }
      row.flag = false;
    },
    // 属性值span点击事件
    attrInfoClickHandler(row, index) {
      row.flag = true;
      // 由查看模式切换为编辑模式自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 删除属性名称
    attrInfoDeleteHandler(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
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
    // 删除属性
    async deleteAttrInfo(row) {
      let res = await this.$API.attrmanage.reqDeleteAttr(row.id);
      if (res.code == 200) {
        this.$message.success("删除成功!");
        this.getAttrInfoList();
      } else {
        this.$message.error("删除失败!");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el_card {
  margin: 15px 0;
}
</style>