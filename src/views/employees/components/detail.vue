<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="账户登录设置">
            <el-form
              ref="formRef"
              :rules="rules"
              label-width="120px"
              :model="formData"
            >
              <el-form-item prop="username" label="姓名">
                <el-input
                  style="width: 40%"
                  v-model="formData.username"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password2" label="密码">
                <el-input
                  style="width: 40%"
                  v-model="formData.password2"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="updataUserInfo" type="primary"
                  >更新</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <component :is="UserInfo"></component>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="jobInfo"></component>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from "@/api/user";
import userInfo from "@/views/employees/components/user-info.vue";
import jobInfo from "@/views/employees/components/job-info.vue";
export default {
  components: {
    userInfo,
    jobInfo,
  },
  data() {
    return {
      UserInfo: "userInfo",
      jobInfo: "jobInfo",
      formData: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        password2: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码字数不对", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      this.formData = await getUserDetailById(this.$route.params.id);
    },
    async updataUserInfo() {
      try {
        await this.$refs.formRef.validate();
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2,
        });
        this.$message.success("提交成功");
      } catch (e) {
        this.$message.error(e.message || "更新失败");
      }
    },
  },
};
</script>

<style></style>
