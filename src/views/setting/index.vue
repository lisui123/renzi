<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="animation-container">
        <el-card>
          <el-tabs v-model="activeName" @tab-click="handleClick" @click="close">
            <el-tab-pane label="角色管理" name="first">
              <el-button
                @click="showdoading = true"
                size="small"
                type="primary"
                icon="el-icon-plus"
                >新增角色</el-button
              >
              <el-table :data="list" style="width: 100%">
                <el-table-column type="index" label="序号" width="180">
                </el-table-column>
                <el-table-column prop="name" label="角色名称" width="180">
                </el-table-column>
                <el-table-column prop="description" label="描述">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ row }">
                    <el-button
                      @click="showAssociated(row.id)"
                      size="small"
                      type="success"
                      >分配权限</el-button
                    >
                    <el-button size="small" type="primary" @click="edit(row.id)"
                      >编辑</el-button
                    >
                    <el-button size="small" type="danger" @click="del(row.id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>

              <el-row style="margin-top: 20px" type="flex" justify="center">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="total"
                  :current-page="page.page"
                  :page-size="page.pagesize"
                  @current-change="changeCurrent"
                >
                </el-pagination>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="公司设置" name="second">
              <el-alert title="消息提示的文案" type="info" show-icon>
              </el-alert>
              <el-form style="margin-top: 30px" disabled label-width="120px">
                <el-form-item label="公司名称">
                  <el-input
                    v-model="formData.name"
                    style="width: 50%"
                  ></el-input>
                </el-form-item>
                <el-form-item label="公司地址">
                  <el-input
                    v-model="formData.companyAddress"
                    style="width: 50%"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input
                    v-model="formData.mailbox"
                    style="width: 50%"
                  ></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input
                    v-model="formData.remarks"
                    style="width: 50%"
                    :rows="3"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <!--  -->
        <el-dialog
          title="分配权限"
          @close="closepre"
          :visible="isShowDialogQUANXIAN"
        >
          <el-tree
            ref="TreeRef"
            :data="treeList"
            default-expand-all
            check-strictly
            :props="props"
            show-checkbox
            node-key="id"
            :default-checked-keys="childrenKeys"
          ></el-tree>
          <template #footer>
            <el-button size="small" @click="closepre">取消</el-button>
            <el-button type="primary" size="small" @click="btnOKpremise"
              >确定</el-button
            >
          </template>
        </el-dialog>

        <!--  -->
        <el-dialog
          @close="btnCancel"
          :visible="showdoading"
          :title="`${this.roleFormData.id ? '编辑' : '新增'}`"
        >
          <el-form
            ref="rolrform"
            :model="roleFormData"
            :rules="roleRules"
            label-width="120px"
          >
            <el-form-item label="角色" prop="name">
              <el-input v-model="roleFormData.name"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="roleFormData.description"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="add">确认</el-button>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm,
} from "@/api/settings";
import { getPermissionList } from "@/api/permisson";
import { transListToTree } from "@/utils";
export default {
  data() {
    return {
      childrenKeys: [],
      props: {
        label: "name",
      },
      treeList: [],
      isShowDialogQUANXIAN: false,
      roleRules: {
        name: [
          {
            required: true,
            message: "名字不能为空",
          },
        ],
      },
      roleFormData: {
        name: "",
        description: "",
      },
      showdoading: false,
      formData: {},
      activeName: "first",
      list: [],
      total: 0,
      page: {
        page: 1,
        pagesize: 2,
      },
      childrenId: "",
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  methods: {
    async btnOKpremise() {
      const currentKeys = this.$refs.TreeRef.getCheckedKeys();
      // console.log(currentKeys);
      await assignPerm({
        id: this.childrenId,
        permIds: currentKeys,
      });
      this.$message.success("添加成功");
      this.closepre();
    },
    closepre() {
      this.isShowDialogQUANXIAN = false;
      this.childrenKeys = [];
    },
    async showAssociated(id) {
      // console.log(id);
      this.childrenId = id;
      const res = transListToTree(await getPermissionList(), "0");
      // console.log(res);
      this.treeList = res;
      const { permIds } = await getRoleDetail(id);

      console.log(permIds);
      // 指定默认选中的节点
      this.childrenKeys = permIds;
      this.isShowDialogQUANXIAN = true;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },

    async getRoleList() {
      console.log(1222);
      const { rows, total } = await getRoleList(this.page);
      console.log(rows);
      this.list = rows;
      this.total = total;
    },
    changeCurrent(newpage) {
      this.page.page = newpage;
      this.getRoleList();
    },
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.$store.getters.companyId);
      this.formData = res;
    },
    async del(id) {
      const len = this.list.length;
      await this.$confirm("确认删除？");
      await deleteRole(id);
      this.$message.success("删除成功");
      if (len === 1 && this.page.page > 1) {
        return this.page.page--;
      }
      await this.getRoleList();
    },
    async edit(id) {
      this.showdoading = true;
      this.roleFormData = await getRoleDetail(id);
    },
    close() {
      this.showdoading = false;
    },
    async add() {
      await this.$refs.rolrform.validate();
      // 只有校验通过的情况下 才会执行await的下方内容
      // roleForm这个对象有id就是编辑 没有id就是新增
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData);
      } else {
        await addRole(this.roleFormData);
      }
      this.$message.success("修改成功");
      await this.getRoleList();
      this.close();
    },
    btnCancel() {
      this.showdoading = false;

      this.roleFormData = {
        name: "",
        description: "",
      };
      this.$refs.roleForm.resetFields();
    },
  },
};
</script>

<style></style>
