<!-- src/components/layouts/DefaultLayout.vue -->
<template>
    <div>
      <Header /> <!-- 공통 헤더 컴포넌트 -->
      <main class="main-area">
        <router-view/> <!-- 각 페이지에서 렌더링될 내용을 삽입 -->
      </main>
      <Footer /> <!-- 공통 푸터 컴포넌트 -->
    </div>
  </template>
  
  <script setup>
  // 헤더, 푸터 컴포넌트 임포트
  import Header from '../cmm/Header.vue'
  import Footer from '../cmm/Footer.vue'
  </script>
  