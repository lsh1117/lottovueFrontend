<template>
	<div class="HomeView">
		<!-- 히어로 섹션: 로또뷰 소개 -->
		<section class="section section-area hero-section">
			<div class="section-header">
				<h1 class="hero-title">로또뷰</h1>
				<p class="hero-subtitle">스마트한 로또 번호 분석과 추천 서비스</p>
				<p class="hero-description">
					로또뷰는 통계 기반 분석과 AI 추천 기능을 통해<br>
					더 나은 로또 번호 선택을 도와드립니다.
				</p>
			</div>
		</section>

		<!-- 주요 기능 소개 -->
		<section class="section section-area features-section">
			<div class="section-header">
				<h2 class="title-big">주요 기능</h2>
			</div>
			<div class="section-body">
				<div class="features-grid">
					<div class="feature-card">
						<div class="feature-icon">📊</div>
						<h3 class="feature-title">통계 분석</h3>
						<p class="feature-description">
							과거 당첨 번호를 기반으로 한<br>
							다양한 통계 분석 제공
						</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">🤖</div>
						<h3 class="feature-title">AI 추천</h3>
						<p class="feature-description">
							통계 기반 AI 분석을 통한<br>
							스마트한 번호 추천
						</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">💾</div>
						<h3 class="feature-title">번호 저장</h3>
						<p class="feature-description">
							생성한 번호를 저장하고<br>
							관리할 수 있습니다
						</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">🎯</div>
						<h3 class="feature-title">당첨 결과 확인</h3>
						<p class="feature-description">
							최신 당첨 결과를 확인하고<br>
							내 번호와 비교해보세요
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- 유료 플랜 소개 -->
		<section class="section section-area plans-section">
			<div class="section-header">
				<h2 class="title-big">플랜 선택</h2>
				<p class="section-description">나에게 맞는 플랜을 선택하세요</p>
			</div>
			<div class="section-body">
				<div class="plan-list">
					<!-- Free 플랜 -->
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
							<h3 class="plan-title">Free 플랜</h3>
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
								현재 플랜
							</button>
						</div>
					</div>

					<!-- Pro 플랜 -->
					<div class="plan-card recommended">
						<div class="plan-badge-recommended">추천</div>
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
							<h3 class="plan-title">Pro 플랜</h3>
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
							<button class="btn btn-primary btn-large" @click="goToPlanUpgrade">
								구독하기
							</button>
						</div>
					</div>

					<!-- Max 플랜 -->
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
							<h3 class="plan-title">Max 플랜</h3>
							<p class="plan-price">월 6,990원</p>
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
							<button class="btn btn-primary btn-large" @click="goToPlanUpgrade">
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
							<p class="plan-price">4,990원</p>
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
							<button class="btn btn-primary btn-large" @click="goToCreditPurchase">
								구매하기
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { useRouter } from "vue-router";

	const router = useRouter();

	function goToPlanUpgrade() {
		router.push('/plan-upgrade');
	}

	function goToCreditPurchase() {
		router.push('/credit-purchase');
	}
</script>
