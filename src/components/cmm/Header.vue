<template>
	<header class="header-area">
		<div class="header-left" @click="goToHome" style="cursor: pointer;">
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
				<span v-if="userPlan === 'max'" class="plan-badge max-badge" :title="`최대 플랜 사용자 - 잔여 크레딧: ${userCredits ?? 0}개`">
					{{ userCredits ?? 0 }}
				</span>
				<!-- PRO 플랜 배지 -->
				<span v-else-if="userPlan === 'pro'" class="plan-badge premium-badge" :title="`프로 사용자 - 잔여 크레딧: ${userCredits ?? 0}개`">
					{{ userCredits ?? 0 }}
				</span>
				<!-- FREE 플랜 배지 -->
				<span v-else class="plan-badge free-badge" :title="`무료 사용자 - 잔여 크레딧: ${userCredits ?? 0}개`">
					{{ userCredits ?? 0 }}
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
				<li class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/gameresult">회차 결과</router-link></li>
				<li class="gnb-item"><a href="javascript:void(0)" class="btn-gnb" :class="{ 'on': route.path === '/contact' }" @click.prevent="handleNumberPickClick">번호 생성</a></li>
				<li class="gnb-item"><a href="javascript:void(0)" class="btn-gnb" :class="{ 'on': route.path === '/statistics' }" @click.prevent="handleStatisticsClick">통계</a></li>
				<li v-if="isAuthenticated()" class="gnb-item"><router-link class="btn-gnb" active-class="on" to="/my-winning-number">My Page</router-link></li>
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

// 잔여 크레딧 가져오기
const userCredits = computed(() => {
	const user = getUser()
	return user?.credits ?? null
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

// AI 추천 클릭 핸들러
function handleNumberPickClick() {
	if (!isAuthenticated()) {
		alert('AI 추천 기능은 로그인 후 이용 가능합니다.\n계정 정보에서 로그인해주세요.')
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

// 홈으로 이동
function goToHome() {
	router.push('/home')
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
