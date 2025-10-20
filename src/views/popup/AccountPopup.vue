<template>
	<div class="account-popup">
		<div class="popup-header">
			<h2 class="popup-title">계정 정보</h2>
		</div>
		
		<div class="account-content">
			<!-- 사용자 정보 섹션 -->
			<div class="info-section">
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
			
			<!-- 앱 정보 섹션 -->
			<div class="info-section">
				<h3 class="section-title">앱 정보</h3>
				<div class="info-item">
					<label class="info-label">앱 버전</label>
					<div class="info-value">1.0.0</div>
				</div>
				<div class="info-item">
					<label class="info-label">마지막 업데이트</label>
					<div class="info-value">{{ lastUpdateDate }}</div>
				</div>
			</div>
		</div>
		
		<div class="btn-area btn-area-center">
			<button class="btn btn-primary" @click="$emit('close')">닫기</button>
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

// 마지막 업데이트 날짜
const lastUpdateDate = computed(() => {
	const now = new Date()
	return now.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
})

// 이벤트 정의
defineEmits(['close'])
</script>

<style scoped>
.account-popup {
	padding: 20px;
	max-width: 400px;
	margin: 0 auto;
}

.popup-header {
	text-align: center;
	margin-bottom: 24px;
}

.popup-title {
	font-size: 1.5rem;
	font-weight: bold;
	color: #333;
	margin: 0;
}

.account-content {
	margin-bottom: 24px;
}

.info-section {
	margin-bottom: 24px;
	padding: 16px;
	background-color: #f8f9fa;
	border-radius: 8px;
	border: 1px solid #e9ecef;
}

.section-title {
	font-size: 1.1rem;
	font-weight: 600;
	color: #495057;
	margin: 0 0 16px 0;
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12px;
}

.info-item:last-child {
	margin-bottom: 0;
}

.info-label {
	font-weight: 500;
	color: #6c757d;
	min-width: 100px;
	flex-shrink: 0;
}

.info-value {
	color: #333;
	text-align: right;
	flex: 1;
}

.premium-badge {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	color: #ffd700;
	font-weight: 600;
	background: linear-gradient(135deg, #ffd700, #ffed4e);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.free-badge {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	color: #6c757d;
	font-weight: 500;
}

.status-active {
	color: #28a745;
	font-weight: 600;
}

.premium-features {
	list-style: none;
	padding: 0;
	margin: 0;
	text-align: left;
}

.premium-features li {
	padding: 4px 0;
	color: #495057;
	position: relative;
	padding-left: 16px;
}

.premium-features li::before {
	content: "✓";
	position: absolute;
	left: 0;
	color: #28a745;
	font-weight: bold;
}

.btn-area {
	display: flex;
	gap: 12px;
	justify-content: center;
}

.btn {
	padding: 10px 20px;
	border: none;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.btn-primary {
	background-color: #007bff;
	color: white;
}

.btn-primary:hover {
	background-color: #0056b3;
	transform: translateY(-1px);
}

.btn-primary:active {
	transform: translateY(0);
}

/* 반응형 디자인 */
@media (max-width: 480px) {
	.account-popup {
		padding: 16px;
	}
	
	.info-item {
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
	}
	
	.info-value {
		text-align: left;
	}
}
</style>
