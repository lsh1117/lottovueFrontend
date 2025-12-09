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
			<div class="header-right-item">
				<span v-if="isPremium" class="premium-badge" title="프로 사용자">
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
				<li class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/contact">번호뽑기</router-link></li>
				<li class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/statistics">통계</router-link></li>
			</ul>
		</nav>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { NModal } from 'naive-ui'
import { usePremiumStore } from '@/stores/PremiumStore'
import { useEventStore } from '@/stores/EventStore';

const eventStore = useEventStore();

const premiumStore = usePremiumStore();

// premiumStore의 status 값을 사용하여 isPro 계산
const isPremium = computed(() => {
	return premiumStore.status && premiumStore.status.length > 0
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

onMounted(() => {
	// Listen for pro status event
	window.addEventListener('lottovue:premium', handlePremiumStatus)
})
</script>