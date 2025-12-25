<template>
	<div class="PlanUpgradeView">
		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">Plan 업그레이드</h4>
			</div>
			<div class="section-body">
				<div v-if="user" class="current-plan-info">
					<p>현재 Plan</p>
					<div>
						<span v-if="user.plan === 'free'" class="free-badge">
							<svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<linearGradient id="currentGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
										<stop offset="50%" style="stop-color:#66BB6A;stop-opacity:1" />
										<stop offset="100%" style="stop-color:#81C784;stop-opacity:1" />
									</linearGradient>
								</defs>
								<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#currentGreenGradient)"/>
								<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">free</text>
							</svg>
							<span>Free Plan</span>
						</span>
						<span v-else-if="user.plan === 'pro'" class="premium-badge">
							<svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<linearGradient id="currentGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
										<stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
										<stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
									</linearGradient>
								</defs>
								<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#currentGoldGradient)"/>
								<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">pro</text>
							</svg>
							<span>Pro Plan</span>
						</span>
						<span v-else-if="user.plan === 'max'" class="max-badge">
							<svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<linearGradient id="currentPurpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" style="stop-color:#9C27B0;stop-opacity:1" />
										<stop offset="50%" style="stop-color:#7B1FA2;stop-opacity:1" />
										<stop offset="100%" style="stop-color:#6A1B9A;stop-opacity:1" />
									</linearGradient>
								</defs>
								<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#currentPurpleGradient)"/>
								<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">max</text>
							</svg>
							<span>Max Plan</span>
						</span>
					</div>
				</div>
                <!-- Plan 리스트 -->
                <div class="plan-list">
                    <!-- Free Plan -->
                    <div class="plan-card" :class="{ 'current': user && user.plan === 'free', 'disabled': user && user.plan !== 'free' }">
                        <div class="plan-header">
                            <div class="plan-badge free-badge">
                                <svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="planGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
                                            <stop offset="50%" style="stop-color:#66BB6A;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#81C784;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="0" y="0" width="80" height="32" rx="16" fill="url(#planGreenGradient)"/>
                                    <text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">free</text>
                                </svg>
                            </div>
                            <h3 class="plan-title">Free Plan</h3>
                            <p class="plan-price">무료</p>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li>회차별 최대 <strong>2개</strong>까지 생성 번호 저장</li>
                                <li>주간 크레딧: <strong>2개</strong> (크레딧 1개 = 랜덤번호 1개 생성)</li>
                                <li>모든 통계 기능</li>
                            </ul>
                        </div>
                        <div class="plan-action">
                            <button 
                                v-if="user && user.plan === 'free'" 
                                class="btn-secondary btn-large" 
                                disabled
                            >
                                현재 Plan
                            </button>
                            <button 
                                v-else
                                class="btn-secondary btn-large" 
                                @click="upgradePlan('free')"
                                :disabled="isUpgrading"
                            >
                                다운그레이드
                            </button>
                        </div>
                    </div>

                    <!-- Pro Plan -->
                    <div class="plan-card" :class="{ 'current': user && user.plan === 'pro', 'recommended': user && user.plan === 'free' }">
                        <div class="plan-header">
                            <div class="plan-badge premium-badge">
                                <svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="planGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
                                            <stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="0" y="0" width="80" height="32" rx="16" fill="url(#planGoldGradient)"/>
                                    <text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">pro</text>
                                </svg>
                            </div>
                            <h3 class="plan-title">Pro Plan</h3>
                            <p class="plan-price">월 990원</p>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li>회차별 최대 <strong>100개</strong>까지 생성 번호 저장</li>
                                <li>주간 크레딧: <strong>100개</strong> (크레딧 1개 = 랜덤번호 1개 생성)</li>
                                <li>모든 통계 기능</li>
                                <li>통계 기반 AI 분석 기능</li>
                            </ul>
                        </div>
                        <div class="plan-action">
                            <button 
                                v-if="user && user.plan === 'pro'" 
                                class="btn-secondary btn-large" 
                                disabled
                            >
                                현재 Plan
                            </button>
                            <button 
                                v-else
                                class="btn-primary btn-large" 
                                @click="upgradePlan('pro')"
                                :disabled="isUpgrading"
                            >
                                {{ isUpgrading ? '처리 중...' : '구독하기' }}
                            </button>
                        </div>
                    </div>

                    <!-- Max Plan -->
                    <div class="plan-card" :class="{ 'current': user && user.plan === 'max' }">
                        <div class="plan-header">
                            <div class="plan-badge max-badge">
                                <svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="planPurpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style="stop-color:#9C27B0;stop-opacity:1" />
                                            <stop offset="50%" style="stop-color:#7B1FA2;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#6A1B9A;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="0" y="0" width="80" height="32" rx="16" fill="url(#planPurpleGradient)"/>
                                    <text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">max</text>
                                </svg>
                            </div>
                            <h3 class="plan-title">Max Plan</h3>
                            <p class="plan-price">월 6,990원</p>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li>회차별 최대 <strong>1000개</strong>까지 생성 번호 저장</li>
                                <li>주간 크레딧: <strong>1000개</strong> (크레딧 1개 = 랜덤번호 1개 생성)</li>
                                <li>모든 통계 기능</li>
                                <li>통계 기반 AI 분석 기능</li>
                            </ul>
                        </div>
                        <div class="plan-action">
                            <button 
                                v-if="user && user.plan === 'max'" 
                                class="btn-secondary btn-large" 
                                disabled
                            >
                                현재 Plan
                            </button>
                            <button 
                                v-else
                                class="btn-primary btn-large" 
                                @click="upgradePlan('max')"
                                :disabled="isUpgrading"
                            >
                                {{ isUpgrading ? '처리 중...' : '구독하기' }}
                            </button>
                        </div>
                    </div>

                    <!-- 크레딧 추가 구매 -->
                    <div class="plan-card credit-card">
                        <div class="plan-header">
                            <div class="plan-badge credit-badge">
                                <svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="planBlueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style="stop-color:#2196F3;stop-opacity:1" />
                                            <stop offset="50%" style="stop-color:#42A5F5;stop-opacity:1" />
                                            <stop offset="100%" style="stop-color:#64B5F6;stop-opacity:1" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="0" y="0" width="80" height="32" rx="16" fill="url(#planBlueGradient)"/>
                                    <text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">credit</text>
                                </svg>
                            </div>
                            <h3 class="plan-title">크레딧 추가 구매</h3>
                            <p class="plan-price">2,500원</p>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li>크레딧 <strong>500개</strong> 추가 구매</li>
                                <li>크레딧 1개 = 랜덤번호 1개 생성</li>
                                <li>소멸되지 않는 크레딧</li>
                                <li>언제든지 사용 가능</li>
                            </ul>
                        </div>
                        <div class="plan-action">
                            <button 
                                class="btn-primary btn-large" 
                                @click="purchaseCredits"
                                :disabled="isUpgrading"
                            >
                                {{ isUpgrading ? '처리 중...' : '구매하기' }}
                            </button>
                        </div>
                    </div>
                </div>
                
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, isAuthenticated } from '@/utils/auth'

const router = useRouter()
const user = ref(null)
const isUpgrading = ref(false)

// Plan 업그레이드 함수
const upgradePlan = async (plan) => {
	if (isUpgrading.value) {
		return
	}

	if (!user.value) {
		alert('로그인이 필요합니다.')
		router.push('/home')
		return
	}

	if (user.value.plan === plan) {
		alert('이미 해당 Plan입니다.')
		return
	}

	isUpgrading.value = true

	try {
		// TODO: 백엔드 API 연동 필요
		alert(`${plan.toUpperCase()} Plan으로 업그레이드 기능은 아직 구현되지 않았습니다.`)
		//console.log('Plan 업그레이드:', plan)
	} catch (error) {
		console.error('Plan 업그레이드 오류:', error)
		alert('Plan 업그레이드 중 오류가 발생했습니다.')
	} finally {
		isUpgrading.value = false
	}
}

// 크레딧 구매 함수
const purchaseCredits = async () => {
	if (isUpgrading.value) {
		return
	}

	if (!user.value) {
		alert('로그인이 필요합니다.')
		router.push('/home')
		return
	}

	isUpgrading.value = true

	try {
		// TODO: 백엔드 API 연동 필요
		alert('크레딧 구매 기능은 아직 구현되지 않았습니다.')
		//console.log('크레딧 구매')
	} catch (error) {
		console.error('크레딧 구매 오류:', error)
		alert('크레딧 구매 중 오류가 발생했습니다.')
	} finally {
		isUpgrading.value = false
	}
}

onMounted(() => {
	// 로그인 체크
	if (!isAuthenticated()) {
		alert('Plan 업그레이드는 로그인 사용자만 이용 가능합니다.')
		router.push('/home')
		return
	}
	
	// 저장된 사용자 정보 확인
	user.value = getUser()
	
	if (!user.value) {
		alert('사용자 정보를 불러올 수 없습니다.')
		router.push('/home')
	}
})
</script>

