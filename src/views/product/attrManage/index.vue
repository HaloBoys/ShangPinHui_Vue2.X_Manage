<template>
  <div>
    <el-card class="el_card">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card class="el_card">
      <el-button type="primary" style="margin-bottom: 15px">添加属性</el-button>
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
              type="warning"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
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
      console.log(111);
      let res = await this.$API.attrmanage.reqGetAttrInfoList(this.catInfo);
      if (res.code == 200) {
        this.attrInfoList = res.data;
        console.log(this.attrInfoList);
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