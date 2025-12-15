<template>
	<n-config-provider :theme="darkTheme">
		<div class="GameResultView">
			<section class="section section-area">
				<div class="section-header">
					<!-- 회차 선택 Select -->
					<div class="select-area">
						<label for="drwSelect" class="select-label label-big">회차 선택</label>
						<n-select
							id="drwSelect"
							v-model:value="selectedDrwNo"
							:options="drwOptions"
							size="large"
							:loading="loading"
							@update:value="updateResult"
						/>
					</div>
					<!-- 당첨 결과 -->
					<div v-if="result && result.drw_no">
						<h4 class="title-big">
							<strong>{{ result.drw_no }}회</strong> 당첨결과
						</h4>
						<p><span class="text-description-medium">({{ formatDate(result.drw_no_date) }} 추첨)</span></p>
					</div>
					<div v-else-if="loading">
						<p class="text-description-medium">로딩 중...</p>
					</div>
					<div v-else>
						<p class="text-description-medium">데이터 없음</p>
					</div>
				</div>
				<div class="section-body" v-if="result && result.drw_no">
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
											:class="'ball-' + getGroup(result.bnus_no)">{{ result.bnus_no }}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					
					<!-- 당첨 정보 테이블 -->
					<div class="prize-info-table" v-if="result">
						<h4 class="title-medium">당첨 정보</h4>
						<table class="info-table">
							<thead>
								<tr>
									<th>구분</th>
									<th>총 당첨금액</th>
									<th>당첨게임 수</th>
									<th>1게임당 당첨금액</th>
								</tr>
							</thead>
							<tbody>
								<!-- 1등 정보 -->
								<tr>
									<td><strong>1등</strong></td>
									<td>{{ formatCurrency(result.first_winamnt) }}원</td>
									<td>{{ formatNumber(result.first_przwner_co) }}게임</td>
									<td>{{ formatCurrency(result.first_winamnt_per_game) }}원</td>
								</tr>
								<!-- 2등 정보 -->
								<tr v-if="result.second_winamnt > 0 || result.second_przwner_co > 0">
									<td><strong>2등</strong></td>
									<td>{{ formatCurrency(result.second_winamnt) }}원</td>
									<td>{{ formatNumber(result.second_przwner_co) }}게임</td>
									<td>{{ formatCurrency(result.second_winamnt_per_game) }}원</td>
								</tr>
								<!-- 3등 정보 -->
								<tr v-if="result.third_winamnt > 0 || result.third_przwner_co > 0">
									<td><strong>3등</strong></td>
									<td>{{ formatCurrency(result.third_winamnt) }}원</td>
									<td>{{ formatNumber(result.third_przwner_co) }}게임</td>
									<td>{{ formatCurrency(result.third_winamnt_per_game) }}원</td>
								</tr>
								<!-- 4등 정보 -->
								<tr v-if="result.fourth_winamnt > 0 || result.fourth_przwner_co > 0">
									<td><strong>4등</strong></td>
									<td>{{ formatCurrency(result.fourth_winamnt) }}원</td>
									<td>{{ formatNumber(result.fourth_przwner_co) }}게임</td>
									<td>{{ formatCurrency(result.fourth_winamnt_per_game) }}원</td>
								</tr>
								<!-- 5등 정보 -->
								<tr v-if="result.fifth_winamnt > 0 || result.fifth_przwner_co > 0">
									<td><strong>5등</strong></td>
									<td>{{ formatCurrency(result.fifth_winamnt) }}원</td>
									<td>{{ formatNumber(result.fifth_przwner_co) }}게임</td>
									<td>{{ formatCurrency(result.fifth_winamnt_per_game) }}원</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</div>
	</n-config-provider>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from "vue";
	import { NSelect, darkTheme } from "naive-ui";
	import { getDraws, getDrawByNumber, getLatestDraw } from "@/api/lotto";

	const isDark = ref(true)

	// 상태 관리
	const loading = ref(false)
	const draws = ref([])
	const result = ref(null)
	const selectedDrwNo = ref(null)
	const error = ref(null)

	// 회차 목록 옵션
	const drwOptions = computed(() => {
		return draws.value.map(d => ({
			label: `${d.drw_no}회`,
			value: d.drw_no,
		}))
	})

	// 당첨번호를 배열로 정리
	const winningNumbers = computed(() => {
		if (!result.value) return []
		return [
			result.value.drwt_no1,
			result.value.drwt_no2,
			result.value.drwt_no3,
			result.value.drwt_no4,
			result.value.drwt_no5,
			result.value.drwt_no6,
		]
	})

	// 날짜 포맷팅 함수
	function formatDate(dateString) {
		if (!dateString) return ''
		return dateString
	}

	// 그룹(색상) 계산 함수
	function getGroup(number) {
		return Math.floor((number - 1) / 10) + 1;
	}

	// 금액 포맷팅 함수 (천 단위 구분)
	function formatCurrency(amount) {
		if (amount === null || amount === undefined || amount === 0) return '0'
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	// 숫자 포맷팅 함수 (천 단위 구분)
	function formatNumber(num) {
		if (num === null || num === undefined || num === 0) return '0'
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	// 회차 목록 가져오기
	async function fetchDraws() {
		loading.value = true
		error.value = null
		try {
			console.log('회차 목록 요청 시작...')
			const data = await getDraws(0, 1000) // 최대 1000개까지 가져오기
			console.log('회차 목록 응답:', data)
			
			// 회차번호 내림차순 정렬 (최신 회차가 먼저)
			draws.value = data.sort((a, b) => b.drw_no - a.drw_no)
			
			// 기본값을 최신 회차로 설정
			if (draws.value.length > 0 && !selectedDrwNo.value) {
				selectedDrwNo.value = draws.value[0].drw_no
				await fetchDrawByNumber(selectedDrwNo.value)
			}
		} catch (err) {
			console.error('회차 목록을 가져오는데 실패했습니다:', err)
			error.value = err.response?.data?.detail || err.message || '데이터를 불러올 수 없습니다.'
		} finally {
			loading.value = false
		}
	}

	// 특정 회차의 당첨 정보 가져오기
	async function fetchDrawByNumber(drwNo) {
		if (!drwNo) return
		
		loading.value = true
		error.value = null
		try {
			console.log(`회차 ${drwNo} 당첨 정보 요청 시작...`)
			const data = await getDrawByNumber(drwNo)
			console.log(`회차 ${drwNo} 당첨 정보 응답:`, data)
			result.value = data
		} catch (err) {
			console.error(`회차 ${drwNo} 당첨 정보를 가져오는데 실패했습니다:`, err)
			error.value = err.response?.data?.detail || err.message || '데이터를 불러올 수 없습니다.'
			result.value = null
		} finally {
			loading.value = false
		}
	}

	// 회차 변경 시 결과 업데이트
	async function updateResult(drwNo) {
		if (drwNo) {
			await fetchDrawByNumber(drwNo)
		}
	}

	onMounted(async () => {
		await fetchDraws()
	})

</script>
