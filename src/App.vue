<!-- src/App.vue -->
<template>
  <n-config-provider :theme-overrides="naiveThemeOverrides" :theme="darkTheme">
    <n-message-provider>
      <n-dialog-provider>
        <!-- 라우트에 따라 컴포넌트가 렌더링됨 -->
        <router-view /> 
        <!-- 팝업 -->
        <PopupManager/>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { onMounted } from 'vue';
import PopupManager from '@/components/cmm/PopupManager.vue';
import { useDrawData } from '@/composables/useDrawData';
import { NConfigProvider, NMessageProvider, NDialogProvider, darkTheme } from 'naive-ui'

/** Paraccoon 디자인 가이드 기반 Naive UI 테마 오버라이드 */
const naiveThemeOverrides = {
  InternalSelection: {
    self: {
      textColor: 'rgba(255, 255, 255, 0.9)',
      textColorDisabled: 'rgba(255, 255, 255, 0.5)',
      arrowColor: 'rgba(255, 255, 255, 0.9)',
      arrowColorDisabled: 'rgba(255, 255, 255, 0.4)',
      loadingColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
  common: {
    primaryColor: '#007BFF',
    primaryColorHover: '#00A3FF',
    primaryColorPressed: '#0066CC',
    primaryColorSuppl: '#00A3FF',
    bodyColor: '#181818',
    cardColor: '#2f2f2f',
    modalColor: '#303030',
    popoverColor: '#2c2c2c',
    inputColor: '#3a3a3a',
    textColor: 'rgba(255, 255, 255, 0.9)',
    textColor1: 'rgba(255, 255, 255, 0.82)',
    textColor2: 'rgba(255, 255, 255, 0.6)',
    actionColor: '#353535',
    tableColor: '#2f2f2f',
    tableHeaderColor: '#3d3d3d',
    borderRadius: '8px',
    borderRadiusSmall: '4px',
    fontFamily: "'Pretendard', 'Spoqa Han Sans Neo', 'Noto Sans KR', 'Roboto', 'Inter', sans-serif",
  },
}

const { ensureDrawsLoaded } = useDrawData();

onMounted(() => {
	ensureDrawsLoaded().catch((err) => {
		console.error('회차 정보를 가져오는데 실패했습니다:', err);
	});
});
</script>

<style>
/* 전역 스타일 (필요시) */
</style>
