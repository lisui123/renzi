<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>50条数据</span>
        </template>
        <template #after>
          <el-button type="primary" @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button type="danger" @click="exportToExcel">导出</el-button>
          <el-button @click="isShowDialog = true" type="warning"
            >新增员工</el-button
          >
        </template>
      </ToolBar>
      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像">
            <template v-slot="{ row }">
              <el-avatar
                @click.native="showQrCode(row.staffPhoto)"
                style="width: 80px; height: 80px"
                :src="row.staffPhoto"
              >
                <img src="@/assets/common/logo.png" alt="" />
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column
            :formatter="formatter"
            prop="formOfEmployment"
            label="聘用形式"
            sortable=""
          />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column label="入职时间" sortable="">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="juese(row.id)"
                >角色</el-button
              >
              <el-button :disabled="checkPermission('DELETE_USER')" @click="del(row.id)" type="text" size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            @current-change="changecurrent"
            :page-size="page.size"
            :current-page="page.page"
            :total="total"
            layout="prev, pager, next"
          />
        </el-row>
      </el-card>
    </div>
    <AssignRole
      ref="roleRef"
      :current-id="currentId"
      :isshowJUESE.sync="isshowJUESE"
    ></AssignRole>
    <addemployee :is-show-dialog.sync="isShowDialog"></addemployee>
    <el-dialog :visible.sync="isShowvisible" title="二维码">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import AssignRole from "@/views/employees/components/assign-role.vue";
import addemployee from "@/views/employees/components/addemployee.vue";
import EmployeesEnum from "@/api/constant/employees";
import { getEmployeeList, delEmployee } from "@/api/employees";
import ToolBar from "@/components/ToolBar";
import { formatDate } from "@/filters/index";
import qrCode from "qrcode";
import { mixins } from '@/utils/mixins';
export default {
  mixins: [mixins],
  data() {
    return {
      isshowJUESE: false,
      isShowvisible: false,
      isShowDialog: false,
      list: [],
      total: 0,
      page: {
        page: 1,
        size: 10,
      },
      currentId: "",
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    async juese(id) {
      console.log(id);
      this.currentId = id;
      await this.$refs.roleRef.getUserDetailById(id);
      this.isshowJUESE = true;
    },
    showQrCode(url) {
      console.log(url);
      this.isShowvisible = true;
      // 数据跟新之后界面不能立即渲染
      // 如果要在数据跟新后获取到跟新后的最新的dom元素
      // 需要使用$nextTick()
      this.$nextTick(() => {
        qrCode.toCanvas(this.$refs.canvas, url);
      });
    },
    async exportToExcel() {
      // 预期导出一个excel
      // 动态导入一个模块的时候，使用import语法
      // import返回值是一个promise
      // 如果需要拿到模块内部导出的内容，then(res)接收

      // 使用import 语法的文件会单独打包出一个文件
      // 使用魔法注释》》》自定义文件名
      // webpackChunkName: '文件名'
      const { export_json_to_excel } = await import(
        /*webpackChunkName: 'export2Excel'*/ "@/utils/Export2Excel"
      );
      // const tHeader = ["Id", "标题", "作者", "阅读", "时间"];
      // console.log(export_json_to_excel);
      const headers = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };

      const { rows } = await getEmployeeList({ page: 1, size: this.total });
      // console.log(rows);
      const resData = this.formatterData(rows, headers);
      console.log(resData);

      export_json_to_excel({
        header: Object.keys(headers), //表头 必填
        data: resData, // 具体数据 必填
        filename: "excel-list", //非必填
        autoWidth: true, //非必填
        bookType: "xlsx", //非必填
      });
    },
    formatterData(rows, headers) {
      // 遍历原始rows数据
      return rows.map((item) => {
        // 返回的值为数组
        // 顺序需要和headers的key--对应
        // 直接map 》》Object.keys(headers)
        // ke可以拿到便利的每一项的中文key
        // 中文key》》映射表》》英文的key》》通过item可以找到具体的数据进行返回
        return Object.keys(headers).map((key) => {
          if (["timeOfEntry", "correctionTime"].includes(headers[key])) {
            return formatDate(item[headers[key]]);
          }
          if (headers[key] === "formOfEmployment") {
            return (
              EmployeesEnum.hireType.find(
                (children) => +children.id === +item[headers[key]]
              )?.value || "未知"
            );
          }
          return item[headers[key]];
        });
      });
    },
    async del(id) {
      try {
        await this.$confirm("是否删除？");
        await delEmployee(id);
        this.$message.success("删除成功");
        await this.getEmployeeList();
      } catch (e) {
        console.log(e);
      }
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page);
      // console.log(res);
      this.total = total;
      this.list = rows;
    },
    changecurrent(page) {
      this.page.page = page;
      this.getEmployeeList();
    },
    formatter(row, column, cellValue) {
      const currentData = EmployeesEnum.hireType.find(
        (item) => item.id === cellValue
      )?.value;
      return currentData || "未知";
    },
  },
  components: { ToolBar, addemployee, AssignRole },
};
</script>

<style></style>
