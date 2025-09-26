<template>
	<div class="AppearNumber">
		<div class="accordion accordion-area">
			<div class="accordion-header" @click="toggleAccordion">
				<label class="label-medium">번호별 등장 횟수</label>
				<span class="accordion-icon">{{ isOpen ? "▲" : "▼" }}</span>
			</div>
			<div class="accordion-body" v-if="isOpen">
				<div class="chart">
					<ul class="chart-list">
						<!-- 번호별 등장 횟수 표시 -->
						<li class="chart-item" v-for="(item, index) in numberStats" :key="index">
							<div class="chart-bar">
								<!-- 번호 라벨 -->
								<div class="chart-bar-label">
									<span class="ball-645" :class="'ball-' + getGroup(item.number)">{{ item.number }}</span>
								</div>
								<!-- 바 차트 -->
								<div class="chart-bar-volum">
									<span class="chart-bar-bg" :style="{ width: item.count * 1 + 'px' }"></span>
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
		ref,
		computed
	} from "vue";
	import {
		useDrwStore
	} from "@/stores/DrwStore";

	// Pinia store 가져오기
	const drwStore = useDrwStore();

	// 아코디언 상태 관리
	const isOpen = ref(false);

	// 아코디언 토글 함수
	const toggleAccordion = () => {
		isOpen.value = !isOpen.value;
	};

	// 번호 등장 횟수 계산 함수
	const calculateNumberStats = () => {
		return drwStore.getTotalAppear(drwStore.getNumbers());
	};

	// 번호별 등장 횟수를 반응형 데이터로 관리 (내림차순 정렬 추가)
	const numberStats = computed(() => {
		const statsArray = calculateNumberStats();

		// 등장 횟수를 기준으로 내림차순 정렬
		return statsArray.sort((a, b) => b.count - a.count);
	});

	// 그룹(색상) 계산 함수
	function getGroup(number) {
		// (number - 1)을 10으로 나누고 1을 더해 그룹 계산
		return Math.floor((number - 1) / 10) + 1;
	}

</script>

<style scoped>
</style>
