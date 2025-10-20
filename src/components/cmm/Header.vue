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
			<button class="account-btn" @click="showAccountPopup = true" title="계정 정보">
				<svg class="account-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
		
		<!-- 계정 정보 팝업 -->
		<n-modal
			v-model:show="showAccountPopup"
			preset="dialog"
			title=""
			:closable="true"
			:mask-closable="true"
			:auto-focus="false"
		>
			<AccountPopup @close="showAccountPopup = false" />
		</n-modal>
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
import AccountPopup from '@/views/popup/AccountPopup.vue'

const premiumStore = usePremiumStore();
const showAccountPopup = ref(false)

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

<style scoped>
.header-area {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 5px 20px;
	height: 52px;
	border-bottom: 1px solid rgb(51, 51, 51,0.6);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
	display: flex;
	align-items: center;
}

.header-right {
	display: flex;
	align-items: center;
	gap: 20px;
}

h1 {
	display: flex;
	align-items: center;
	gap: 8px;
	margin: 0;
	font-size: 1.5rem;
	font-weight: bold;
	color: #333;
}

.premium-badge,
.free-badge {
	font-size: 1.2rem;
	display: inline-flex;
	align-items: center;
	animation: fadeIn 0.3s ease-in;
}

.premium-badge {
	color: #ffd700;
	filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5));
}

.free-badge {
	color: #a0a0a0;
	opacity: 0.7;
}

.gnb-area {
	margin-top: 52px;
	width:100%;
	height:32px;
}

.gnb {
	widows: 100%;
	margin: 0;
	display: flex;
}

.gnb-list {
	display: flex;
	list-style: none;
	margin: 0;
	padding: 0;
	width: 100%;
	gap: 16px;
	background-color: rgb(24, 24, 24);
}

.gnb-item {
	margin: 0;
	flex:1;
}

.btn-gnb {
	text-decoration: none;
	color: #6c757d;
	font-weight: 500;
	height:42px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.btn-gnb:hover {
	color: #007bff;
}

.btn-gnb.on {
	color: #ffffff;
	background-color: rgb(51, 51, 51);
}

.account-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border: none;
	border-radius: 50%;
	background-color: #f8f9fa;
	color: #6c757d;
	cursor: pointer;
	transition: all 0.2s ease;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.account-btn:hover {
	background-color: #e9ecef;
	color: #495057;
	transform: translateY(-1px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.account-btn:active {
	transform: translateY(0);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.account-icon {
	width: 20px;
	height: 20px;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: scale(0.8);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

/* 반응형 디자인 */
@media (max-width: 768px) {
	.header-area {
		padding: 12px 16px;
	}
	
	.header-right {
		gap: 12px;
	}
	
	.gnb-list {
		gap: 8px;
	}
	
	
	.account-btn {
		width: 36px;
		height: 36px;
	}
	
	.account-icon {
		width: 18px;
		height: 18px;
	}
}
</style>