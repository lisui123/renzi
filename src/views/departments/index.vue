<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-container">
      <el-card class="box-card">
        <TreeTool
          @handAddDept="handAddDept"
          :is-root="true"
          :tree-data="company"
        ></TreeTool>
        <!-- <el-row type=""> </el-row> -->
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{ data }">
          <TreeTool
            @handedliDept="handedliDept"
            @handAddDept="handAddDept"
            @getDepartments="getDepartments"
            :is-root="false"
            :tree-data="data"
          ></TreeTool>
        </template>
      </el-tree>
    </div>
    <AddDept
      ref="addDept"
      @getDepartments="getDepartments"
      :currentNode="currentNode"
      :isShowDialog.sync="isShowDialog"
    ></AddDept>
  </div>
</template>

<script>
import TreeTool from "@/views/departments/components/tree-tool.vue";
import { getDepartments } from "@/api/departments.js";
import { transListToTree } from "@/utils/index";
import AddDept from "@/views/departments/components/add-dept.vue";
export default {
  components: { TreeTool, AddDept },
  data() {
    return {
      loading: false,
      currentNode: {},
      isShowDialog: false,
      company: { name: "江苏传智播客教育科技股份有限公司", manager: "负责人" },
      departs: [
        {
          name: "总裁办",
          manager: "曹操",
          children: [{ name: "董事会", manager: "曹丕" }],
        },
        { name: "行政部", manager: "刘备" },
        { name: "人事部", manager: "孙权" },
      ],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    method() {},
    handAddDept(node) {
      this.isShowDialog = true;
      this.currentNode = node;
      console.log("dianji");
    },
    handedliDept(node) {
      this.isShowDialog = true;
      this.currentNode = node;
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id)
    },
    async getDepartments() {
      this.loading = true;
      const res = await getDepartments();
      // 替换公司数据
      console.log(res);
      this.company = {
        name: res.companyName,
        manager: res.companyManage || "管理员",
        id: "",
      };
      // 替换部门数据
      this.departs = transListToTree(res.depts, "");
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.dashboard-container {
  .app-container {
    width: 898px;
    border: 1px solid red;
    margin: 50px auto;
  }
}
</style>
