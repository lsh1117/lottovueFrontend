<template>
	<div>
		<div class="scroll-area">
			<article class="article-area">
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
			<button class="btn-primary btn-small" @click="$emit('close')">닫기</button>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { usePremiumStore } from '@/stores/PremiumStore'

const premiumStore = usePremiumStore()
const isPremium = ref(false)
const isSubscribing = ref(false)

// 프로 상태 계산
const premiumStatus = computed(() => {
	return premiumStore.status && premiumStore.status.length > 0
})

// Android Bridge에서 프로 상태 확인
const checkPremiumStatus = () => {
	if (window.AndroidBridge && window.AndroidBridge.isPremiumUser) {
		isPremium.value = window.AndroidBridge.isPremiumUser()
	}
}

// 구독하기 함수
const subscribe = () => {
	if (isSubscribing.value) {
		console.log('이미 구독 처리 중입니다.')
		return
	}
	
	console.log('구독 하기 버튼 클릭됨')
	console.log('window.AndroidBridge:', window.AndroidBridge)
	console.log('window.AndroidBridge.subscribeMonthly:', window.AndroidBridge?.subscribeMonthly)
	
	// 개발 환경 경고
	if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
		console.warn('⚠️ 개발 환경에서 테스트 중입니다.')
		console.warn('⚠️ 실제 결제가 발생하지 않습니다.')
	}
	
	// Android Bridge를 통해 월간 구독 요청
	// AndroidBridge가 있는지, subscribeMonthly 메서드가 있는지 확인
	const hasAndroidBridge = typeof window !== 'undefined' && window.AndroidBridge
	const hasSubscribeMonthly = hasAndroidBridge && typeof window.AndroidBridge.subscribeMonthly === 'function'
	
	console.log('Android Bridge 체크:', {
		hasAndroidBridge,
		hasSubscribeMonthly,
		androidBridgeType: typeof window.AndroidBridge,
		subscribeMonthlyType: window.AndroidBridge ? typeof window.AndroidBridge.subscribeMonthly : 'N/A'
	})
	
	if (hasAndroidBridge && hasSubscribeMonthly) {
		console.log('Android Bridge 호출 중...')
		isSubscribing.value = true
		try {
			window.AndroidBridge.subscribeMonthly()
			console.log('Android Bridge 호출 완료')
			
			// 10초 후에도 응답이 없으면 타임아웃 처리
			setTimeout(() => {
				if (isSubscribing.value) {
					console.warn('구독 요청 타임아웃 - 응답이 없습니다')
					isSubscribing.value = false
					alert('구독 요청이 시간 초과되었습니다. 다시 시도해주세요.')
				}
			}, 10000)
		} catch (error) {
			console.error('Android Bridge 호출 실패:', error)
			isSubscribing.value = false
			alert('구독 요청 중 오류가 발생했습니다: ' + error.message)
		}
	} else {
		console.error('Android Bridge not available')
		console.log('Android Bridge 상태:', {
			exists: hasAndroidBridge,
			hasSubscribeMonthly: hasSubscribeMonthly,
			userAgent: navigator.userAgent,
			platform: navigator.platform,
			allMethods: hasAndroidBridge ? Object.keys(window.AndroidBridge) : []
		})
		
		// Android Bridge가 없을 때 재시도 옵션 제공
		const retry = confirm('구독 기능을 사용할 수 없습니다.\n\n가능한 해결 방법:\n1. 앱을 완전히 종료하고 다시 시작\n2. 기기 재부팅\n3. Google Play Services 업데이트\n\n지금 다시 시도하시겠습니까?')
		if (retry) {
			// 2초 후 재시도
			setTimeout(() => {
				console.log('재시도 중...')
				subscribe()
			}, 2000)
		}
	}
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

// Android Bridge 초기화 대기 함수
function waitForAndroidBridge(callback, maxRetries = 10, delay = 200) {
	let retries = 0
	
	function checkBridge() {
		const hasBridge = typeof window !== 'undefined' && window.AndroidBridge
		const hasSubscribeMonthly = hasBridge && typeof window.AndroidBridge.subscribeMonthly === 'function'
		
		if (hasBridge && hasSubscribeMonthly) {
			console.log('Android Bridge 초기화 완료')
			callback()
		} else if (retries < maxRetries) {
			retries++
			console.log(`Android Bridge 대기 중... (${retries}/${maxRetries})`)
			setTimeout(checkBridge, delay)
		} else {
			console.warn('Android Bridge 초기화 실패 - 최대 재시도 횟수 도달')
			console.log('Android Bridge 상태:', {
				exists: hasBridge,
				hasSubscribeMonthly: hasSubscribeMonthly,
				allMethods: hasBridge ? Object.keys(window.AndroidBridge) : []
			})
		}
	}
	
	checkBridge()
}

onMounted(() => {
	// 초기 프로 상태 확인
	checkPremiumStatus()
	
	// 이벤트 리스너 등록
	window.addEventListener('lottovue:premium', handlePremiumStatusChange)
	window.addEventListener('lottovue:subscriptionError', handleSubscriptionError)
	window.addEventListener('lottovue:subscriptionSuccess', handleSubscriptionSuccess)
	
	// 디버깅을 위한 전역 함수 등록
	window.testSubscription = () => {
		console.log('테스트 구독 함수 호출됨')
		subscribe()
	}
	
	// Android Bridge 초기화 대기 및 상태 확인
	waitForAndroidBridge(() => {
		// Bridge가 준비되면 상태 확인
		console.log('Android Bridge 상태 확인:', {
			exists: true,
			hasSubscribeMonthly: typeof window.AndroidBridge.subscribeMonthly === 'function',
			hasIsPremiumUser: typeof window.AndroidBridge.isPremiumUser === 'function',
			allMethods: Object.keys(window.AndroidBridge),
			userAgent: navigator.userAgent,
			platform: navigator.platform
		})
	}, 10, 200)
})

onUnmounted(() => {
	// 이벤트 리스너 제거
	window.removeEventListener('lottovue:premium', handlePremiumStatusChange)
	window.removeEventListener('lottovue:subscriptionError', handleSubscriptionError)
	window.removeEventListener('lottovue:subscriptionSuccess', handleSubscriptionSuccess)
})

// 이벤트 정의
defineEmits(['close'])
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
