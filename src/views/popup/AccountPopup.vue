<template>
	<div>
		<div class="scroll-area">
			<article class="article-area">
				<div class="article-header"></div>
				<div class="article-body">
					<!-- 사용자 정보 섹션 -->
					<div class="box box-round-border">
						<div>
							<span v-if="isPremium" class="message-name">
								👑 프리미엄 사용자
							</span>
							<span v-else class="message-name">
								⭐ 무료 사용자
							</span>
						</div>
						<div style="margin-top: 10px;">
							<p><span class="message-info">무료 사용자는 최대 회차별 2개까지 번호를 생성할 수 있습니다.</span></p>
							<p><span class="message-info">프리미엄 사용자는 최대 회차별 최대 100개까지 번호를 생성할 수 있습니다.</span></p>
						</div>
					</div>
				</div>
				<div v-if="!isPremium" class="article-footer">
					<!-- 구독 하기 -->
					<button class="btn-secondary btn-large" @click="subscribe">프리미엄 월간 990원 구독 하기</button>
				</div>
			</article>
		</div>
		
		<div class="btn-area btn-area-center">
			<button class="btn-primary btn-small" @click="$emit('close')">닫기</button>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { usePremiumStore } from '@/stores/PremiumStore'

const premiumStore = usePremiumStore()

// 프리미엄 상태 계산
const isPremium = computed(() => {
	return premiumStore.status && premiumStore.status.length > 0
})

const subscribe = () => {
	console.log('구독 하기')
	// Android Bridge를 통해 월간 구독 요청
	if (window.AndroidBridge && window.AndroidBridge.subscribeMonthly) {
		window.AndroidBridge.subscribeMonthly()
	} else {
		console.error('Android Bridge not available')
	}
}

// 이벤트 정의
defineEmits(['close'])
</script>
