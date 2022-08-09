<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="onSuccess" />
</template>

<script>
import { importEmployee } from "@/api/employees";
import UploadExcel from "@/components/UploadExcel";
const userRelation = {
  工号: "workNumber",
  转正日期: "correctionTime",
  姓名: "username",
  入职日期: "timeOfEntry",
  手机号: "mobile",
};
export default {
  components: { UploadExcel },
  name: "import",
  methods: {
    async onSuccess({ results }) {
      console.log(results);
      const resArr = results.map((item) => {
        const obj = {};
        for (const itemKey in item) {
          if (
            ["correctionTime", "timeOfEntry"].includes(userRelation[itemKey])
          ) {
            // 时间格式化  。。 值是时间。格式化
            obj[userRelation[itemKey]] = new Date(
              this.formatDate(item[itemKey], "/")
            );
          } else {
            obj[userRelation[itemKey]] = item[itemKey];
          }
        }
        return obj;
      });
      console.log(resArr);
      await importEmployee(resArr);
      this.$message.success("上传成功");
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style></style>
