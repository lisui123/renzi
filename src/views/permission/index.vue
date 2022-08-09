<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div>
        <!-- 靠右的按钮 -->
        <ToolBar>
          <template v-slot:after>
            <el-button
              @click="addPermissions('0', 1)"
              type="primary"
              size="small"
              >添加权限</el-button
            >
          </template>
        </ToolBar>
        <!-- 表格 -->
        <el-table row-key="id" :data="list" border>
          <el-table-column align="center" label="名称" prop="name" />
          <el-table-column align="center" label="标识" prop="code" />
          <el-table-column align="center" label="描述" prop="description" />
          <el-table-column align="center" label="操作">
            <template v-slot="{ row }">
              <el-button
                v-if="row.type === 1"
                type="text"
                @click="addPermissions(row.id, 2)"
                >添加</el-button
              >
              <el-button type="text" @click="editPermissions(row.id)"
                >编辑</el-button
              >
              <el-button type="text" @click="delPermissions(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        :title="`${this.formData.id ? '编辑' : '新增'}`"
        :visible.sync="isShowDialog"
      >
        <el-form
          ref="formRef"
          :rules="rules"
          :model="formData"
          label-width="120px"
        >
          <el-form-item prop="name" label="权限名称">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item prop="code" label="权限标识">
            <el-input v-model="formData.code"></el-input>
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description"></el-input>
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="formData.type"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" @click="btnOK">确定</el-button>
              <el-button @click="close">取消</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ToolBar from "@/components/ToolBar";
import {
  getPermissionList,
  getPermissionDetail,
  addPermission,
  updatePermission,
  delPermission,
} from "@/api/permisson";
import { transListToTree } from "@/utils";
export default {
  components: { ToolBar },
  data() {
    return {
      isShowDialog: false,
      list: [],
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
      formData: {
        name: "",
        code: "",
        description: "",
        type: "",
        pid: "",
        enVisible: "0",
      },
    };
  },
  created() {
    this.getPermissionList();
  },

  methods: {
    async delPermissions(id) {
      await this.$confirm("是否删除？");
      await delPermission(id);
      this.$message.success("删除成功");
      await this.getPermissionList();
    },
    async editPermissions(id) {
      const res = await getPermissionDetail(id);
      console.log(res);
      this.formData = res;
      this.isShowDialog = true;
    },

    async btnOK() {
      await this.$refs.formRef.validate();
      try {
        if (this.formData.id) {
          // bj
          await updatePermission(this.formData);
          // console.log(this.formData.id);
        } else {
          await addPermission(this.formData);
        }
        this.$message.success("添加权限成功");
        this.close();
        await this.getPermissionList();
      } catch (e) {
        this.$message.error("修改失败");
      }
    },
    close() {
      this.$refs.formRef.resetFields();
      this.formData = {
        name: "",
        code: "",
        description: "",
        type: "",
        pid: "",
        enVisible: "0",
      };
      this.isShowDialog = false;
    },
    addPermissions(pid, type) {
      this.formData.type = type;
      this.formData.pid = pid;
      this.isShowDialog = true;
    },

    async getPermissionList() {
      const res = await getPermissionList();
      console.log(res);
      this.list = transListToTree(res, "0");
    },
  },
};
</script>

<style></style>
