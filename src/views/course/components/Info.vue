<template>
  <div class="app-container">

    <!-- 课程信息表单 -->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 课程讲师  -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.value"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <!-- 所属分类  -->
      <el-form-item label="课程分类">
        <div class="block">
          <el-cascader
            v-model="subjectOjt"
            :options="subjectList"
            :props="{label: 'title', value: 'id'}"
            @change="handleChange"
          />
        </div>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介  -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面  -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          :action="BASE_API+'/admin/oss/file/upload?module=cover'"
          class="cover-uploader">
          <img v-if="courseInfo.cover" :src="courseInfo.cover">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext()">保存并下一步</el-button>
    </div>
  </div>
</template>

<script>
import courseApi from '@/api/course'
import teacherApi from '@/api/teacher'
import subjectApi from '@/api/subject'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 按钮是否禁用
      BASE_API: process.env.BASE_API,
      courseInfo: {// 表单数据
        price: 0,
        lessonNum: 0,
        // 以下解决表单数据不全时insert语句非空校验
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
        description: ''
      },
      teacherList: [], // 课程讲师列表
      subjectList: [], // 课程分类列表
      subjectOjt: [] // 课程分类选中
    }
  },
  created() {
    // 数据回显
    if (this.$parent.courseId) {
      this.fetchCourseInfoById(this.$parent.courseId)
    }
    this.initTeacher()
    this.initSubject()
  },

  methods: {
    // 保存并下一步
    saveAndNext() {
      if (this.$parent.courseId) {
        this.updateData()
      } else {
        this.saveData()
      }
      this.saveBtnDisabled = true
      this.$parent.active = 1
    },
    // 保存
    saveData() {
      courseApi.saveCourseInfo(this.courseInfo).then(response => {
        this.$parent.courseId = response.data.courseId
        this.$message.success(response.message)
      })
    },
    // 修改
    updateData() {
      courseApi.updateCourseInfoById(this.courseInfo).then(response => {
        this.$message.success(response.message)
      })
    },

    // 获取讲师列表
    initTeacher() {
      teacherApi.list().then(response => {
        this.teacherList = response.data.items
      })
    },

    // 获取课程分类列表
    initSubject() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectList = this.getTreeData(response.data.items)
      })
    },

    // 去掉级联课程分类中的children空白
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children == null || data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
        }
      }
      return data
    },
    // 课程分类id赋值
    handleChange(subjectId) {
      this.courseInfo.subjectParentId = subjectId[0]
      this.courseInfo.subjectId = subjectId[1]
    },
    // 封面上传成功函数
    handleCoverSuccess(res) {
      if (res.success) {
        this.courseInfo.cover = res.data.url

        console.log(this.courseInfo.cover)
        // 重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败,请联系网站管理员')
      }
    },
    // 封面上传之前执行的函数
    beforeCoverUpload(file) {
      const isJPGorPNG = (file.type === 'image/jpeg') || (file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPGorPNG) {
        this.$message.error('上传封面图片只能是 JPG/PNG 格式！')
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 1MB!')
      }
      return isJPGorPNG && isLt2M
    },
    handleCoverError(res) {
      this.$message.error('上传失败（http失败）')
    },
    // 上一步数据回显
    fetchCourseInfoById(id) {
      courseApi.getCourseInfoById(id).then(response => {
        this.courseInfo = response.data.item
        this.subjectOjt[0] = this.courseInfo.subjectParentId
        this.subjectOjt[1] = this.courseInfo.subjectId
      })
    }

  }
}
</script>
<style>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cover-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}
.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
