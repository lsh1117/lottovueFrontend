<template>
	<div class="HomeView">
		<section class="section section-area" v-if="result && result.drwNo">
			<div class="section-header">
				<h4 class="title-big">
					<strong>{{ result.drwNo }}회</strong> 당첨결과
				</h4>
				<p><span class="text-description-medium">({{ result.drwNoDate }} 추첨)</span></p>
			</div>
			<div class="section-body">
				<div class="nums">
					<!-- 당첨 번호 -->
					<div class="num-win">
						<h4 class="title-medium">당첨번호</h4>
						<div class="ball-area">
							<ul class="ball-list">
								<li class="ball-item" v-for="(number, index) in winningNumbers" :key="index">
									<span class="ball-645" :class="'ball-' + getGroup(number)">{{ number }}</span>
								</li>
							</ul>
						</div>
					</div>
					<!-- 보너스 번호 -->
					<div class="num-bonus">
						<h4 class="title-medium">보너스</h4>
						<div class="ball-area">
							<ul class="ball-list">
								<li class="ball-item">
									<span class="ball-645"
										:class="'ball-' + getGroup(result.bnusNo)">{{ result.bnusNo }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="section section-area" v-else>
			<div class="section-body">
				<p class="text-description-medium" style="text-align: center;">데이터 없음</p>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { onMounted, onBeforeUnmount, ref, computed } from "vue";
	import { useDrwStore } from "@/stores/DrwStore";
	import { drwData } from "@/assets/data/drw.js";
	import { useRoute, useRouter } from 'vue-router';

	const route = useRoute();
	const router = useRouter();

	// Pinia store 가져오기
	const drwStore = useDrwStore();

	const result = ref(null);
	const winningNumbers = computed(() => {
		if (!result.value) return []
		return [
			result.value.drwtNo1,
			result.value.drwtNo2,
			result.value.drwtNo3,
			result.value.drwtNo4,
			result.value.drwtNo5,
			result.value.drwtNo6,
		]
	})

	// 그룹(색상) 계산 함수
	function getGroup(number) {
		// (number - 1)을 10으로 나누고 1을 더해 그룹 계산
		return Math.floor((number - 1) / 10) + 1;
	}


	function setHome() {
		const first = drwStore.getNumbers()[0]
		result.value = first ? first : null
	}

	function onDrawsEvent(e) {
		const draws = e.detail || []
		// 숫자들은 안드로이드에서 number로 전달됩니다. DrwStore는 문자열/숫자 모두 처리 가능.
		drwStore.setNumbers(draws);
		setHome();
	}
	
	onMounted(() => {
		window.addEventListener('lottovue:draws', onDrawsEvent)
		// 웹에서 독립 실행할 때(안드로이드 브리지 없음) 대비해 fallback도 가능:
		if (window.AndroidBridge?.getDrawsJson) { 
			const json = window.AndroidBridge.getDrawsJson()
			const draws = JSON.parse(json || '[]')
			drwStore.setNumbers(draws)
			setHome()
		} else {
			// 안드로이드 브리지가 없으면 로컬 데이터 사용
			drwStore.setNumbers(drwData)
			setHome()
		}
	})

	onBeforeUnmount(() => {
		window.removeEventListener('lottovue:draws', onDrawsEvent)
	})

</script>
