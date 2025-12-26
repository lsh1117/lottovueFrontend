<template>
  <div class="adsense-container" :class="containerClass">
    <ins
      class="adsbygoogle"
      :style="adStyle"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="fullWidthResponsive"
    ></ins>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  // AdSense 클라이언트 ID (필수)
  adClient: {
    type: String,
    default: 'ca-pub-7539747702104892'
  },
  // 광고 슬롯 ID (필수 - AdSense에서 생성한 광고 단위 ID)
  adSlot: {
    type: String,
    required: true
  },
  // 광고 형식 (예: 'auto', 'horizontal', 'vertical', 'rectangle')
  adFormat: {
    type: String,
    default: 'auto'
  },
  // 반응형 광고 여부
  fullWidthResponsive: {
    type: String,
    default: 'true'
  },
  // 컨테이너 클래스
  containerClass: {
    type: String,
    default: ''
  },
  // 광고 스타일 (width, height 등)
  adStyle: {
    type: String,
    default: 'display:block'
  }
})

const adsInitialized = ref(false)

// AdSense 광고 초기화
function initializeAd() {
  // 이미 초기화되었거나 adsbygoogle이 로드되지 않았으면 스킵
  if (adsInitialized.value || !window.adsbygoogle) {
    return
  }

  try {
    // AdSense 광고 초기화
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    adsInitialized.value = true
  } catch (error) {
    console.error('AdSense 광고 초기화 오류:', error)
  }
}

// AdSense 스크립트 로드 확인 및 초기화
function checkAndInitAd() {
  // adsbygoogle이 이미 로드되어 있으면 바로 초기화
  if (window.adsbygoogle) {
    initializeAd()
  } else {
    // 스크립트가 로드될 때까지 대기
    const checkInterval = setInterval(() => {
      if (window.adsbygoogle) {
        clearInterval(checkInterval)
        initializeAd()
      }
    }, 100)

    // 5초 후에도 로드되지 않으면 타임아웃
    setTimeout(() => {
      clearInterval(checkInterval)
      if (!adsInitialized.value) {
        console.warn('AdSense 스크립트 로드 타임아웃')
      }
    }, 5000)
  }
}

onMounted(() => {
  // 컴포넌트가 마운트된 후 약간의 지연을 두고 광고 초기화
  // Vue의 DOM 업데이트가 완료된 후 실행되도록 함
  setTimeout(() => {
    checkAndInitAd()
  }, 100)
})

onBeforeUnmount(() => {
  // 컴포넌트 언마운트 시 정리 작업 (필요시)
})
</script>

<style scoped>
.adsense-container {
  display: block;
  text-align: center;
  margin: 20px 0;
}

.adsense-container :deep(.adsbygoogle) {
  display: block;
  width: 100%;
  max-width: 100%;
}
</style>

