<!-- src/App.vue -->
<template>
  <!-- 라우트에 따라 컴포넌트가 렌더링됨 -->
  <router-view /> 
  <!-- 팝업 -->
  <PopupManager/>
</template>

<script setup>
// 특별한 설정 필요 없음
import PopupManager from '@/components/cmm/PopupManager.vue';
</script>

<style>
/* 전역 스타일 (필요시) */
</style>
