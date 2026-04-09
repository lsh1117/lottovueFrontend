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
						<h3 class="plan-title">{{ planInfo.free.name }}</h3>
						<p class="plan-price">{{ planInfo.free.price_text || planInfo.free.priceText }}</p>
					</div>
					<div class="plan-features">
						<ul>
							<li v-for="feature in planInfo.free.features" :key="`home-free-${feature}`" v-html="feature"></li>
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
						<h3 class="plan-title">{{ planInfo.pro.name }}</h3>
						<p class="plan-price">{{ planInfo.pro.price_text || planInfo.pro.priceText }}</p>
					</div>
					<div class="plan-features">
						<ul>
							<li v-for="feature in planInfo.pro.features" :key="`home-pro-${feature}`" v-html="feature"></li>
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
						<h3 class="plan-title">{{ planInfo.max.name }}</h3>
						<p class="plan-price">{{ planInfo.max.price_text || planInfo.max.priceText }}</p>
					</div>
					<div class="plan-features">
						<ul>
							<li v-for="feature in planInfo.max.features" :key="`home-max-${feature}`" v-html="feature"></li>
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
						<h3 class="plan-title">{{ creditProduct.name }}</h3>
						<p class="plan-price">{{ creditProduct.price_text || creditProduct.priceText }}</p>
					</div>
					<div class="plan-features">
						<ul>
							<li v-for="feature in creditProduct.features" :key="`home-credit-${feature}`" v-html="feature"></li>
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
import { computed, onMounted, ref } from 'vue'
import planApi from '@/api/plan'
import { CREDIT_PRODUCT as LOCAL_CREDIT_PRODUCT, PLAN_INFO as LOCAL_PLAN_INFO } from '@/constants/plan'

const emit = defineEmits(['plan-upgrade', 'credit-purchase']);
const planCatalog = ref({
	plans: LOCAL_PLAN_INFO,
	credit_product: LOCAL_CREDIT_PRODUCT,
})
const planInfo = computed(() => planCatalog.value?.plans || LOCAL_PLAN_INFO)
const creditProduct = computed(() => planCatalog.value?.credit_product || LOCAL_CREDIT_PRODUCT)

function handlePlanUpgrade() {
	emit('plan-upgrade');
}

function handleCreditPurchase() {
	emit('credit-purchase');
}

onMounted(() => {
	planApi
		.getCatalog()
		.then((catalog) => {
			if (catalog?.plans && catalog?.credit_product) {
				planCatalog.value = catalog
			}
		})
		.catch(() => {
			// API 실패 시 로컬 상수 폴백 유지
		})
})
</script>

