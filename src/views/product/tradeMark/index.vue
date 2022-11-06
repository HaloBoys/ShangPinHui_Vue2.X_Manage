<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="plus" class="addTrade" @click="addTrademark"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <el-table :data="list" style="width: 100%" border>
      <!-- 相关列 -->
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌" width="width" align="center">
      </el-table-column>
      <el-table-column prop="prop" label="Logo" width="width" align="center">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="editTrademark(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- 
      layout
        layout 中的变量可以替换前后顺序
        layout 中可以使用 `->` 将元素右对齐
     -->
    <el-pagination
      class="el_pagination"
      :current-page="page"
      :page-sizes="[5, 10, 20]"
      :page-size="limit"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, jumper, ->, sizes, total"
    >
    </el-pagination>
    <!-- dialog 弹出框 -->
    <el-dialog
      :title="tradeInfo.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
      @close="dialogCloseHandler"
    >
      <el-form
        style="width: 80%"
        :model="tradeInfo"
        :rules="rules"
        ref="trademarkForm"
      >
        <el-form-item label="名称" label-width="100px" prop="tmName">
          <el-input v-model="tradeInfo.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="tradeInfo.logoUrl"
              :src="tradeInfo.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",

  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      list: [],
      dialogFormVisible: false,
      // 品牌数据绑定
      tradeInfo: {
        tmName: "",
        logoUrl: "",
      },
      // dialog 表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "change" },
          {
            min: 2,
            max: 10000,
            message: "长度在 2 到 10000 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请上传品牌Logo" }],
      },
    };
  },
  mounted() {
    this.getTradeMarkList();
  },

  methods: {
    async getTradeMarkList() {
      const { page, limit } = this;
      let res = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (res.code == 200) {
        this.total = res.data.total;
        this.list = res.data.records;
      } else {
        alert(res.message);
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTradeMarkList();
    },
    handleCurrentChange(pager) {
      this.page = pager;
      this.getTradeMarkList();
    },
    addTrademark() {
      this.dialogFormVisible = true;
    },
    editTrademark(row) {
      // 浅拷贝
      this.tradeInfo = { ...row };
      this.dialogFormVisible = true;
    },
    // upload 图片上传回调函数
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.tradeInfo.logoUrl = res.data;
    },
    // 图片上传之前（合法校验）
    beforeAvatarUpload(file) {
      const isJPGOrPNG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGOrPNG && isLt2M;
    },
    // 确定按钮
    addOrUpdateConfirm() {
      this.$refs.trademarkForm.validate(async (valid) => {
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    dialogCloseHandler() {
      this.tradeInfo = { tmName: "", logoUrl: "" };
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`将删除品牌${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTradeMarkList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
/* Upload 上传样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style lang="scss" scoped>
.addTrade {
  margin: 10px 0;
}
.el_pagination {
  margin: 10px 0;
  text-align: center;
}
</style>