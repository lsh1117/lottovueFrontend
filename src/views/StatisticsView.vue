<template>
	<div class="StatisticsView">
		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">통계 보기</h4>
				<div v-if="loading" style="text-align: center; padding: 20px;">
					<p class="text-description-medium">당첨 정보를 불러오는 중...</p>
				</div>
				<div v-if="error" style="text-align: center; padding: 20px; color: red;">
					<p class="text-description-medium">오류: {{ error }}</p>
				</div>
			</div>
			<div class="section-body" v-if="!loading">
				<!-- AppearNumber 컴포넌트 삽입 -->
				<LastAppearNumber />
				<AppearNumber />
				<AppearInSuccession />
				<AppearInSuccessionUntil />
				<NotAppearInSuccession />
				<NotAppearInSuccessionUntil/>
				<GroupAppearInSuccession/>
				<GroupAppearInSuccessionUntil/>
				<GroupNotAppearInSuccession/>
				<GroupNotAppearInSuccessionUntil/>
				<EvenAndOddAppearInSuccession/>
				<EvenAndOddAppearInSuccessionUntil/>
				<EvenAndOddNotAppearInSuccession/>
				<EvenAndOddNotAppearInSuccessionUntil/>
				<!-- <EvenAndOddNotAppearInSuccessionUntil v-if="isProPlanOrAbove" /> -->
			</div>
		</section>
		<section class="section section-area fixed-bottom">
			<div class="btn-area btn-area-center">
				<button 
					class="btn-primary btn-large" 
					@click="openAIRecommendationPopup"
					:disabled="loading || aiLoading || !drwStore.numbers.length || !isProPlanOrAbove"
				>
					{{ aiLoading ? 'AI 분석 중...' : (isProPlanOrAbove ? 'AI 추천 받기' : 'AI 분석 (Pro 플랜 필요)') }}
				</button>
				<p v-if="!isProPlanOrAbove" style="text-align: center; margin-top: 10px; color: #666; font-size: 14px;">
					AI 분석 기능은 Pro 플랜 이상에서 이용 가능합니다.
				</p>
			</div>
		</section>
		<!-- 
		<section class="section sample-area" v-if="!loading">
			<div class="accordion accordion-area">
				<div class="accordion-header">
					<label class="label-medium">번호별 최근 100회 등장 정보 조회</label>
				</div>
				<div class="accordion-body">
					<div style="padding: 20px;">
						<div style="margin-bottom: 20px;">
							<label for="number-select" style="display: block; margin-bottom: 10px; font-weight: bold;">번호 선택:</label>
							<select 
								id="number-select"
								v-model="selectedNumber" 
								style="width: 100%; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px;"
							>
								<option value="">번호를 선택하세요</option>
								<option v-for="num in 45" :key="num" :value="num">{{ num }}번</option>
							</select>
						</div>

						<div v-if="selectedNumber && selectedNumberInfo.count > 0" style="margin-top: 20px;">
							<div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
								<h5 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
									<span class="ball-645" :class="'ball-' + getGroup(selectedNumber)">{{ selectedNumber }}</span>
									번 최근 100회 등장 정보
								</h5>
								<p style="font-size: 16px; margin-bottom: 5px;"><strong>총 등장 횟수:</strong> {{ selectedNumberInfo.count }}회</p>
								<p style="font-size: 14px; color: #666;">최근 100회 중 등장 비율: {{ selectedNumberInfo.percentage }}%</p>
								<p v-if="selectedNumberInfo.latest" style="font-size: 14px; color: #666; margin-top: 5px;">
									<strong>가장 최근 등장:</strong> {{ selectedNumberInfo.latest.drwNo }}회차 ({{ selectedNumberInfo.latest.drwNoDate }})
								</p>
							</div>

							<div style="margin-top: 20px;">
								<h6 style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">등장한 회차 목록:</h6>
								<div style="display: flex; flex-wrap: wrap; gap: 10px;">
									<span 
										v-for="(appearance, index) in selectedNumberInfo.appearances" 
										:key="index"
										style="display: inline-block; padding: 8px 12px; background-color: #e8f4f8; border-radius: 4px; font-size: 14px; cursor: pointer;"
										:title="`당첨번호: ${appearance.numbers.join(', ')}`"
									>
										{{ appearance.drwNo }}회차 ({{ appearance.drwNoDate }})
									</span>
								</div>
							</div>
						</div>
						<div v-else-if="selectedNumber && selectedNumberInfo.count === 0" style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 4px;">
							<p style="font-size: 16px; color: #856404;">
								<span class="ball-645" :class="'ball-' + getGroup(selectedNumber)">{{ selectedNumber }}</span>
								번은 최근 100회 동안 등장하지 않았습니다.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
		-->
	</div>
</template>

<script setup>
	import { ref, onMounted, computed } from 'vue'
	import { useRouter } from 'vue-router'
	import LastAppearNumber from "@/components/stt/LastAppearNumber.vue"; // 최근 100회 동안 번호별 등장 횟수 컴포넌트 가져오기
	import AppearNumber from "@/components/stt/AppearNumber.vue"; // 번호별 등장 횟수 컴포넌트 가져오기
	import AppearInSuccession from "@/components/stt/AppearInSuccession.vue"; // 연속등장 컴포넌트 가져오기
	import AppearInSuccessionUntil from "@/components/stt/AppearInSuccessionUntil.vue"; // 현재까지 연속 등장 컴포넌트 가져오기
	import NotAppearInSuccession from "@/components/stt/NotAppearInSuccession.vue"; // 연속 미등장 컴포넌트 가져오기
	import NotAppearInSuccessionUntil from "@/components/stt/NotAppearInSuccessionUntil.vue"; // 현재까지 연속 미등장 컴포넌트 가져오기
	import GroupAppearInSuccession from "@/components/stt/GroupAppearInSuccession.vue"; // 구간별 연속등장 컴포넌트 가져오기
	import GroupAppearInSuccessionUntil from "@/components/stt/GroupAppearInSuccessionUntil.vue"; // 현재까지 구간별 연속등장 컴포넌트 가져오기
	import GroupNotAppearInSuccession from "@/components/stt/GroupNotAppearInSuccession.vue"; // 구간별 연속 미등장 컴포넌트 가져오기
	import GroupNotAppearInSuccessionUntil from "@/components/stt/GroupNotAppearInSuccessionUntil.vue"; // 현재까지 구간별 연속 미등장 컴포넌트 가져오기
	import EvenAndOddAppearInSuccession from "@/components/stt/EvenAndOddAppearInSuccession.vue"; // 짝수홀수 연속 등장 컴포넌트 가져오기
	import EvenAndOddAppearInSuccessionUntil from "@/components/stt/EvenAndOddAppearInSuccessionUntil.vue"; // 현재까지 짝수홀수 연속 등장 컴포넌트 가져오기
	import EvenAndOddNotAppearInSuccession from "@/components/stt/EvenAndOddNotAppearInSuccession.vue"; // 짝수홀수 연속 미등장 컴포넌트 가져오기
	import EvenAndOddNotAppearInSuccessionUntil from "@/components/stt/EvenAndOddNotAppearInSuccessionUntil.vue"; // 짝수홀수 현재까지 연속 미등장 컴포넌트 가져오기
	import { useDrwStore } from "@/stores/DrwStore"
	import { getDraws, getAIRecommendation } from "@/api/lotto"
	import { isAuthenticated, getUser } from '@/utils/auth'
	import { useEventStore } from '@/stores/EventStore'

	const router = useRouter()
	const drwStore = useDrwStore()
	const eventStore = useEventStore()
	const loading = ref(false)
	const error = ref(null)
	const aiLoading = ref(false)
	const aiError = ref(null)
	const aiRecommendationData = ref({
		recommendation: null,
		model: null,
		usage: null
	})

	// 프로플랜 이상인지 확인
	const isProPlanOrAbove = computed(() => {
		const user = getUser()
		return user?.plan === 'pro' || user?.plan === 'max'
	})

	// 선택된 번호
	const selectedNumber = ref(null)

	// 그룹(색상) 계산 함수
	function getGroup(number) {
		// (number - 1)을 10으로 나누고 1을 더해 그룹 계산
		return Math.floor((number - 1) / 10) + 1
	}

	// 선택된 번호의 최근 100회 등장 정보 계산
	const selectedNumberInfo = computed(() => {
		if (!selectedNumber.value) {
			return {
				count: 0,
				percentage: 0,
				appearances: [],
				latest: null
			}
		}

		const allNumbers = drwStore.getNumbers()
		if (!allNumbers || allNumbers.length === 0) {
			return {
				count: 0,
				percentage: 0,
				appearances: [],
				latest: null
			}
		}

		// 회차번호 기준으로 내림차순 정렬하여 최신 회차부터 정렬
		const sortedNumbers = [...allNumbers].sort((a, b) => Number(b.drwNo) - Number(a.drwNo))
		// 최신 100회만 가져오기
		const last100 = sortedNumbers.slice(0, 100)

		// 선택된 번호가 등장한 회차 찾기
		const appearances = []
		let count = 0
		const targetNumber = Number(selectedNumber.value)

		last100.forEach((draw) => {
			const numbers = [
				Number(draw.drwtNo1),
				Number(draw.drwtNo2),
				Number(draw.drwtNo3),
				Number(draw.drwtNo4),
				Number(draw.drwtNo5),
				Number(draw.drwtNo6)
			]

			if (numbers.includes(targetNumber)) {
				count++
				appearances.push({
					drwNo: draw.drwNo,
					drwNoDate: draw.drwNoDate,
					numbers: numbers
				})
			}
		})

		return {
			count: count,
			percentage: Math.round((count / 100) * 100),
			appearances: appearances,
			latest: appearances.length > 0 ? appearances[0] : null
		}
	})

	// 백엔드 응답(snake_case)을 DrwStore 형식(camelCase)으로 변환
	function convertToCamelCase(draw) {
		return {
			drwNo: draw.drw_no,
			drwNoDate: draw.drw_no_date,
			drwtNo1: draw.drwt_no1,
			drwtNo2: draw.drwt_no2,
			drwtNo3: draw.drwt_no3,
			drwtNo4: draw.drwt_no4,
			drwtNo5: draw.drwt_no5,
			drwtNo6: draw.drwt_no6,
			bnusNo: draw.bnus_no,
			totSellamnt: draw.tot_sellamnt,
			firstWinamnt: draw.first_winamnt,
			firstPrzwnerCo: draw.first_przwner_co,
			firstAccumamnt: draw.first_accumamnt,
		}
	}

	// 모든 당첨 정보 가져오기 (1회차부터 최근 회차까지)
	async function fetchAllDraws() {
		loading.value = true
		error.value = null
		try {
			console.log('모든 당첨 정보 요청 시작...')
			
			// 한 번에 최대 1000개까지 가져올 수 있으므로, 여러 번 호출하여 모든 데이터 가져오기
			let allDraws = []
			let skip = 0
			const limit = 1000
			let hasMore = true

			while (hasMore) {
				const data = await getDraws(skip, limit)
				if (data && data.length > 0) {
					allDraws = allDraws.concat(data)
					skip += data.length
					
					// 가져온 데이터가 limit보다 적으면 마지막 페이지
					if (data.length < limit) {
						hasMore = false
					}
				} else {
					hasMore = false
				}
			}

			console.log(`총 ${allDraws.length}개의 당첨 정보를 가져왔습니다.`)

			// 회차번호 오름차순 정렬 (1회차부터)
			allDraws.sort((a, b) => a.drw_no - b.drw_no)

			// camelCase로 변환
			const convertedDraws = allDraws.map(convertToCamelCase)

			// DrwStore에 설정
			drwStore.setNumbers(convertedDraws)
			
			console.log('DrwStore에 당첨 정보 설정 완료')
		} catch (err) {
			console.error('당첨 정보를 가져오는데 실패했습니다:', err)
			error.value = err.response?.data?.detail || err.message || '데이터를 불러올 수 없습니다.'
		} finally {
			loading.value = false
		}
	}

	// 통계 데이터를 JSON으로 수집하는 함수
	function collectStatisticsData() {
		const numbers = drwStore.getNumbers()
		if (!numbers || numbers.length === 0) {
			throw new Error('당첨 정보가 없습니다.')
		}

		// 최신 회차 정보
		const latestDraw = numbers[0]
		const nextDrwNo = Number(latestDraw.drwNo) + 1

		// 전체 통계 데이터 수집
		const statisticsData = {
			// 기본 정보
			next_drw_no: nextDrwNo,
			total_draws: numbers.length,
			latest_draw: {
				drw_no: latestDraw.drwNo,
				drw_no_date: latestDraw.drwNoDate,
				numbers: [
					latestDraw.drwtNo1,
					latestDraw.drwtNo2,
					latestDraw.drwtNo3,
					latestDraw.drwtNo4,
					latestDraw.drwtNo5,
					latestDraw.drwtNo6
				],
				bonus_no: latestDraw.bnusNo
			},

			// 번호별 등장 횟수 (전체)
			total_appear: drwStore.getTotalAppear(numbers),

			// 번호별 등장 횟수 (최근 100회)
			last_100_appear: drwStore.getTotalAppear(numbers.slice(0, 100)),

			// 연속 등장 통계
			appear_in_succession: drwStore.getAppearInSuccession(numbers),
			appear_in_succession_until: drwStore.getAppearInSuccessionUntil(numbers),

			// 연속 미등장 통계
			not_appear_in_succession: drwStore.getNotAppearInSuccession(numbers),
			not_appear_in_succession_until: drwStore.getNotAppearInSuccessionUntil(numbers),

			// 구간별 연속 등장 통계
			group_appear_in_succession: drwStore.getGroupAppearInSuccession(numbers),
			group_appear_in_succession_until: drwStore.getGroupAppearInSuccessionUntil(numbers),

			// 구간별 연속 미등장 통계
			group_not_appear_in_succession: drwStore.getGroupNotAppearInSuccession(numbers),
			group_not_appear_in_succession_until: drwStore.getGroupNotAppearInSuccessionUntil(numbers),

			// 짝수홀수 연속 등장 통계
			even_odd_appear_in_succession: drwStore.getEvenAndOddAppearInSuccession(numbers),
			even_odd_appear_in_succession_until: drwStore.getEvenAndOddAppearInSuccessionUntil(numbers),

			// 짝수홀수 연속 미등장 통계
			even_odd_not_appear_in_succession: drwStore.getEvenAndOddNotAppearInSuccession(numbers),
			even_odd_not_appear_in_succession_until: drwStore.getEvenAndOddNotAppearInSuccessionUntil(numbers),

			// 최근 10회차 당첨번호
			recent_10_draws: numbers.slice(0, 10).map(draw => ({
				drw_no: draw.drwNo,
				drw_no_date: draw.drwNoDate,
				numbers: [
					draw.drwtNo1,
					draw.drwtNo2,
					draw.drwtNo3,
					draw.drwtNo4,
					draw.drwtNo5,
					draw.drwtNo6
				],
				bonus_no: draw.bnusNo
			}))
		}

		return statisticsData
	}

	// AI 추천 팝업 열기
	async function openAIRecommendationPopup() {
		// Pro 플랜 이상인지 확인
		if (!isProPlanOrAbove.value) {
			// Pro 플랜이 아니면 업그레이드 안내
			if (confirm('AI 분석 기능은 Pro 플랜 이상에서 이용 가능합니다.\n플랜 업그레이드 페이지로 이동하시겠습니까?')) {
				router.push('/plan-upgrade')
			}
			return
		}

		// 기존에 받은 데이터가 있으면 팝업만 열고 API 호출하지 않음
		if (aiRecommendationData.value && aiRecommendationData.value.recommendation) {
			console.log('기존 AI 추천 데이터 사용')
			eventStore.emit('popup', {
				id: "aiRecommendation",
				title: "AI 추천 결과",
				onClose: onAIRecommendationPopupClose,
				options: {
					recommendation: aiRecommendationData.value.recommendation,
					model: aiRecommendationData.value.model,
					usage: aiRecommendationData.value.usage,
					loading: false,
					error: null,
				},
			})
			return
		}

		// 팝업 먼저 열기 (로딩 상태로)
		eventStore.emit('popup', {
			id: "aiRecommendation",
			title: "AI 추천 결과",
			onClose: onAIRecommendationPopupClose,
			options: {
				recommendation: null,
				model: null,
				usage: null,
				loading: true,
				error: null,
			},
		})

		aiLoading.value = true
		aiError.value = null
		aiRecommendationData.value = {
			recommendation: null,
			model: null,
			usage: null
		}

		try {
			// 통계 데이터 수집
			const statisticsData = collectStatisticsData()
			
			console.log('통계 데이터 수집 완료:', statisticsData)
			console.log('JSON 데이터:', JSON.stringify(statisticsData, null, 2))

			// API 호출
			const response = await getAIRecommendation(statisticsData)
			
			console.log('AI 추천 응답:', response)

			// 응답 처리
			if (response && response.recommendation) {
				aiRecommendationData.value = {
					recommendation: response.recommendation,
					model: response.model || null,
					usage: response.usage || null
				}
			} else if (response && response.message) {
				aiRecommendationData.value = {
					recommendation: response.message,
					model: null,
					usage: null
				}
			} else {
				aiRecommendationData.value = {
					recommendation: 'AI 추천 결과를 받았습니다.',
					model: null,
					usage: null
				}
			}

			// 데이터 업데이트 후 팝업 다시 열기 (데이터 포함)
			eventStore.emit('popup', {
				id: "aiRecommendation",
				title: "AI 추천 결과",
				onClose: onAIRecommendationPopupClose,
				options: {
					recommendation: aiRecommendationData.value.recommendation,
					model: aiRecommendationData.value.model,
					usage: aiRecommendationData.value.usage,
					loading: false,
					error: null,
				},
			})
		} catch (err) {
			console.error('AI 추천 요청 오류:', err)
			aiError.value = err.response?.data?.detail || err.message || 'AI 추천 요청에 실패했습니다.'
			
			// 에러 상태로 팝업 다시 열기
			eventStore.emit('popup', {
				id: "aiRecommendation",
				title: "AI 추천 결과",
				onClose: onAIRecommendationPopupClose,
				options: {
					recommendation: null,
					model: null,
					usage: null,
					loading: false,
					error: aiError.value,
				},
			})
		} finally {
			aiLoading.value = false
		}
	}

	// AI 추천 팝업 닫기 핸들러
	function onAIRecommendationPopupClose(e) {
		aiError.value = null
		// 데이터는 유지 (다음에 다시 열 때 재사용하기 위해)
	}

	onMounted(async () => {
		// 로그인 체크
		if (!isAuthenticated()) {
			alert('통계 기능은 로그인 사용자만 이용 가능합니다.');
			router.push('/home');
			return;
		}
		
		await fetchAllDraws()
	})

</script>
