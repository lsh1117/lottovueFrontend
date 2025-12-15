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
				<NotAppearInSuccessionUntil />
				<GroupAppearInSuccession />
				<GroupAppearInSuccessionUntil />
				<GroupNotAppearInSuccession />
				<GroupNotAppearInSuccessionUntil />
				<EvenAndOddAppearInSuccession />
				<EvenAndOddAppearInSuccessionUntil />
				<EvenAndOddNotAppearInSuccession />
				<EvenAndOddNotAppearInSuccessionUntil />
			</div>
		</section>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
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
	import { getDraws } from "@/api/lotto"
	import { isAuthenticated } from '@/utils/auth'

	const router = useRouter()
	const drwStore = useDrwStore()
	const loading = ref(false)
	const error = ref(null)

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

<style scoped>
</style>
