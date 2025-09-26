<template>
	<div class="NotAppearInSuccessionUntil">
		<div class="accordion accordion-area">

			<div class="accordion-header" @click="toggleAccordion">
				<label class="label-medium">번호별 현재까지 연속 미등장 횟수</label>
				<span class="accordion-icon">{{ isOpen ? "▲" : "▼" }}</span>
			</div>

			<div class="accordion-body" v-if="isOpen">
				<div class="chart">
					<ul class="chart-list">
						<li class="chart-item" v-for="(item, index) in numberStats" :key="index">
							<div class="chart-bar">
								<!-- 번호 라벨 -->
								<div class="chart-bar-label">
									<span class="ball-645"
										:class="'ball-' + getGroup(item.number)">{{ item.number }}</span>
								</div>
								<!-- 연속 등장 횟수와 바 차트 -->
								<div class="chart-bar-volum">
									<span class="chart-bar-bg" :style="{ width: item.count * 5 + 'px' }"></span>
									<span>{{ item.count }}</span>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		computed,
		onMounted,
		ref
	} from 'vue';
	import {
		useDrwStore
	} from '@/stores/DrwStore';

	// Pinia store 가져오기
	const drwStore = useDrwStore();

	// 아코디언 상태 (열림/닫힘)
	const isOpen = ref(false);

	// 전체 데이터에서 현재까지 연속 미등장 횟수 계산
	const notAppearInSuccessionUntil = () => {
		const draws = drwStore.getNumbers(); // Store에서 당첨 번호들 가져오기
		return drwStore.getNotAppearInSuccessionUntil(draws); // 연속 등장 횟수 계산
	};

	// 현재까지 연속 미등장 횟수를 반응형 데이터로 관리 (내림차순 정렬 추가)
	const numberStats = computed(() => {
		const statsArray = notAppearInSuccessionUntil();

		// 등장 횟수를 기준으로 내림차순 정렬
		return statsArray.sort((a, b) => b.count - a.count);
	});

	// 그룹(색상) 계산 함수
	function getGroup(number) {
		return Math.floor((number - 1) / 10) + 1;
	}

	// 아코디언 토글 함수
	function toggleAccordion() {
		isOpen.value = !isOpen.value; // 열기/닫기 상태 반전
	}

</script>

<style scoped>
</style>
