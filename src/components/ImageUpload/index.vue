<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :class="{ completed: isComplete }"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :limit="1"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      v-if="isShowpro"
      style="width: 200px"
      :percentage="percentage"
    ></el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";

// 需要实例化
const cos = new COS({
  SecretId: "AKIDgDYeZHm491h9PRHuKi3LVR9bnw6C6nHV",
  SecretKey: "3uZ1HLDuPp597sQo11qTvHRL0QbWCcmj",
});
// https://jsonplaceholder.typicode.com/posts/
export default {
  data() {
    return {
      isShowpro: false,
      percentage: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [
        {
          url: "https://img2.baidu.com/it/u=2859542338,3761174075&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500",
        },
        // {
        //   url: "https://img2.baidu.com/it/u=2859542338,3761174075&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500",
        // },
      ],
    };
  },
  computed: {
    isComplete() {
      return this.fileList.length === 1;
    },
  },
  methods: {
    changeFile(file, fileList) {
      // console.log(file);
      // console.log(fileList);
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // file是点击的文件
      // 如果uid一致，需要被删除
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("文件类型不匹配");
        return false;
      }
      const maxSize = 5 * 1024 * 1024; // 1M=1024KB 1KB = 1024B
      if (file.size > maxSize) {
        this.$message.error("文件太大");
        return false;
      }
      this.isShowpro = true;
    },
    upload(params) {
      // console.log(file);
      const { file } = params;
      // 文件开始上传到腾讯云对象存储
      // 如果四川的文件对象不存在，终止代码执行
      if (!file) return;
      cos.putObject(
        {
          Bucket: "lisui-1313213555", // 存储桶
          Region: "ap-nanjing", // 地域
          Key: file.name, // 文件名
          Body: file, // 要上传的文件对象
          StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
          onProgress: (params) => {
            console.log(params.percent);
            this.percentage = params.percent * 100;
          },
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        },
        (err, data) => {
          if (err) {
            this.$message.error(err?.message || "上传错误");
            return;
          }
          this.fileList.forEach((item) => {
            // console.log(item.uid);
            if (item.uid === file.uid) {
              item.url = `http://${data.Location}`;
              // 只有成功获取到了服务器端图片链接的时候，加一个标识
              // 目的，提交跟新的时候，进行判断，如果当前文件对象里面没有upload属性，不进行提交
              item.upload = true;
            }
          });
          setTimeout(() => {
            this.isShowpro = false;
            this.percentage = 0
          }, 500);
          // data返回数据之后该如何处理
          // console.log("err");
          // console.log(err);
          // console.log("data");
          // console.log(data);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
