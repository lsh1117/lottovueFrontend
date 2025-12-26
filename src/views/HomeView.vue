<template>
	<div class="HomeView">
		<!-- 광고 영역 (Free Plan만 표시) -->
		<section v-if="isFreePlan" class="section section-area adsense-section">
			<AdSense 
				ad-slot="4776127952"
				ad-format="auto"
				container-class="home-adsense"
			/>
		</section>
		<!-- 히어로 섹션: 로또뷰 소개 -->
		<section class="section section-area hero-section">
			<div class="section-header">
				<h1 class="hero-title">로또뷰</h1>
				<p class="hero-subtitle">스마트한 로또 번호 분석과 분석 서비스</p>
				<p class="hero-description">
					로또뷰는 통계 기반 분석과 AI 분석 기능을 통해<br>
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
						<h3 class="feature-title">AI 분석</h3>
						<p class="feature-description">
							통계 기반 AI 분석을 통한<br>
							스마트한 번호 분석
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

		<!-- 유료 Plan 소개 
		<PlansSection 
			@plan-upgrade="goToPlanUpgrade"
			@credit-purchase="goToCreditPurchase"
		/>
		-->
	</div>
</template>

<script setup>
	import { computed } from "vue";
	import { useRouter } from "vue-router";
	import AdSense from "@/components/cmm/AdSense.vue";
	import PlansSection from "@/components/home/PlansSection.vue";
	import { getUser } from '@/utils/auth';

	const router = useRouter();
	
	// Free Plan 여부 확인 (Pro, Max 플랜은 광고 미표시)
	const isFreePlan = computed(() => {
		const user = getUser();
		return !user || !user.plan || user.plan === 'free';
	});

	function goToPlanUpgrade() {
		router.push('/plan-upgrade');
	}

	function goToCreditPurchase() {
		router.push('/credit-purchase');
	}
</script>
