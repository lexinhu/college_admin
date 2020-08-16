<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="输入查询条件"
      style="margin-bottom:30px;"/>
    <el-tree
      ref="subjectTree"
      :props="defaultProps"
      :data="subjectList"
      :filter-node-method="filterNode"/>
  </div>
</template>
<script>
import subjectApi from '@/api/subject'
export default {
  data() {
    return {
      subjectList: [], // 数据列表
      filterText: '', // 过滤文本
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {

    filterText(val) {
      this.$refs.subjectTree.filter(val)// 调用tree的filter方法
    }
  },
  created() {
    this.fetchNodeList()
  },
  methods: {
    // 获取远程数据
    fetchNodeList() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectList = response.data.items
      })
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true
      // 忽略大小写
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>
