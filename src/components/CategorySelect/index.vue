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

<style lang="scss" scoped>
</style>