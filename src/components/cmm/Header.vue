<template>
	<header class="header-area">
		<div class="header-left">
			<div>
				<img src="/assets/images/cmm/logo_128.png" alt="LOTTOVUE" class="logo-image"/>
			</div>
			<h1>
				<span>LOTTOVUE</span>
			</h1>
		</div>
		
		<div class="header-right">
			<div class="header-right-item" v-if="isAuthenticated()">
				<!-- MAX 플랜 배지 -->
				<span v-if="userPlan === 'max'" class="max-badge" title="최대 플랜 사용자">
					<svg class="max-icon" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" style="stop-color:#9C27B0;stop-opacity:1" />
								<stop offset="50%" style="stop-color:#7B1FA2;stop-opacity:1" />
								<stop offset="100%" style="stop-color:#6A1B9A;stop-opacity:1" />
							</linearGradient>
						</defs>
						<!-- 보라색 그라데이션 배지 -->
						<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#purpleGradient)"/>
						<!-- max 텍스트 -->
						<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">max</text>
					</svg>
				</span>
				<!-- PRO 플랜 배지 -->
				<span v-else-if="userPlan === 'pro'" class="premium-badge" title="프로 사용자">
					<svg class="premium-icon" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
								<stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
								<stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
							</linearGradient>
						</defs>
						<!-- 골드색 그라데이션 배지 -->
						<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#goldGradient)"/>
						<!-- pro 텍스트 -->
						<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">pro</text>
					</svg>
				</span>
				<!-- FREE 플랜 배지 -->
				<span v-else class="free-badge" title="무료 사용자">
					<svg class="free-icon" viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
								<stop offset="50%" style="stop-color:#66BB6A;stop-opacity:1" />
								<stop offset="100%" style="stop-color:#81C784;stop-opacity:1" />
							</linearGradient>
						</defs>
						<!-- 녹색 그라데이션 배지 -->
						<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#greenGradient)"/>
						<!-- free 텍스트 -->
						<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">free</text>
					</svg>
				</span>
			</div>
			<div class="header-right-item">
				<button class="account-btn" @click="openAccountPopup" title="계정 정보">
					<svg class="account-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>
	</header>
	<div class="gnb-area">
		<nav class="gnb">
			<ul class="gnb-list">
				<li class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/home">홈</router-link></li>
				<li class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/gameresult">회차 결과</router-link></li>
				<li class="gnb-item"><a class="btn-gnb" :class="{ 'on': route.path === '/contact' }" @click.prevent="handleNumberPickClick">번호뽑기</a></li>
				<li class="gnb-item"><a class="btn-gnb" :class="{ 'on': route.path === '/statistics' }" @click.prevent="handleStatisticsClick">통계</a></li>
			</ul>
		</nav>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NModal } from 'naive-ui'
import { usePremiumStore } from '@/stores/PremiumStore'
import { useEventStore } from '@/stores/EventStore'
import { isAuthenticated, getUser } from '@/utils/auth'

const router = useRouter()
const route = useRoute()
const eventStore = useEventStore();

const premiumStore = usePremiumStore();

// 사용자 플랜 가져오기
const userPlan = computed(() => {
	const user = getUser()
	return user?.plan || 'free'
})

// Listen for pro status from events
const handlePremiumStatus = (event) => {
	if (event.detail && typeof event.detail.isPremium === 'boolean') {
		premiumStore.setStatus(event.detail.isPremium ? ['premium'] : [])
	}
}

// 계정 정보 팝업 호출
function openAccountPopup() {
	//console.log("계정 정보");
	eventStore.emit('popup',{
		id:"account",
		title:"계정 정보",
		onClose:onAccountPopupClose,
	});
}

//  계정 정보 팝업 닫기 핸들러.
function onAccountPopupClose(e){
	//console.log("계정 정보 팝업 닫기 :",e);
}

// 번호뽑기 클릭 핸들러
function handleNumberPickClick() {
	if (!isAuthenticated()) {
		alert('번호뽑기 기능은 로그인 후 이용 가능합니다.\n계정 정보에서 로그인해주세요.')
		openAccountPopup()
		return
	}
	router.push('/contact')
}

// 통계 클릭 핸들러
function handleStatisticsClick() {
	if (!isAuthenticated()) {
		alert('통계 기능은 로그인 후 이용 가능합니다.\n계정 정보에서 로그인해주세요.')
		openAccountPopup()
		return
	}
	router.push('/statistics')
}

// 사용자 정보 업데이트 이벤트 리스너
const handleUserUpdated = () => {
	// 사용자 정보가 업데이트되면 computed가 자동으로 반영됨
}

onMounted(() => {
	// Listen for pro status event
	window.addEventListener('lottovue:premium', handlePremiumStatus)
	// Listen for user updated event
	window.addEventListener('lottovue:userUpdated', handleUserUpdated)
})
</script>

<style scoped>
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
	width: 64px;
	height: 24px;
	display: block;
	flex-shrink: 0;
}

.max-badge .max-icon {
	filter: drop-shadow(0 2px 4px rgba(156, 39, 176, 0.4));
}

.premium-badge .premium-icon {
	filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.4));
}

.free-badge .free-icon {
	filter: drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3));
}
</style>