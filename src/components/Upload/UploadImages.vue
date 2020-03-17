<template>
    <div>
        <el-upload 
        :action="url"
        :headers="setHeaders"
        list-type="picture-card"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :on-success="handleUploadSuccess"
        :on-preview="handlePreview"
        :limit="maxCount"
        :on-exceed="handleExceed">
        <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="image" alt="">
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'UploadImages',
    props: {
        //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount:{
        type:Number,
        default:5
      }
    },
    data() {
        return {
            url: process.env.BASE_API + "/file/uploadPicture",
            setHeaders:{
                'token':this.token
            },
            dialogVisible: false,
            image:null
        }
    },
    computed: {
      fileList() {
        let fileList=[];
        for(let i=0; i<this.value.length; i++){
          fileList.push({url:this.value[i]});
        }
        return fileList;
      }
    },
    methods: {
        emitInput(fileList) {
            let value=[];
            console.log(fileList)
            for(let i=0; i<fileList.length; i++){
                value.push(fileList[i].url);
            }
            console.log(value)
            this.$emit('input', value)
        },
        handleRemove(file, fileList) {
            this.emitInput(fileList);
        },
        handlePreview(file) {
          console.log(file)
            this.dialogVisible = true;
            this.image = file.url;
        },
        beforeUpload(file) {
         if(file===null || !(file.name.match(".jpg") || file.name.match(".png"))){
           this.$message({
            message: '图片格式有问题或图片为空',
            type: 'warning',
            duration: 3000
            })
            return;
         }
      },
      handleUploadSuccess(res, file) {
        if(res.code != 0) {
            this.$message({
                message: res.msg,
                type: 'error',
                duration: 3000
            })
            return;
        }
        this.fileList.push({url: res.data.url});
        this.emitInput(this.fileList);
      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration: 1000
        });
      }
    }
}
</script>