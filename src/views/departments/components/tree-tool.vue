<template>
  <el-row style="width: 100%" type="flex" justify="space-between">
    <el-col>{{ treeData.name }}</el-col>
    <el-col :span="4">
      <span>{{ treeData.manager }}</span>
    </el-col>
    <el-col :span="6">
      <el-dropdown @command="clickItem">
        <span class="el-dropdown-link">
          操作<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">添加部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot" command="edit"
            >编辑部门</el-dropdown-item
          >
          <el-dropdown-item v-if="!isRoot" command="del"
            >删除部门</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  data() {
    return {};
  },
  props: {
    treeData: {
      type: Object, // 对象类型
      required: true, // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },

    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async clickItem(type) {
      if (type === "add") {
        this.$emit("handAddDept", this.treeData);
      } else if (type === "edit") {
        this.$emit("handedliDept", this.treeData);
        console.log("编辑");
      } else if (type === "del") {
        await this.$confirm("确认退出？");
        // console.log("点击删除");
        await delDepartments(this.treeData.id);
        this.$message.success("删除成功");
        this.$emit("getDepartments");
      }
    },
  },
};
</script>
