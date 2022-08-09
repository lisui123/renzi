<template>
  <div>
    <el-dialog title="新增员工" :visible="isShowDialog" @close="close">
      <el-form
        ref="formDat"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item prop="username" label="姓名">
          <el-input
            v-model="formData.username"
            style="width: 80%"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="formData.mobile"
            style="width: 80%"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="formData.timeOfEntry"
            style="width: 80%"
            placeholder="请选择入职时间"
          />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="formData.formOfEmployment"
            style="width: 80%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectOptions"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            v-model="formData.workNumber"
            style="width: 80%"
            placeholder="请输入工号"
          />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <!-- <el-input
            v-model="formData.timeOfEntry"
            style="width: 80%"
            placeholder="请选择部门"
          /> -->
          <el-cascader
            :props="{
              label: 'name',
              value: 'name',
              checkStrictly: true,
              emitPath: false,
            }"
            v-model="formData.departmentName"
            :options="options"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="formData.correctionTime"
            style="width: 80%"
            placeholder="请选择转正时间"
          />
        </el-form-item>
      </el-form>
      <!-- footer插槽 -->
      <template v-slot:footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small">取消</el-button>
            <el-button @click="submit" type="primary" size="small"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments } from "@/api/departments";
import { transListToTree } from "@/utils/index";
import EmployeesEnum from "@/api/constant/employees";
import { addEmployee } from "@/api/employees";
export default {
  data() {
    return {
      selectOptions: EmployeesEnum.hireType,
      formData: {
        username: "", // 用户姓名
        mobile: "", // 手机号
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门名称
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
      },
      rules: {
        username: [{ required: true, message: "用户名不能为空" }], // 用户姓名
        mobile: [
          { required: true, message: "手机号不能为空" },
          { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不对" },
        ], // 手机号
        formOfEmployment: [{ required: true, message: "聘用形式不能为空" }], // 聘用形式
        workNumber: [{ required: true, message: "工号不能为空" }], // 工号
        departmentName: [{ required: true, message: "部门名称不能为空" }], // 部门名称
        timeOfEntry: [{ required: true, message: "入职时间不能为空" }], // 入职时间
        correctionTime: [{ required: true, message: "转正时间不能为空" }], // 转正时间
      },
      options: [],
    };
  },
  name: "AddDemployee",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    // console.log(this);
    this.getDepartments();
  },
  methods: {
    close() {
      this.$emit("update:isShowDialog", false);
      this.$refs.formDat.resetFields();
      this.formData = {
        username: "", // 用户姓名
        mobile: "", // 手机号
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门名称
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
      };
      // props $emit .sync v-model
      // 可以写多个 .sync 
      // $parent 获取父组件的实例，任意调用负组件的方法，修改父组件的数据
      // ref 父组件获取子组件实例，
    },
    async getDepartments() {
      const { depts } = await getDepartments();
      console.log(depts);
      this.options = transListToTree(depts, "");
      console.log(transListToTree(depts, ""));
    },
    async submit() {
      await this.$refs.formDat.validate();
      await addEmployee(this.formData);
      this.$message.success("添加成功");
      this.close();
      this.$parent.getEmployeeList();
    },
  },
};
</script>

<style></style>
