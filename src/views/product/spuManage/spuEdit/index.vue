<template>
  <div>
    <el-form ref="form" :model="spuInfo" label-width="80px">
      <el-form-item label="SPU 名称">
        <el-input placeholder="SPU 名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            v-for="item in tradeMarkList"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU 描述">
        <el-input
          type="textarea"
          placeholder="描述..."
          rows="5"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU 图片">
        <!-- 照片墙组件 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSpuImgSuccess"
          :file-list="spuImages"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="spuSaleAttr"
          :placeholder="
            getNoSelectSaleAttr.length
              ? `还有${getNoSelectSaleAttr.length}个属性`
              : '已添加所有销售属性'
          "
        >
          <el-option
            v-for="item in getNoSelectSaleAttr"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          style="margin-left: 10px"
          :disabled="!spuSaleAttr"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table
          :data="spuInfo.spuSaleAttrList"
          style="width: 100%; margin-top: 20px"
          border
        >
          <el-table-column type="index" label="索引" width="80" align="center">
          </el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性名称列表"
            width="width"
            align="center"
          >
            <template slot-scope="{ row}">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
                style="margin-bottom: 10px"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 
                问题：回车事件也会触发失去焦点事件，导致添加两个 tag
                @keyup.enter.native="handleInputConfirm(row)"
               -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteAttrRow($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrEditSpuSave">保存</el-button>
        <el-button @click="$emit('editcancel', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuEdit",
  data() {
    return {
      // 照片墙相关数据
      dialogImageUrl: "",
      dialogVisible: false,
      spuImages: [],
      // spuRemovedImg: [], // 照片墙 Remove 之后的数据
      // spuUploadedImg: [], // 照片墙 Upload 之后的数据
      // 父组件中点击编辑按钮初始化的相关数据
      tradeMarkList: [],
      // 所有的销售属性
      baseSaleAttrList: [],
      // 销售属性双向数据绑定的数据：包含 id 和 name
      spuSaleAttr: "",
      // spuInfo: {},
      // spuInfo 保存时要传给服务器的数据
      spuInfo: {
        category3Id: 0,
        description: "",
        // 图片列表
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0,
          // },
        ],
        spuName: "",
        // 属性值列表
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
        tmId: "",
      },
      // Tag 动态编辑标签数据（fake）
      // inputVisible: false,
      // inputValue: "",
    };
  },
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
  methods: {
    // 照片墙移除成功的回调
    handleRemove(file, fileList) {
      // 注意此处的数据在最后保存数据发送请求之前要整理的
      this.spuImages = fileList;
    },
    // 照片墙上传成功的回调
    handleSpuImgSuccess(response, file, filelist) {
      // 注意此处的数据在最后保存数据发送请求之前要整理的
      this.spuImages = filelist;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 点击编辑按钮将要触发的函数，发请求获取数据
    async initSpuEditData(row) {
      let res1 = await this.$API.spumanage.reqGetTradeMark();
      if (res1.code == 200) {
        this.tradeMarkList = res1.data;
      }
      let res2 = await this.$API.spumanage.reqGetBaseSaleAttrList();
      if (res2.code == 200) {
        this.baseSaleAttrList = res2.data;
      }
      let res3 = await this.$API.spumanage.reqGetSpuById(row.id);
      if (res3.code == 200) {
        this.spuInfo = res3.data;
      }
      let res4 = await this.$API.spumanage.reqGetSpuImageList(row.id);
      if (res4.code == 200) {
        // 将数据处理成照片墙需要的数据格式
        res4.data.forEach((element) => {
          element.name = element.imgName;
          element.url = element.imgUrl;
        });
        this.spuImages = res4.data;
      }
    },
    // Tag 动态编辑标签相关方法
    // 销售属性值列表中的添加按钮
    showInput(row) {
      // 为 row 添加一个 inputVisible 属性，用于控制 input 和 span 状态的切换
      this.$set(row, "inputVisible", true);
      // 为 row 添加一个 inputValue 属性，用于收集 input 的值
      this.$set(row, "inputValue", row.inputValue);
    },
    // 销售属性值列表中的添加按钮失去焦点
    handleInputConfirm(row) {
      // input 切换为 span 状态
      row.inputVisible = false;
      const { inputValue, baseSaleAttrId } = row;
      /* 
        数据 push 之前的操作，对 input 的内容进行合法校验
        1. 属性值不能为空(此处有bug: v-model="row.inputValue" 初始值为 undefined,使用trim 控制台3会报错)
        2. 属性值不能重复(为什么 return item.saleAttrValueName != inputValue;) 不能使用等号判断？
      */
      if (inputValue.trim() == "") {
        return this.$message.error("属性值不能为空！");
      }
      // 此处的判断我不理解！！！！
      let isRepeat = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName != inputValue;
      });
      if (!isRepeat) {
        row.inputValue = "";
        return this.$message.error("属性值不能重复！");
      }
      /* 
        收集表单数据，数据格式：
        baseSaleAttrId（用于区分是哪个销售属性）
        saleAttrValueName（表单编辑的值）
      */
      row.spuSaleAttrValueList.push({
        baseSaleAttrId: baseSaleAttrId,
        saleAttrValueName: inputValue,
      });
      // 清空表单数据
      row.inputValue = "";
    },
    // 添加销售属性按钮点击事件
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.spuSaleAttr.split(":");
      // 对选择的属性包装数据格式，并 push 到 table 的数据源中
      let wrapObj = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      this.spuInfo.spuSaleAttrList.push(wrapObj);
      // 清空 select 的 title
      this.spuSaleAttr = "";
    },
    // 删除 Tag 操作
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 删除 Row 操作
    deleteAttrRow(index) {
      this.spuInfo.spuSaleAttrList.splice(index, 1);
    },
    // 保存操作
    async addOrEditSpuSave() {
      // 整理参数
      this.spuInfo.spuImageList = this.spuImages.map((item) => {
        return {
          imgName: item.name,
          // 注意此处的操作，如果是新上传的图片会有一个 response 属性
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发请求
      let res = await this.$API.spumanage.reqAddOrEditSpuSave(this.spuInfo);
      if (res.code == 200) {
        this.$message.success("保存成功！");
        // 回到场景 0
        this.$emit("editcancel", 0);
      }
    },
    // 添加 spu 按钮事件，初始化数据
    async initSpuAddData(catList3id) {
      console.log(catList3id);
      // 初始化三级分类 id
      this.spuInfo.category3Id = catList3id;
      let res1 = await this.$API.spumanage.reqGetTradeMark();
      if (res1.code == 200) {
        this.tradeMarkList = res1.data;
      }
      let res2 = await this.$API.spumanage.reqGetBaseSaleAttrList();
      if (res2.code == 200) {
        this.baseSaleAttrList = res2.data;
      }
    },
  },
};
</script>

<style>
/* Tag 动态编辑标签样式 */

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
<style lang="scss" scoped>
</style>