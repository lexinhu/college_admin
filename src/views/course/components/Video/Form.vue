<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible="dialogVisible" title="添加课时" @close="close()">
    <el-form :model="video" label-width="120px">
      <el-form-item label="课时标题">
        <el-input v-model="video.title"/>
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input-number v-model="video.sort" :min="0" />
      </el-form-item>
      <el-form-item label="是否免费">
        <el-radio-group v-model="video.free">
          <el-radio :label="true">免费</el-radio>
          <el-radio :label="false">默认</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 上传视频 -->
      <el-form-item label="上传视频">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-exceed="handleUploadExceed"
          :http-request="uploadVideo"
          :file-list="fileList"
          :before-remove="handleBeforeRemove"
          :on-remove="handleOnRemove"
          :limit="1"
          :action="''"
          drag>
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将文件拖到此处，或<em>选择文件</em></div>
        </el-upload>
        <el-button
          :disabled="uploadBtnDisabled"
          size="primary"
          type="success"
          @click="submitUpload()">点我上传<i class="el-icon-upload el-icon--right"/></el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import videoApi from '@/api/video'
import vodApi from '@/api/vod'
import TcVod from 'vod-js-sdk-v6'

export default {
  data() {
    return {
      dialogVisible: false, // 是否显示对话框
      video: {
        sort: 0,
        free: false
      },
      fileList: [], // 上传文件列表
      uploadBtnDisabled: false,
      signature: ''
    }
  },

  mounted() {
    videoApi.getSignature().then(response => {
      const signature = response.data.signature
      this.signature = signature
    })
  },

  methods: {
    // 显示对话框
    open(chapterId, videoId) {
      this.dialogVisible = true
      this.video.chapterId = chapterId
      if (videoId) {
        videoApi.getById(videoId).then(response => {
          this.video = response.data.item
          // 回显
          if (this.video.videoOriginalName) {
            this.fileList = [{ 'name': this.video.videoOriginalName }]
          }
        })
      }
    },

    // 上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('请先删除已上传的视频')
    },

    // 上传
    submitUpload() {
      this.uploadBtnDisabled = true
      this.$refs.upload.submit() // 提交上传请求
    },

    // 获取腾讯云点播视频上传签名
    getSignature() {
      return this.signature
    },

    uploadVideo(upload) {
      const file = upload.file
      // const signature = this.signature
      const tcVod = new TcVod({
        getSignature: this.getSignature // 前文中所述的获取上传签名的函数
      })
      const uploader = tcVod.upload({
        mediaFile: file // 媒体文件（视频或音频或图片），类型为 File
      })
      uploader.on('media_progress', function(info) {
        console.log(info.percent) // 进度
      })
      uploader.done().then((doneResult) => {
        // console.log(doneResult.fileId)
        upload.onSuccess(doneResult.fileId, file)
      }).catch((err) => {
        upload.onError(err)
      })
    },

    // 视频上传成功的回调
    handleUploadSuccess(fileId, file) {
      this.uploadBtnDisabled = false
      this.video.videoSourceId = fileId
      this.video.videoOriginalName = file.name
    },

    // // 视频上传成功的回调
    // handleUploadSuccess(response, file, fileList) {
    //   this.uploadBtnDisabled = false
    //   if (response.success) {
    //     this.video.videoSourceId = response.data.videoId
    //     this.video.videoOriginalName = file.name
    //   } else {
    //     this.$message.error('上传失败')
    //   }
    // },

    // 失败回调
    handleUploadError() {
      this.uploadBtnDisabled = false
      this.$message.error('上传失败')
    },

    // 关闭页面
    close() {
      this.dialogVisible = false
      // 重置表单
      this.resetForm()
    },

    resetForm() {
      this.video = {
        sort: 0,
        free: false
      }
      this.fileList = [] // 重置视频上传列表
    },

    // 保存和更新
    saveOrUpdate() {
      if (!this.video.id) {
        this.save()
      } else {
        this.update()
      }
    },

    save() {
      this.video.courseId = this.$parent.$parent.courseId
      videoApi.save(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchNodeList()
      })
    },

    update() {
      videoApi.updateById(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchNodeList()
      })
    },

    // 删除视频文件确认
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    // 执行视频文件的删除
    handleOnRemove(file, fileList) {
      if (!this.video.videoSourceId) {
        return
      }
      vodApi.removeByVodId(this.video.videoSourceId).then(response => {
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        videoApi.updateById(this.video)
        this.$message.success(response.message)
      })
    }
  }
}
</script>
