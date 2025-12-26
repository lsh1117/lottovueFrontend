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
				<!-- MAX Plan 배지 -->
				<span v-if="userPlan === 'max'" class="plan-badge max-badge" :title="`최대 Plan 사용자 - 잔여 크레딧: ${userCredits ?? 0}개`">
					{{ userCredits ?? 0 }}
				</span>
				<!-- PRO Plan 배지 -->
				<span v-else-if="userPlan === 'pro'" class="plan-badge premium-badge" :title="`프로 사용자 - 잔여 크레딧: ${userCredits ?? 0}개`">
					{{ userCredits ?? 0 }}
				</span>
				<!-- FREE Plan 배지 -->
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
			<!-- 햄버거 메뉴 버튼 (모바일만 표시) -->
			<div class="header-right-item mobile-menu-btn">
				<button class="hamburger-btn" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }" title="메뉴">
					<span class="hamburger-line"></span>
					<span class="hamburger-line"></span>
					<span class="hamburger-line"></span>
				</button>
			</div>
		</div>
	</header>
	
	<!-- PC용 좌측 고정 GNB -->
	<nav class="gnb-area gnb-desktop">
		<ul class="gnb-list">
			<li class="gnb-item">
				<router-link class="btn-gnb" active-class="on" to="/gameresult">회차 결과</router-link>
			</li>
			<li class="gnb-item">
				<a href="javascript:void(0)" class="btn-gnb" :class="{ 'on': route.path === '/contact' }" @click.prevent="handleNumberPickClick">번호 생성</a>
			</li>
			<li class="gnb-item">
				<a href="javascript:void(0)" class="btn-gnb" :class="{ 'on': route.path === '/statistics' }" @click.prevent="handleStatisticsClick">통계</a>
			</li>
			<li v-if="isAuthenticated()" class="gnb-item">
				<router-link class="btn-gnb" active-class="on" to="/my-winning-number">My Page</router-link>
			</li>
			<!--
			<li v-if="isAuthenticated()" class="gnb-item">
				<router-link class="btn-gnb" active-class="on" to="/plan-upgrade">Plan</router-link>
			</li>
			-->
			<!-- 고객센터 메뉴 (2뎁스) -->
			<li class="gnb-item gnb-item-submenu" :class="{ 'open': isCustomerCenterOpen }">
				<a href="javascript:void(0)" class="btn-gnb btn-gnb-parent" @click.prevent="toggleCustomerCenter">
					<span>고객센터</span>
					<span class="submenu-icon">{{ isCustomerCenterOpen ? '▲' : '▼' }}</span>
				</a>
				<ul class="gnb-submenu">
					<li class="gnb-submenu-item">
						<router-link class="btn-gnb-sub" :class="{ 'on': route.path.startsWith('/notice') }" to="/notice/list">공지사항</router-link>
					</li>
					<li v-if="isAuthenticated()" class="gnb-submenu-item">
						<router-link class="btn-gnb-sub" :class="{ 'on': route.path.startsWith('/inquiry') }" to="/inquiry/list">문의하기</router-link>
					</li>
					<li class="gnb-submenu-item">
						<router-link class="btn-gnb-sub" :class="{ 'on': route.path === '/terms' && route.query.group === 'TOS' }" to="/terms?group=TOS">이용약관</router-link>
					</li>
					<li class="gnb-submenu-item">
						<router-link class="btn-gnb-sub" :class="{ 'on': route.path === '/privacy-policy' }" to="/privacy-policy">개인정보처리방침</router-link>
					</li>
					<!--
					<li class="gnb-submenu-item">
						<router-link class="btn-gnb-sub" :class="{ 'on': route.path === '/terms' && route.query.group === 'PS' }" to="/terms?group=PS">유료서비스 약관</router-link>
					</li>
					<li class="gnb-submenu-item">
						<router-link class="btn-gnb-sub" :class="{ 'on': route.path === '/terms' && route.query.group === 'CP' }" to="/terms?group=CP">크레딧 규칙</router-link>
					</li>
					-->
				</ul>
			</li>
		</ul>
	</nav>

	<!-- 모바일용 슬라이드 메뉴 -->
	<div class="mobile-menu-overlay" :class="{ 'active': isMobileMenuOpen }" @click="closeMobileMenu"></div>
	<nav class="gnb-mobile" :class="{ 'active': isMobileMenuOpen }">
		<div class="mobile-menu-header">
			<h3>메뉴</h3>
			<button class="mobile-menu-close" @click="closeMobileMenu" title="닫기">
				<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
		<ul class="mobile-gnb-list">
			<li class="mobile-gnb-item">
				<router-link class="mobile-btn-gnb" active-class="on" to="/gameresult" @click="closeMobileMenu">
					<span>회차 결과</span>
				</router-link>
			</li>
			<li class="mobile-gnb-item">
				<a href="javascript:void(0)" class="mobile-btn-gnb" :class="{ 'on': route.path === '/contact' }" @click.prevent="handleMobileNumberPickClick">
					<span>번호 생성</span>
				</a>
			</li>
			<li class="mobile-gnb-item">
				<a href="javascript:void(0)" class="mobile-btn-gnb" :class="{ 'on': route.path === '/statistics' }" @click.prevent="handleMobileStatisticsClick">
					<span>통계</span>
				</a>
			</li>
			<li v-if="isAuthenticated()" class="mobile-gnb-item">
				<router-link class="mobile-btn-gnb" active-class="on" to="/my-winning-number" @click="closeMobileMenu">
					<span>My Page</span>
				</router-link>
			</li>
			<!--
			<li v-if="isAuthenticated()" class="mobile-gnb-item">
				<router-link class="mobile-btn-gnb" active-class="on" to="/plan-upgrade" @click="closeMobileMenu">
					<span>Plan</span>
				</router-link>
			</li>
			-->
			<!-- 고객센터 메뉴 (2뎁스) -->
			<li class="mobile-gnb-item mobile-gnb-item-submenu" :class="{ 'open': isMobileCustomerCenterOpen }">
				<a href="javascript:void(0)" class="mobile-btn-gnb mobile-btn-gnb-parent" @click.prevent="toggleMobileCustomerCenter">
					<span>고객센터</span>
					<span class="mobile-submenu-icon">{{ isMobileCustomerCenterOpen ? '▲' : '▼' }}</span>
				</a>
				<ul class="mobile-gnb-submenu">
					<li class="mobile-gnb-submenu-item">
						<router-link class="mobile-btn-gnb-sub" :class="{ 'on': route.path.startsWith('/notice') }" to="/notice/list" @click="closeMobileMenu">공지사항</router-link>
					</li>
					<li v-if="isAuthenticated()" class="mobile-gnb-submenu-item">
						<router-link class="mobile-btn-gnb-sub" :class="{ 'on': route.path.startsWith('/inquiry') }" to="/inquiry/list" @click="closeMobileMenu">문의하기</router-link>
					</li>
					<li class="mobile-gnb-submenu-item">
						<router-link class="mobile-btn-gnb-sub" :class="{ 'on': route.path === '/terms' && route.query.group === 'TOS' }" to="/terms?group=TOS" @click="closeMobileMenu">이용약관</router-link>
					</li>
					<li class="mobile-gnb-submenu-item">
						<router-link class="mobile-btn-gnb-sub" :class="{ 'on': route.path === '/privacy-policy' }" to="/privacy-policy" @click="closeMobileMenu">개인정보처리방침</router-link>
					</li>
					<!--
					<li class="mobile-gnb-submenu-item">
						<router-link class="mobile-btn-gnb-sub" :class="{ 'on': route.path === '/terms' && route.query.group === 'PS' }" to="/terms?group=PS" @click="closeMobileMenu">유료서비스 약관</router-link>
					</li>
					<li class="mobile-gnb-submenu-item">
						<router-link class="mobile-btn-gnb-sub" :class="{ 'on': route.path === '/terms' && route.query.group === 'CP' }" to="/terms?group=CP" @click="closeMobileMenu">크레딧 규칙</router-link>
					</li>
					-->
				</ul>
			</li>
		</ul>
	</nav>
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NModal } from 'naive-ui'
import { usePremiumStore } from '@/stores/PremiumStore'
import { useEventStore } from '@/stores/EventStore'
import { isAuthenticated, getUser } from '@/utils/auth'

const router = useRouter()
const route = useRoute()
const eventStore = useEventStore();

const premiumStore = usePremiumStore();

// 모바일 메뉴 상태
const isMobileMenuOpen = ref(false)
// 고객센터 메뉴 열림 상태
const isCustomerCenterOpen = ref(false)
const isMobileCustomerCenterOpen = ref(false)

// 고객센터 관련 경로인지 확인
const isCustomerCenterRoute = computed(() => {
	return route.path.startsWith('/notice') ||
		   route.path.startsWith('/inquiry') ||
		   (route.path === '/terms' && route.query.group) ||
		   route.path === '/privacy-policy'
})

// 경로 변경 시 고객센터 메뉴 상태 업데이트
watch(() => [route.path, route.query.group], () => {
	if (isCustomerCenterRoute.value) {
		isCustomerCenterOpen.value = true
		isMobileCustomerCenterOpen.value = true
	}
}, { immediate: true })

// 사용자 Plan 가져오기
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

// 모바일 메뉴 토글
function toggleMobileMenu() {
	isMobileMenuOpen.value = !isMobileMenuOpen.value
	if (isMobileMenuOpen.value) {
		document.body.style.overflow = 'hidden'
	} else {
		document.body.style.overflow = ''
	}
}

// 모바일 메뉴 닫기
function closeMobileMenu() {
	isMobileMenuOpen.value = false
	document.body.style.overflow = ''
}

// 모바일 번호 생성 클릭 핸들러
function handleMobileNumberPickClick() {
	closeMobileMenu()
	handleNumberPickClick()
}

// 모바일 통계 클릭 핸들러
function handleMobileStatisticsClick() {
	closeMobileMenu()
	handleStatisticsClick()
}

// 고객센터 메뉴 토글 (PC)
function toggleCustomerCenter() {
	isCustomerCenterOpen.value = !isCustomerCenterOpen.value
}


// 고객센터 메뉴 토글 (모바일)
function toggleMobileCustomerCenter() {
	isMobileCustomerCenterOpen.value = !isMobileCustomerCenterOpen.value
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

onUnmounted(() => {
	// 컴포넌트 언마운트 시 body overflow 초기화
	document.body.style.overflow = ''
})
</script>
