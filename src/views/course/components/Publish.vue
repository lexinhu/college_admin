<template>
  <div class="app-container">

    <!--课程预览-->
    <div class="ccInfo" >
      <img :src="coursePublish.cover">
      <div class="main" >
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublish.subjectParentTitle }} — {{ coursePublish.subjectTitle }}</span></p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>

      <div class="chapter">
        <ul class="chapterList">
          <li
            v-for="chapter in chapterList"
            :key="chapter.id">
            <p>
              {{ chapter.title }}
            </p>
          </li>
        </ul>
      </div>

    </div>

    <div style="text-align:center">
      <el-button type="primary" @click="prev()">上一步</el-button>
      <el-button :disabled="publishBtnDisabled" type="primary" @click="publish()">发布课程</el-button>
    </div>
  </div>
</template>

<script>
import courseApi from '@/api/course'
import chapterApi from '@/api/chapter'
export default {
  data() {
    return {
      publishBtnDisabled: false, // 按钮是否禁用
      coursePublish: {},
      chapterList: [] // 章节嵌套列表
    }
  },
  created() {
    if (this.$parent.courseId) {
      this.fetchCoursePublishById(this.$parent.courseId)
    }
  },

  methods: {
    // 获取课程发布信息
    fetchCoursePublishById(id) {
      courseApi.getCoursePublishById(id).then(response => {
        this.coursePublish = response.data.item
        this.fetchNodeList()
      })
    },

    // 获取主章节数据
    fetchNodeList() {
      chapterApi.getNestedTreeList(this.$parent.courseId).then(response => {
        this.chapterList = response.data.items
      })
    },

    // 上一步
    prev() {
      this.$parent.active = 1
    },

    // 下一步
    publish() {
      this.publishBtnDisabled = true
      courseApi.publishCourseById(this.$parent.courseId).then(response => {
        this.$parent.active = 3
        this.$message.success(response.message)
      })
    }
  }
}
</script>
<style>
.ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 100%;
    height: 50%;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
  border: rgb(128, 116, 116) 1px dashed;
  width: 100%;
  height: 100%;
    margin: 12px auto;
    float: left;
    text-align: center;
}

.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}

.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    font-size: 28px;
    color: #bb2457;
    font-weight: normal;
}
.ccInfo .chapter {
  margin-left: 30px;
  float: left;
}
.ccInfo .chapter ul li  {
  display:inline-block
}
</style>
