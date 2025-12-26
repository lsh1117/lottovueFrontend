<template>
	<!-- 유료 Plan 소개 -->
	<section class="section section-area plans-section">
		<div class="section-header">
			<h2 class="title-big">Plan 선택</h2>
			<p class="section-description">나에게 맞는 Plan을 선택하세요</p>
		</div>
		<div class="section-body">
			<div class="plan-list">
				<!-- Free Plan -->
				<div class="plan-card">
					<div class="plan-header">
						<div class="plan-badge free-badge">
							<svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<linearGradient id="homeGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
										<stop offset="50%" style="stop-color:#66BB6A;stop-opacity:1" />
										<stop offset="100%" style="stop-color:#81C784;stop-opacity:1" />
									</linearGradient>
								</defs>
								<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#homeGreenGradient)"/>
								<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">free</text>
							</svg>
						</div>
						<h3 class="plan-title">Free Plan</h3>
						<p class="plan-price">무료</p>
					</div>
					<div class="plan-features">
						<ul>
							<li>회차별 최대 <strong>2개</strong>까지 생성 번호 저장</li>
							<li>주간 크레딧: <strong>2개</strong></li>
							<li>모든 통계 기능</li>
						</ul>
					</div>
					<div class="plan-action">
						<button class="btn btn-secondary btn-large" disabled>
							현재 Plan
						</button>
					</div>
				</div>

				<!-- Pro Plan -->
				<div class="plan-card recommended">
					<div class="plan-badge-recommended">분석</div>
					<div class="plan-header">
						<div class="plan-badge premium-badge">
							<svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<linearGradient id="homeGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
										<stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
										<stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
									</linearGradient>
								</defs>
								<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#homeGoldGradient)"/>
								<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">pro</text>
							</svg>
						</div>
						<h3 class="plan-title">Pro Plan</h3>
						<p class="plan-price">월 990원</p>
					</div>
					<div class="plan-features">
						<ul>
							<li>회차별 최대 <strong>100개</strong>까지 생성 번호 저장</li>
							<li>주간 크레딧: <strong>100개</strong></li>
							<li>모든 통계 기능</li>
							<li>통계 기반 AI 분석 기능</li>
						</ul>
					</div>
					<div class="plan-action">
						<button class="btn btn-primary btn-large" @click="handlePlanUpgrade">
							구독하기
						</button>
					</div>
				</div>

				<!-- Max Plan -->
				<div class="plan-card">
					<div class="plan-header">
						<div class="plan-badge max-badge">
							<svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<linearGradient id="homePurpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" style="stop-color:#9C27B0;stop-opacity:1" />
										<stop offset="50%" style="stop-color:#7B1FA2;stop-opacity:1" />
										<stop offset="100%" style="stop-color:#6A1B9A;stop-opacity:1" />
									</linearGradient>
								</defs>
								<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#homePurpleGradient)"/>
								<text x="40" y="16" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="white">max</text>
							</svg>
						</div>
						<h3 class="plan-title">Max Plan</h3>
						<p class="plan-price">월 4,990원</p>
					</div>
					<div class="plan-features">
						<ul>
							<li>회차별 최대 <strong>1000개</strong>까지 생성 번호 저장</li>
							<li>주간 크레딧: <strong>1000개</strong></li>
							<li>모든 통계 기능</li>
							<li>통계 기반 AI 분석 기능</li>
						</ul>
					</div>
					<div class="plan-action">
						<button class="btn btn-primary btn-large" @click="handlePlanUpgrade">
							구독하기
						</button>
					</div>
				</div>

				<!-- 크레딧 추가 구매 -->
				<div class="plan-card credit-card">
					<div class="plan-header">
						<div class="plan-badge credit-badge">
							<svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<linearGradient id="homeBlueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" style="stop-color:#2196F3;stop-opacity:1" />
										<stop offset="50%" style="stop-color:#42A5F5;stop-opacity:1" />
										<stop offset="100%" style="stop-color:#64B5F6;stop-opacity:1" />
									</linearGradient>
								</defs>
								<rect x="0" y="0" width="80" height="32" rx="16" fill="url(#homeBlueGradient)"/>
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
						<button class="btn btn-primary btn-large" @click="handleCreditPurchase">
							구매하기
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
const emit = defineEmits(['plan-upgrade', 'credit-purchase']);

function handlePlanUpgrade() {
	emit('plan-upgrade');
}

function handleCreditPurchase() {
	emit('credit-purchase');
}
</script>

