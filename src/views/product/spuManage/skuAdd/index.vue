<template>
  <div>
    <el-form ref="form" :model="skuInfo" label-width="100px">
      <el-form-item label="SPU 名称"> {{ row.spuName }} </el-form-item>
      <el-form-item label="SKU 名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU 名称"></el-input>
      </el-form-item>
      <el-form-item label="价格（元）">
        <el-input
          v-model="skuInfo.price"
          type="number"
          placeholder="价格（元）"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量（千克）">
        <el-input
          v-model="skuInfo.weight"
          placeholder="重量（千克）"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          v-model="skuInfo.skuDesc"
          placeholder="规格描述"
          rows="5"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form
          :inline="true"
          :model="skuInfo"
          class="demo-form-inline"
          label-width="80px"
        >
          <el-form-item
            :label="item.attrName"
            v-for="item in attrInfoList"
            :key="item.id"
          >
            <!-- 注意此处的骚操作！！直接把 id 暂存在每一个 item 对象身上【难点】 -->
            <el-select placeholder="请选择" v-model="item.pfIdAndPfValueId">
              <el-option
                :label="attr.valueName"
                :value="`${item.id}:${attr.id}`"
                v-for="attr in item.attrValueList"
                :key="attr.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form
          :inline="true"
          :model="skuInfo"
          class="demo-form-inline"
          label-width="80px"
        >
          <el-form-item
            :label="item.saleAttrName"
            v-for="item in spuSaleAttrList"
            :key="item.id"
          >
            <!-- 值收集到每个销售属性对象身上，骚操作！ -->
            <el-select v-model="item.saleIdAndSaleValueId" placeholder="请选择">
              <el-option
                :label="attr.saleAttrValueName"
                :value="`${item.id}:${attr.id}`"
                v-for="attr in item.spuSaleAttrValueList"
                :key="attr.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          :data="spuImageList"
          style="width: 100%; margin-bottom: 15px"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="图片"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column
            prop="imgName"
            label="名称"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button v-else style="color: green">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveSkuInfo">确定</el-button>
        <el-button @click="cancelHandle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuAdd",

  data() {
    return {
      // 页面初始化相关数据
      row: {}, // 点击编辑按钮传递过来的 row 对象
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      // Selection 收集的数据
      selectionImageList: [],
      // 数据收集
      skuInfo: {
        // 1. 父组件传递的相关数据: category3Id spuId tmId
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 2. 组件 v-model 相关数据
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 3. 复杂类数据
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
          // 实际收集的就是下面两个属性
          // {
          //   skuId: 0,
          //   valueId: 0,
          // },
        ],
        // 默认图片
        skuDefaultImg: "",
        // 收集图片
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
          // {
          //   saleAttrName: "string",
          //   saleAttrValueName: "string",
          // }
        ],
      },
    };
  },

  methods: {
    // 初始化相关数据
    async getSkuData(category1Id, category2Id, row) {
      this.skuInfo.tmId = row.tmId;
      this.skuInfo.spuId = row.id;
      this.skuInfo.category3Id = row.category3Id;
      this.row = row;
      let res1 = await this.$API.spumanage.reqGetSpuImageList(row.id);
      if (res1.code == 200) {
        let wrapObj = res1.data;
        wrapObj.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = wrapObj;
      }
      let res2 = await this.$API.spumanage.reqGetSpuSaleAttrList(row.id);
      if (res2.code == 200) {
        this.spuSaleAttrList = res2.data;
      }
      let res3 = await this.$API.spumanage.reqGetAttrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (res3.code == 200) {
        this.attrInfoList = res3.data;
      }
    },
    handleSelectionChange(params) {
      this.selectionImageList = params;
    },
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 收集默认图片地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    async saveSkuInfo() {
      // 整理参数
      /* 
        对平台属性和销售属性数据与图片数据进行整理
      */
      const { attrInfoList, skuInfo, spuSaleAttrList, selectionImageList } =
        this;
      //  平台属性
      attrInfoList.forEach((item) => {
        if (item.pfIdAndPfValueId) {
          const [attrId, valueId] = item.pfIdAndPfValueId.split(":");
          skuInfo.skuAttrValueList.push({
            attrId,
            valueId,
          });
        }
      });
      // 销售属性（可以使用上面的这种写法，这里用 reduce 来实现）
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleIdAndSaleValueId) {
          const [saleAttrName, saleAttrValueName] =
            item.saleIdAndSaleValueId.split(":");
          prev.push({
            saleAttrName,
            saleAttrValueName,
          });
        }
        return prev;
      }, []);
      // 图片数据整理
      skuInfo.skuImageList = selectionImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      // 发请求【Bug!! 接口状态码：201】
      let res = await this.$API.spumanage.reqSaveSkuInfo(skuInfo);
      if (res.code == 200) {
        this.$message.success("保存成功！");
        this.$emit("changescene", 0);
      } else {
        this.$message.error("保存失败！");
      }
    },
    cancelHandle() {
      this.$emit("changescene", 0);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>