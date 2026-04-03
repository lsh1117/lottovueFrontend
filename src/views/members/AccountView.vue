<template>
	<div class="AccountView">
		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">계정 정보</h4>
			</div>
			<div class="section-body">
				<div class="box-area">
					<div class="box box-round-bg account-card">
						<div v-if="user" class="user-status">
							<span v-if="user.plan === 'max'" class="max-badge" title="Max Plan 사용자">
								<svg class="max-icon" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<defs>
										<linearGradient id="accountViewPurpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" style="stop-color: #9c27b0; stop-opacity: 1" />
											<stop offset="50%" style="stop-color: #7b1fa2; stop-opacity: 1" />
											<stop offset="100%" style="stop-color: #6a1b9a; stop-opacity: 1" />
										</linearGradient>
									</defs>
									<rect x="0" y="0" width="80" height="32" rx="6" fill="url(#accountViewPurpleGradient)" />
									<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">max</text>
								</svg>
								<span class="status-text">Max Plan 사용자</span>
							</span>
							<span v-else-if="user.plan === 'pro'" class="premium-badge" title="Pro Plan 사용자">
								<svg class="premium-icon" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<defs>
										<linearGradient id="accountViewGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" style="stop-color: #ffd700; stop-opacity: 1" />
											<stop offset="50%" style="stop-color: #ffa500; stop-opacity: 1" />
											<stop offset="100%" style="stop-color: #ff8c00; stop-opacity: 1" />
										</linearGradient>
									</defs>
									<rect x="0" y="0" width="80" height="32" rx="10" fill="url(#accountViewGoldGradient)" />
									<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">pro</text>
								</svg>
								<span class="status-text">Pro 사용자</span>
							</span>
							<span v-else class="free-badge" title="Free Plan 사용자">
								<svg class="free-icon" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<defs>
										<linearGradient id="accountViewGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" style="stop-color: #4caf50; stop-opacity: 1" />
											<stop offset="50%" style="stop-color: #66bb6a; stop-opacity: 1" />
											<stop offset="100%" style="stop-color: #81c784; stop-opacity: 1" />
										</linearGradient>
									</defs>
									<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#accountViewGreenGradient)" />
									<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">free</text>
								</svg>
								<span class="status-text">무료 사용자</span>
							</span>
						</div>

						<div v-if="user" class="account-summary">
							<n-table :bordered="true" :single-line="false" size="small">
								<colgroup>
									<col style="width: 150px;">
									<col style="width: calc(100% - 150px);">
								</colgroup>
								<tbody>
									<tr>
										<th>닉네임</th>
										<td class="tl"><n-text>{{ user.nickname }}</n-text></td>
									</tr>
									<tr>
										<th>이메일</th>
										<td class="tl">
											<n-space horizontal align="center">
												<n-text>{{ user.email || '미등록' }}</n-text>
												<button v-if="!user.email" type="button" class="btn-primary btn-small" @click="openEmailVerificationDialog">이메일 인증</button>
											</n-space>
										</td>
									</tr>
									<tr>
										<th>잔여 크레딧</th>
										<td class="tl"><n-text strong>{{ userCredits }}개</n-text></td>
									</tr>
									<tr>
										<th>플랜 잔여 크레딧</th>
										<td class="tl"><n-text>{{ remainingPlanCredits }}개</n-text></td>
									</tr>
									<tr>
										<th>구매 잔여 크레딧</th>
										<td class="tl"><n-text>{{ remainingPurchasedCredits }}개</n-text></td>
									</tr>
								</tbody>
							</n-table>

							<n-alert v-if="user.plan === 'free'" type="success" :bordered="false" class="plan-alert">
								<strong>Free Plan</strong><br>
								회차별 최대 2개까지 생성 번호 저장 가능<br>
								주간 크레딧: 2개 (크레딧 1개 = 랜덤번호 1개 생성)
							</n-alert>
							<n-alert v-else-if="user.plan === 'pro'" type="warning" :bordered="false" class="plan-alert">
								<strong>Pro Plan</strong><br>
								회차별 최대 100개까지 생성 번호 저장 가능<br>
								주간 크레딧: 100개 (크레딧 1개 = 랜덤번호 1개 생성)
							</n-alert>
							<n-alert v-else-if="user.plan === 'max'" type="info" :bordered="false" class="plan-alert">
								<strong>Max Plan</strong><br>
								회차별 최대 1000개까지 생성 번호 저장 가능<br>
								주간 크레딧: 1000개 (크레딧 1개 = 랜덤번호 1개 생성)
							</n-alert>
						</div>

						<div v-if="user" class="account-popup-actions">
							<button type="button" class="btn-primary btn-large btn-full" @click="goToCreditsPurchase">
								크레딧 추가 구매
							</button>
							<button v-if="user.plan !== 'max'" type="button" class="btn-secondary btn-large btn-full" @click="goToPlanUpgrade" :disabled="isSubscribing">
								<span v-if="isSubscribing">처리 중...</span>
								<span v-else>Plan 업그레이드 하기</span>
							</button>
							<button v-if="user.email" type="button" class="btn-secondary btn-large btn-full" @click="goToEmailChangePassword">
								비밀번호 변경
							</button>
							<button type="button" class="btn-secondary btn-large btn-full" @click="handleLogout">
								로그아웃
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { computed, h, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NAlert, NTable, NText, useDialog, NSpace } from 'naive-ui'
import { usePremiumStore } from '@/stores/PremiumStore'
import { useEventStore } from '@/stores/EventStore'
import { isAuthenticated, getUser, logout } from '@/utils/auth'
import loginApi from '@/api/login'
import EmailVerificationPopup from '@/views/popup/EmailVerificationPopup.vue'

const router = useRouter()
const premiumStore = usePremiumStore()
const eventStore = useEventStore()
const dialog = useDialog()
const isPremium = ref(false)
const isSubscribing = ref(false)
const user = ref(null)

const userCredits = computed(() => user.value?.credits ?? 0)
const remainingPurchasedCredits = computed(() => user.value?.purchased_credits ?? 0)
const remainingPlanCredits = computed(() =>
	Math.max(userCredits.value - remainingPurchasedCredits.value, 0),
)

const checkPremiumStatus = () => {
	if (user.value) {
		isPremium.value = user.value.plan === 'pro' || user.value.plan === 'max'
		premiumStore.updateStatus(isPremium.value ? 'premium' : '')
	}
}

const handleLogout = () => {
	logout()
	user.value = null
	isPremium.value = false
	premiumStore.updateStatus('')
	router.push('/home')
}

const showEmailVerificationRequiredDialog = () => {
	dialog.warning({
		title: '이메일 인증 필요',
		content: '이 기능은 이메일 인증 후 이용할 수 있습니다. 먼저 이메일 인증을 진행해주세요.',
		positiveText: '확인',
	})
}

const ensureVerifiedEmail = () => {
	if (!user.value?.email) {
		showEmailVerificationRequiredDialog()
		return false
	}
	return true
}

const goToPlanUpgrade = () => {
	if (!ensureVerifiedEmail()) return
	router.push({ name: 'PlanUpgradeView' })
}

const goToCreditsPurchase = () => {
	if (!ensureVerifiedEmail()) return
	goToPlanUpgrade()
}
const goToEmailChangePassword = () => {
	eventStore.emit('popup', { id: 'emailChangePassword', title: '비밀번호 변경' })
}
const openEmailVerificationDialog = () => {
	const dialogReactive = dialog.create({
		title: '이메일 인증',
		showIcon: false,
		positiveText: null,
		negativeText: null,
		content: () =>
			h(EmailVerificationPopup, {
				onClose: () => dialogReactive.destroy(),
			}),
	})
}

const handlePremiumStatusChange = (event) => {
	isPremium.value = event.detail.isPremium
	premiumStore.updateStatus(event.detail.isPremium ? 'premium' : '')
}

const handleSubscriptionError = (event) => {
	isSubscribing.value = false
	const errorMessage = event.detail.message
	if (errorMessage.includes('Google Play Services')) {
		alert(`${errorMessage}\n\n해결 방법:\n1. Google Play Store에서 Google Play Services 업데이트\n2. 앱 재시작\n3. 기기 재부팅`)
	} else if (errorMessage.includes('초기화')) {
		alert(`${errorMessage}\n\n해결 방법:\n1. 앱 완전 종료 후 재시작\n2. 기기 재부팅\n3. Google Play Services 확인`)
	} else {
		alert(errorMessage)
	}
}

const handleSubscriptionSuccess = (event) => {
	isSubscribing.value = false
	alert(event.detail.message)
	checkPremiumStatus()
}

onMounted(() => {
	if (!isAuthenticated()) {
		router.replace('/email-login')
		return
	}
	loginApi
		.getCurrentUser()
		.then((currentUser) => {
			user.value = currentUser || getUser()
			checkPremiumStatus()
		})
		.catch(() => {
			// API 실패 시 기존 세션 사용자 정보로 폴백
			user.value = getUser()
			checkPremiumStatus()
		})
	window.addEventListener('lottovue:premium', handlePremiumStatusChange)
	window.addEventListener('lottovue:subscriptionError', handleSubscriptionError)
	window.addEventListener('lottovue:subscriptionSuccess', handleSubscriptionSuccess)
	window.addEventListener('lottovue:userUpdated', () => {
		user.value = getUser()
		checkPremiumStatus()
	})
})

onUnmounted(() => {
	window.removeEventListener('lottovue:premium', handlePremiumStatusChange)
	window.removeEventListener('lottovue:subscriptionError', handleSubscriptionError)
	window.removeEventListener('lottovue:subscriptionSuccess', handleSubscriptionSuccess)
})
</script>

<style scoped>
.account-card {
	margin-top: 2rem;
	padding: 1.5rem;
	background-color: rgba(255, 255, 255, 0.05);
	border-radius: 8px;
}

.user-status {
	display: flex;
	align-items: center;
	gap: 12px;
}

.status-text {
	color: #fff;
	font-size: 16px;
	font-weight: 600;
}

.max-badge,
.premium-badge,
.free-badge {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.max-badge .max-icon,
.premium-badge .premium-icon,
.free-badge .free-icon {
	display: block;
	flex-shrink: 0;
}

.max-badge .max-icon {
	width: 70px;
	height: 26px;
	filter: drop-shadow(0 2px 6px rgba(106, 27, 154, 0.45));
}

.premium-badge .premium-icon {
	width: 66px;
	height: 25px;
	filter: drop-shadow(0 2px 5px rgba(255, 140, 0, 0.42));
}

.free-badge .free-icon {
	width: 64px;
	height: 24px;
	filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
}

.account-summary {
	margin-top: 12px;
}

.plan-alert {
	margin-top: 14px;
}

::deep(.account-summary .n-table td) {
	text-align: left !important;
}

.account-popup-actions {
	margin-top: 2rem;
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: stretch;
}

.account-popup-actions .btn-full {
	width: 100%;
}
</style>
