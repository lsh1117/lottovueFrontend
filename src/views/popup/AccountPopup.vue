<template>
	<div>
		<div class="scroll-area">
			<!-- 로그인 전 화면 -->
			<article v-if="!authenticated" class="article-area">
				<div class="article-header"></div>
				<div class="article-body">
					<div class="box box-round-border">
						<div style="text-align: center; padding: 20px;">
							<p style="margin-bottom: 20px; font-size: 16px; color: #666;">
								로그인이 필요합니다.<br>
								카카오 로그인으로 간편하게 시작하세요.
							</p>
							<button 
								class="btn-primary btn-large" 
								@click="goToLogin"
							>
								카카오 로그인
							</button>
						</div>
					</div>
				</div>
			</article>
			
			<!-- 로그인 후 화면 -->
			<article v-else class="article-area">
				<div class="article-header"></div>
				<div class="article-body">
					<!-- 사용자 정보 섹션 -->
					<div class="box box-round-border">
						<div class="user-status">
							<span v-if="isPremium" class="premium-badge" title="프로 사용자">
								<svg class="premium-icon" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
									<defs>
										<linearGradient id="accountGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
											<stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
											<stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
										</linearGradient>
									</defs>
									<!-- 골드색 그라데이션 배지 -->
									<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#accountGoldGradient)"/>
									<!-- pro 텍스트 -->
									<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">pro</text>
								</svg>
								<span class="status-text">프로 사용자</span>
							</span>
							<span v-else class="free-badge" title="무료 사용자">
								<svg class="free-icon" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
									<defs>
										<linearGradient id="accountGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
											<stop offset="50%" style="stop-color:#66BB6A;stop-opacity:1" />
											<stop offset="100%" style="stop-color:#81C784;stop-opacity:1" />
										</linearGradient>
									</defs>
									<!-- 녹색 그라데이션 배지 -->
									<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#accountGreenGradient)"/>
									<!-- free 텍스트 -->
									<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">free</text>
								</svg>
								<span class="status-text">무료 사용자</span>
							</span>
						</div>
						<div style="margin-top: 10px;">
							<p v-if="user"><span class="message-info">닉네임: {{ user.nickname }}</span></p>
							<p v-if="user && user.email"><span class="message-info">이메일: {{ user.email }}</span></p>
							<p><span class="message-info">무료 사용자는 최대 회차별 2개까지 번호를 생성할 수 있습니다.</span></p>
							<p><span class="message-info">프로 사용자는 최대 회차별 최대 100개까지 번호를 생성할 수 있습니다.</span></p>
						</div>
					</div>
				</div>
				<div v-if="!isPremium" class="article-footer">
					<!-- 구독 하기 -->
					<button 
						class="btn-secondary btn-large" 
						@click="subscribe"
						:disabled="isSubscribing"
					>
						<span v-if="isSubscribing">구독 처리 중...</span>
						<span v-else>프로 월간 990원 구독 하기</span>
					</button>
				</div>
			</article>
		</div>
		
		<div class="btn-area btn-area-center">
			<button v-if="authenticated" class="btn-secondary btn-small" @click="handleLogout" style="margin-right: 10px;">로그아웃</button>
			<button class="btn-primary btn-small" @click="$emit('close')">닫기</button>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePremiumStore } from '@/stores/PremiumStore'
import { isAuthenticated, getUser, logout } from '@/utils/auth'

const router = useRouter()
const premiumStore = usePremiumStore()
const isPremium = ref(false)
const isSubscribing = ref(false)
const user = ref(null)

// 로그인 상태 확인 (반응형)
const authenticated = computed(() => {
	return isAuthenticated()
})

// 프로 상태 계산
const premiumStatus = computed(() => {
	return premiumStore.status && premiumStore.status.length > 0
})

// 로그인 페이지로 이동
const goToLogin = () => {
	emit('close')
	router.push('/login')
}

// 로그아웃 처리
const handleLogout = () => {
	logout()
	user.value = null
	isPremium.value = false
	premiumStore.updateStatus('')
	emit('close')
	// 로그인 페이지로 이동
	router.push('/login')
}

// 프로 상태 확인
const checkPremiumStatus = () => {
	// 사용자 정보에서 플랜 확인
	if (user.value) {
		isPremium.value = user.value.plan === '프로' || user.value.plan === 'max'
		premiumStore.updateStatus(isPremium.value ? 'premium' : '')
	}
}

// 구독하기 함수 (웹 환경에서는 백엔드 API 호출)
const subscribe = () => {
	if (isSubscribing.value) {
		console.log('이미 구독 처리 중입니다.')
		return
	}
	
	console.log('구독 하기 버튼 클릭됨')
	
	// 웹 환경에서는 백엔드 API를 통해 구독 처리
	// TODO: 백엔드 API 연동 필요
	alert('웹 환경에서는 구독 기능이 아직 구현되지 않았습니다.')
	isSubscribing.value = false
}

// 프로 상태 변경 이벤트 리스너
const handlePremiumStatusChange = (event) => {
	console.log('프로 상태 변경:', event.detail)
	isPremium.value = event.detail.isPremium
	// ProStore도 업데이트
	premiumStore.updateStatus(event.detail.isPremium ? 'premium' : '')
}

// 구독 에러 이벤트 리스너
const handleSubscriptionError = (event) => {
	console.error('구독 에러:', event.detail.message)
	isSubscribing.value = false
	
	// 에러 메시지에 따른 추가 안내
	const errorMessage = event.detail.message
	if (errorMessage.includes('Google Play Services')) {
		alert(`${errorMessage}\n\n해결 방법:\n1. Google Play Store에서 Google Play Services 업데이트\n2. 앱 재시작\n3. 기기 재부팅`)
	} else if (errorMessage.includes('초기화')) {
		alert(`${errorMessage}\n\n해결 방법:\n1. 앱 완전 종료 후 재시작\n2. 기기 재부팅\n3. Google Play Services 확인`)
	} else {
		alert(errorMessage)
	}
}

// 구독 성공 이벤트 리스너
const handleSubscriptionSuccess = (event) => {
	console.log('구독 성공:', event.detail.message)
	isSubscribing.value = false
	alert(event.detail.message)
	// 프로 상태 업데이트
	checkPremiumStatus()
}


onMounted(() => {
	// 저장된 사용자 정보 확인
	if (isAuthenticated()) {
		user.value = getUser()
		checkPremiumStatus()
	}
	
	// 이벤트 리스너 등록
	window.addEventListener('lottovue:premium', handlePremiumStatusChange)
	window.addEventListener('lottovue:subscriptionError', handleSubscriptionError)
	window.addEventListener('lottovue:subscriptionSuccess', handleSubscriptionSuccess)
	
	// 사용자 정보 업데이트 이벤트 리스너 (로그인 후)
	window.addEventListener('lottovue:userUpdated', () => {
		user.value = getUser()
		checkPremiumStatus()
	})
})

onUnmounted(() => {
	// 이벤트 리스너 제거
	window.removeEventListener('lottovue:premium', handlePremiumStatusChange)
	window.removeEventListener('lottovue:subscriptionError', handleSubscriptionError)
	window.removeEventListener('lottovue:subscriptionSuccess', handleSubscriptionSuccess)
})

// 이벤트 정의
const emit = defineEmits(['close'])
</script>

<style scoped>
.user-status {
	display: flex;
	align-items: center;
	gap: 12px;
}

.premium-badge,
.free-badge {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.premium-badge .premium-icon,
.free-badge .free-icon {
	width: 64px;
	height: 24px;
	display: block;
	flex-shrink: 0;
}

.premium-badge .premium-icon {
	filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.4));
}

.free-badge .free-icon {
	filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
}

.status-text {
	font-size: 16px;
	font-weight: 600;
}
</style>
