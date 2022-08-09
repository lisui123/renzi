<template>
  <div>
    <el-dialog title="新增部门" :visible="isShowDialog" @close="close">
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="formData.manager"
            style="width: 80%"
            placeholder="请选择"
            @focus="getEmployeeSimple"
          >
            <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
            <el-option
              v-for="item in peoples"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input type="textarea" v-model="formData.introduce"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="close">取 消</el-button>
          <el-button @click="submit" type="primary" size="small"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  addDepartments,
  getDepartments,
  getDepartDetail,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";
import { updateDepartments} from "@/api/departments";
export default {
  name: "AddDept",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false,
    },
    currentNode: {
      type: Object,
      default: null,
    },
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑" : "新增";
    },
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple();
    },
    async getDepartDetail(id) {
      // 获取部门id
      this.formData = await getDepartDetail(id);
    },
    async submit() {
      await this.$refs.form.validate();
      if (this.formData.id) {
        await updateDepartments(this.formData);
      } else {
        await addDepartments({
          ...this.formData, //把数据的表单对象展开
          pid: this.currentNode.id,
        });
      }

      this.$message.success(`${this.showTitle}成功`);
      this.$emit("getDepartments");
      this.close();
    },
    close() {
      this.$refs.form.resetFields();
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      this.$emit("update:isShowDialog", false);
    },
  },
  data() {
    const checkName = async (rule, value) => {
      console.log(123);
      // 获取所有数据
      const { depts } = await getDepartments();
      // 找出当前的点击部门，pid===id
      let currentChildren = null;

      if (this.formData.id) {
        currentChildren = depts.filter((item) => {
          // 编辑
          // 当前节点的兄弟节点，，&&不包括自己
          // 把自己过滤掉
          return (
            item.pid === this.currentNode.pid && item.id !== this.currentNode.id
          );
        });
      } else {
        // 新增的， 当前点击的子节点
        currentChildren = depts.filter(
          (item) => item.pid === this.currentNode.id
        );
      }

      console.log(this.currentNode);
      const isRepeat = currentChildren.some((item) => item.name === value);
      if (isRepeat) {
        return Promise.reject("部门名称不能重复");
      }
    };

    const checkCode = async (rule, value) => {
      const { depts } = await getDepartments();
      let isRepeat = null;
      if (this.formData.id) {
        isRepeat = depts.some(
          (item) => item.code === value && item.id !== this.currentNode.id
        );
      } else {
        isRepeat = depts.some((item) => item.code === value);
      }
      if (isRepeat) {
        return Promise.reject("部门编码重复了");
      }
    };
    return {
      peoples: [],

      formData: {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空" },
          { min: 1, max: 50, message: "部门名称要求1-50个字符" },
          {
            trigger: "blur",
            validator: checkName,
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空" },
          { min: 1, max: 50, message: "部门编码要求1-50个字符" },
          {
            trigger: "blur",
            validator: checkCode,
          },
        ],
        manager: [{ required: true, message: "部门负责人不能为空" }],
        introduce: [
          { required: true, message: "部门介绍不能为空" },
          { min: 1, max: 300, message: "部门介绍要求1-300个字符" },
        ],
      },
    };
  },
};
</script>

<style></style>
