<template>
	<div class="GameResultView">
		<section class="section section-area">
			<div class="section-header">
				<!-- 회차 선택 Select -->
				<div class="select-area">
					<label for="drwSelect" class="select-label label-big">회차 선택</label>
					<select id="drwSelect" v-model="selectedDrwNo" @change="updateResult">
						<option v-for="drw in drwNumbers" :key="drw.drwNo" :value="drw.drwNo">
							{{ drw.drwNo }}회
						</option>
					</select>
				</div>
				<!-- 당첨 결과 -->
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

	// 회차 목록 (numbers 데이터에서 회차 정보만 추출)
	const drwNumbers = computed(() => drwStore.getNumbers().map(item => ({
		drwNo: item.drwNo,
		drwNoDate: item.drwNoDate,
	})));
	

	// 선택된 회차 (기본값은 최신 회차로 설정)
	const selectedDrwNo = ref(drwNumbers.value[0] ?.drwNo);

	// 선택된 회차의 결과 데이터
	const result = ref(drwStore.getDrwNo(selectedDrwNo.value));

	// 당첨번호를 배열로 정리
	const winningNumbers = ref([
		result.value.drwtNo1,
		result.value.drwtNo2,
		result.value.drwtNo3,
		result.value.drwtNo4,
		result.value.drwtNo5,
		result.value.drwtNo6,
	]);

	// 회차 변경 시 결과 업데이트
	function updateResult() {
		result.value = drwStore.getDrwNo(selectedDrwNo.value);
		winningNumbers.value = [
			result.value.drwtNo1,
			result.value.drwtNo2,
			result.value.drwtNo3,
			result.value.drwtNo4,
			result.value.drwtNo5,
			result.value.drwtNo6,
		];
	}

	// 그룹(색상) 계산 함수
	function getGroup(number) {
		return Math.floor((number - 1) / 10) + 1;
	}

</script>

<style scoped>
</style>
