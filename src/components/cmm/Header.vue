<template>
	<header class="header-area">
		<h1>
			<span>LOTTOVUE</span>
			<span v-if="isPremium" class="premium-badge" title="프리미엄 사용자">👑</span>
			<span v-else class="free-badge" title="무료 사용자">⭐</span>
		</h1>
		<nav class="gnb">
			<ul class="gnb-list">
				<li class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/home">홈</router-link></li>
				<li class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/gameresult">회차 결과</router-link></li>
				<li class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/contact">번호뽑기</router-link></li>
				<li class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/statistics">통계</router-link></li>
			</ul>
		</nav>
	</header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isPremium = ref(false)

// Check if running in Android WebView
const isAndroidWebView = () => {
	return typeof window.AndroidBridge !== 'undefined'
}

// Listen for premium status from Android
const handlePremiumStatus = (event) => {
	if (event.detail && typeof event.detail.isPremium === 'boolean') {
		isPremium.value = event.detail.isPremium
	}
}

onMounted(() => {
	// Listen for premium status event from Android
	window.addEventListener('lottovue:premium', handlePremiumStatus)
	
	// Also check immediately if AndroidBridge is available
	if (isAndroidWebView()) {
		try {
			isPremium.value = window.AndroidBridge.isPremiumUser()
		} catch (e) {
			console.error('Failed to get premium status:', e)
		}
	}
})
</script>

<style scoped>
h1 {
	display: flex;
	align-items: center;
	gap: 8px;
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
</style>