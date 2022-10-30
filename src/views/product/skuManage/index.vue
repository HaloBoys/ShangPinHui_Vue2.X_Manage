<template>
  <div>
    <el-table :data="records" style="width: 100%; margin-top: 15px" border>
      <el-table-column type="index" label="索引" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width" align="center">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width" align="center">
      </el-table-column>
      <el-table-column label="默认图片" width="width" align="center">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量（KG)"
        width="100"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格（元）"
        width="100"
        align="center"
      >
      </el-table-column>
      <!-- 相关操作按钮 -->
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-top"
            v-if="row.isSale == 0"
            @click="setUp(row)"
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-bottom"
            v-else
            @click="setDown(row)"
          ></el-button>
          <el-button type="warning" size="mini" icon="el-icon-edit"></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="showSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteSkuInfo(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 20]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      style="text-align: center; margin-top: 15px"
    >
    </el-pagination>
    <!-- Drawer 抽屉 -->
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5"><strong>名称</strong></el-col>
        <el-col :span="14">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><strong>描述</strong></el-col>
        <el-col :span="14">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><strong>价格</strong></el-col>
        <el-col :span="14">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><strong>平台属性</strong></el-col>
        <el-col :span="14">
          <el-tag
            type="success"
            style="margin: 0 5px"
            v-for="item in skuInfo.skuAttrValueList"
            :key="item.id"
            >{{ item.attrId }}-{{ item.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><strong>商品图片</strong></el-col>
        <el-col :span="14">
          <el-carousel height="650px" border>
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" style="width: 100%; height: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "skuManage",

  data() {
    return {
      // 分页器数据
      page: 1,
      limit: 10,
      total: 0,
      // spu 列表数据
      records: [],
      // Drawer 抽屉
      drawer: false,
      // info 详情数据
      skuInfo: [],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      let res = await this.$API.skumanage.reqGetSkuAllList(
        this.page,
        this.limit
      );
      if (res.code == 200) {
        this.total = res.data.total;
        this.records = res.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getData();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getData();
    },
    async setUp(row) {
      let res = await this.$API.skumanage.reqOnSale(row.id);
      if (res.code == 200) {
        this.$message.success("上架成功");
        row.isSale = 1;
      }
    },
    async setDown(row) {
      let res = await this.$API.skumanage.reqCancelSale(row.id);
      if (res.code == 200) {
        this.$message.success("下架成功");
        row.isSale = 0;
      }
    },
    // info 按钮事件
    async showSkuInfo(row) {
      this.drawer = true;
      let res = await this.$API.skumanage.reqGetSkuById(row.id);
      if (res.code == 200) {
        this.skuInfo = res.data;
      }
    },
    async deleteSkuInfo(row) {
      let res = await this.$API.skumanage.reqDeleteSkuById(row.id);
      if (res.code == 200) {
        this.$message.success("删除成功!");
        this.getData();
      }
    },
  },
};
</script>


<style>
.el-col {
  margin: 10px;
}
.el-row .el-col-5 {
  text-align: right;
  font-size: 24px;
}
</style>
<style lang="scss" scoped>
</style>