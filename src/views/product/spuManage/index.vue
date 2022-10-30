<template>
  <div>
    <el-card class="el_card">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :iscontrol="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card class="el_card">
      <!-- 1. SPU 列表结构 -->
      <div v-if="scene == 0">
        <el-button
          type="primary"
          style="margin-bottom: 15px"
          :disabled="!catInfo.catList3id"
          @click="addSpuHandler(catInfo.catList3id)"
          >添加 SPU</el-button
        >
        <el-table :data="records" style="width: 100%" border>
          <el-table-column type="index" label="索引" width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU 名称"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="SPU 描述"
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
              <el-tooltip
                class="item"
                effect="dark"
                content="添加 SKU"
                placement="bottom"
              >
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addSku(catInfo.catList1id, catInfo.catList2id, row)"
                ></el-button>
              </el-tooltip>
              <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                @click="editSpuHandler(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="showInfoDialog(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteSpu(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="page"
          :page-sizes="[5, 10, 20]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          style="text-align: center; margin-top: 15px"
        >
        </el-pagination>
      </div>
      <!-- 2. 添加 / 修改 SPU -->
      <spuEdit
        ref="spued"
        v-else-if="scene == 1"
        @editcancel="editcCancel"
      ></spuEdit>
      <!-- 3. 添加 SKU -->
      <skuAdd
        v-else-if="scene == 2"
        ref="skuad"
        @changescene="changeScene"
      ></skuAdd>
    </el-card>
    <el-dialog
      :title="`${spu.spuName} 的 SKU 列表`"
      :visible.sync="dialogTableVisible"
      :before-close="handleClose"
    >
      <el-table :data="skuInfoList" style="width: 100%" v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width" align="center">
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
          align="center"
        >
        </el-table-column>
        <el-table-column label="图片" width="width" align="center">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// spuManage 下的两个子组件
import spuEdit from "@/views/product/spuManage/spuEdit";
import skuAdd from "@/views/product/spuManage/skuAdd";

export default {
  name: "spuManage",

  data() {
    return {
      // 三级联动获取的 id
      catInfo: {
        catList1id: "",
        catList2id: "",
        catList3id: "",
      },
      // 分页器数据
      page: 1,
      limit: 10,
      total: 0,
      // spu 列表数据
      records: [],
      /* 
        scene 变量用于控制底部 el-card 内容切换
        0：展示 SPU 列表结构
        1：展示 添加 / 修改 SPU 组件
        2：展示 添加 SKU 组件
      */
      scene: 0,
      dialogTableVisible: false,
      skuInfoList: [],
      spu: {},
      loading: true,
    };
  },

  components: { spuEdit, skuAdd },

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
        this.getSpuList();
      }
    },
    async getSpuList() {
      const { page, limit } = this;
      // 处理当分页中页码为 0 时，跳转到上一个页面
      let _page = this.records.length > 1 ? page : page - 1;
      let res = await this.$API.spumanage.reqGetSpuList(
        _page,
        limit,
        this.catInfo.catList3id
      );
      if (res.code == 200) {
        this.records = res.data.records;
        this.total = res.data.total;
      }
    },
    // 分页器相关回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    // 添加 spu 按钮事件
    addSpuHandler(catList3id) {
      this.scene = 1;
      this.$nextTick(() => {
        this.$refs.spued.initSpuAddData(catList3id);
      });
    },
    // edit 编辑按钮事件
    editSpuHandler(row) {
      this.scene = 1;
      this.$nextTick(() => {
        this.$refs.spued.initSpuEditData(row);
      });
    },
    // spuEdit 组件取消按钮的自定义事件
    editcCancel(scene) {
      this.scene = scene;
      this.getSpuList();
    },
    async deleteSpu(row) {
      let res = await this.$API.spumanage.reqDelteSpuById(row.id);
      if (res.code == 200) {
        this.getSpuList();
        return this.$message.success("删除成功！");
      }
    },
    // 添加 SKU 按钮
    addSku(category1Id, category2Id, row) {
      this.scene = 2;
      this.$nextTick(() => {
        this.$refs.skuad.getSkuData(category1Id, category2Id, row);
      });
    },
    // skuAdd 组件取消按钮的自定义事件
    changeScene(scene) {
      this.scene = scene;
    },
    // info 按钮事件
    async showInfoDialog(row) {
      this.spu = row;
      console.log(row);
      this.dialogTableVisible = true;
      // 发请求获取数据
      let res = await this.$API.spumanage.reqGetSkuById(row.id);
      if (res.code == 200) {
        this.skuInfoList = res.data;
        this.loading = false;
      }
    },
    // dialog 关闭事件
    handleClose(done) {
      this.loading = true;
      this.skuInfoList = [];
      done();
    },
  },
};
</script>

<style lang="scss" scoped>
.el_card {
  margin: 15px 0;
}
</style>