<template>
    <div style="margin-top: 50px">
        <el-form :model="value" ref="product" label-width="120px" style="width: 720px" size="small">
            <el-form-item label="商品图片：">
                <upload-images v-model="selectProductImages"></upload-images>
            </el-form-item>
            <el-row style="margin-top:20px" label="详情：">
                    <mavon-editor ref=md @imgAdd="$imgAdd" :ishljs = "true" v-model="value.context"/>
            </el-row>
            <el-form-item style="text-align: center;margin-top: 40px">
                <el-button size="medium" @click="handlePrev">上一步，填写商品基本信息</el-button>
                <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>
<script>
import {fileUpload} from '@/api/api'
import UploadImages from '@/components/Upload/uploadImages'
import hlj from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
export default {
    name: "ProductImageEdit",
    components: {UploadImages},
    props: {
       value: Object,
       isEdit: {
        type: Boolean,
        default: false
      } 
    },
    data() {
        return {
            //编辑模式时是否初始化成功
            hasEditCreated:false
            //商品富文本详情激活类型
        }
    },
    computed: {
        //商品的编号
      productId(){
        return this.value.id;
      },
      markedToHtml() {
        marked.setOptions({
            highlight: function(code) {
                return hlj.highlightAuto(code).value;
            }
        });
        return marked(this.value.context);
     },
      selectProductImages: {
          get:function () {
          let images=[];
          if(this.value.image === undefined || this.value.image == null || this.value.image === ''){
            return images;
          }
          let imageList = this.value.image.split(',');
          for(let i=0;i<imageList.length;i++){
            images.push(imageList[i]);
          }
          return images;
        },
        set:function (newValue) {
            console.log(newValue)
          if (newValue == null || newValue.length === 0) {
            this.value.image = null;
          } else {
            this.value.image = newValue[0];
            if (newValue.length > 1) {
              for (let i = 1; i < newValue.length; i++) {
                this.value.image = this.value.image + ',' + newValue[i];
              }
            }
            console.log(this.value.image)
          }
        }
      }
    },
    watch: {
        productId:function (newValue) {
            if(!this.isEdit)
                return;
            if(this.hasEditCreated)
                return;
            if(newValue===undefined||newValue==null||newValue===0)
                return;
            this.handleEditCreated();
        }
    },
    methods: {
        handleEditCreated() {
        //根据商品属性分类id获取属性和参数
            if(this.value.image != null){
                this.hasEditCreated=true;
            }
        },
        // 绑定@imgAdd event
        $imgAdd(pos, $file){
                // getFileUploadToken($file.name, $file.size).then(response => {
                    // console.log(response.message)
                    // 第一步.将图片上传到服务器.
                var formdata = new FormData();
                formdata.append('file', $file);
                console.log(formdata)
                fileUpload(formdata).then(response => {
                    console.log(response)
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    /**
                    * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                    * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                    * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                    */

                    this.$refs.md.$img2Url(pos, response.url);
                }).catch(error => {
                    this.$message({
                        message: '添加图片失败',
                        type: 'error',
                        duration: 1000
                    })
                    return;
                })
                // }).catch(error => {
                //     this.$message({
                //         message: '添加图片失败',
                //         type: 'error',
                //         duration: 1000
                //     })
                //     return;
                // })
                
        },
        handlePrev(){
            this.$emit('prevStep')
        },
        handleFinishCommit(){
            this.$emit('finishCommit',this.isEdit);
        }
    }
}
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    background: #F8F9FC;
  }
</style>