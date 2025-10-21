<template>
	<header class="header-area">
		<div class="header-left">
			<h1>
				<span>LOTTOVUE</span>
				<span v-if="isPremium" class="premium-badge" title="프리미엄 사용자">👑</span>
				<span v-else class="free-badge" title="무료 사용자">⭐</span>
			</h1>
		</div>
		
		<div class="header-right">
			<button class="account-btn" @click="openAccountPopup" title="계정 정보">
				<svg class="account-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
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

// premiumStore의 status 값을 사용하여 isPremium 계산
const isPremium = computed(() => {
	return premiumStore.status && premiumStore.status.length > 0
})

// Check if running in Android WebView
const isAndroidWebView = () => {
	return typeof window.AndroidBridge !== 'undefined'
}

// Listen for premium status from Android
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
	// Listen for premium status event from Android
	window.addEventListener('lottovue:premium', handlePremiumStatus)
	
	// Also check immediately if AndroidBridge is available
	if (isAndroidWebView()) {
		try {
			const premiumStatus = window.AndroidBridge.isPremiumUser()
			premiumStore.setStatus(premiumStatus ? ['premium'] : [])
		} catch (e) {
			console.error('Failed to get premium status:', e)
		}
	}
})
</script>