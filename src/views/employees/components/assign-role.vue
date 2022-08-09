<template>
  <el-dialog @close="close" title="分配角色" :visible="isshowJUESE">
    <el-checkbox-group v-model="roleId">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button @click="btnOK" type="primary" size="mini">确定</el-button>
      <el-button @click="quxiao" size="mini">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";
import { getRoleList } from "@/api/settings";
export default {
  data() {
    return {
      roleId: [],
      list: [],
    };
  },
  name: "AssignRole",
  props: {
    isshowJUESE: {
      type: Boolean,
      default: false,
    },
    currentId: {
      type: String,
    },
  },
  created() {
    this.getRoleList();
  },
  methods: {
    quxiao() {
      // this.roleIds = [];
      this.close();
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id);
      console.log(roleIds);
      this.roleId = roleIds; // 赋值本用户的角色
    },
    close() {
      this.roleIds = [];
      this.$emit("update:isshowJUESE", false);
    },

    async getRoleList() {
      const res = await getRoleList();
      // console.log(res);
      this.list = res.rows;
    },
    async btnOK() {
      try {
        await assignRoles({
          id: this.currentId,
          roleIds: this.roleId,
        });
        this.$message.success("修改成功");
        this.$emit("update:isshowJUESE", false);
      } catch (e) {
        this.$message.error("修改失败");
        this.close();
      }
    },
  },
};
</script>

<style></style>
