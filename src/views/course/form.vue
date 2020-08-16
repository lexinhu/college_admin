<template>
  <div class="app-container">

    <!-- <h1 style="text-align: center">编辑课程</h1> -->
    <!-- <el-steps :active="active" finish-status="success" simple style="margin-bottom: 40px">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps> -->
    <el-steps :active="active" align-center style="margin: 30px auto">
      <el-step title="基本信息" icon="el-icon-edit" description="编辑课程基本信息如课程名价格等"/>
      <el-step title="视频章节" icon="el-icon-upload" description="编辑课程章节及上传相应教学视频"/>
      <el-step title="课程大纲" icon="el-icon-picture" description="一个关于该课程的最终汇总"/>
      <el-step title="发布课程" icon="el-icon-check" description="最终确定并正式发布课程"/>
    </el-steps>

    <!-- <el-steps :active="2" align-center>
      <el-step title="步骤1" description="这是一段很长很长很长的描述性文字"/>
      <el-step title="步骤2" description="这是一段很长很长很长的描述性文字"/>
      <el-step title="步骤3" description="这是一段很长很长很长的描述性文字"/>
      <el-step title="步骤4" description="这是一段很长很长很长的描述性文字"/>
    </el-steps> -->

    <!-- 填写课程基本信息 -->
    <info v-if="active === 0" />

    <!-- 创建课程大纲 -->
    <chapter v-if="active === 1" />

    <!-- 发布课程 -->
    <Publish v-if="active === 2 || active === 3" />

  </div>
</template>

<script>
// 引入子组件
import Info from '@/views/course/components/Info'
import Chapter from '@/views/course/components/Chapter'
import Publish from '@/views/course/components/Publish'

export default {
  components: { Info, Chapter, Publish }, // 注册子组件
  data() {
    return {
      active: 0,
      courseId: null
    }
  },
  created() {
    // 获取路由id
    if (this.$route.name === 'CourseInfoEdit') {
      this.courseId = this.$route.params.id
      this.active = 0
    }

    if (this.$route.name === 'CourseChapterEdit') {
      this.courseId = this.$route.params.id
      this.active = 2
    }
  }
}
</script>
