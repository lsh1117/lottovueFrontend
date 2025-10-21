<template>
	<div>
		<div class="scroll-area">
			<article class="article-area">
				<div class="article-header"></div>
				<div class="article-body">
					<!-- 사용자 정보 섹션 -->
					<div class="box box-round-border">
						<div class="info-item">
							<label class="info-label">사용자 타입</label>
							<div class="info-value">
								<span v-if="isPremium" class="premium-badge">
									👑 프리미엄 사용자
								</span>
								<span v-else class="free-badge">
									⭐ 무료 사용자
								</span>
							</div>
						</div>
						
						<div class="info-item">
							<label class="info-label">계정 상태</label>
							<div class="info-value">
								<span class="status-active">활성</span>
							</div>
						</div>
						
						<div class="info-item" v-if="isPremium">
							<label class="info-label">프리미엄 기능</label>
							<div class="info-value">
								<ul class="premium-features">
									<li>무제한 번호 생성</li>
									<li>고급 통계 분석</li>
									<li>우선 고객 지원</li>
								</ul>
							</div>
						</div>
					</div>
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

// 이벤트 정의
defineEmits(['close'])
</script>
