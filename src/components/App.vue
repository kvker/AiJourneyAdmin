<script lang="ts" setup>
import Total from '@components/App/Total.vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  WarnTriangleFilled,
  UserFilled,
  CameraFilled,
  KnifeFork,
  Stamp,
  Comment,
  PhoneFilled,
} from '@element-plus/icons-vue'
import lc from '@libs/lc'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
console.log(lc)
</script>

<template>
  <el-row class=" h-full">
    <el-col :span="4">
      <el-menu default-active="1" class="" @open="handleOpen" @close="handleClose">
        <el-menu-item index="1">
          <el-icon>
            <document />
          </el-icon>
          <span>信息管理</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon>
            <CameraFilled />
          </el-icon>
          <span>景点管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon>
            <Stamp />
          </el-icon>
          <span>商户管理</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon>
            <UserFilled />
          </el-icon>
          <span>人员管理</span>
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon>
            <Comment />
          </el-icon>
          <span>旅行社管理</span>
        </el-menu-item>
        <el-menu-item index="6">
          <el-icon>
            <PhoneFilled />
          </el-icon>
          <span>司机管理</span>
        </el-menu-item>
        <el-menu-item index="7">
          <el-icon>
            <KnifeFork />
          </el-icon>
          <span>饭店管理</span>
        </el-menu-item>
        <el-menu-item index="8">
          <el-icon><icon-menu /></el-icon>
          <span>酒店管理</span>
        </el-menu-item>
        <el-menu-item index="9">
          <el-icon>
            <location />
          </el-icon>
          <span>厕所管理</span>
        </el-menu-item>
        <el-menu-item index="10">
          <el-icon>
            <WarnTriangleFilled />
          </el-icon>
          <span>投诉管理</span>
        </el-menu-item>
        <el-menu-item index="0">
          <el-icon>
            <setting />
          </el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <KeepAlive>
        <Total></Total>
      </KeepAlive>
    </el-col>
  </el-row>
</template>

<style></style>