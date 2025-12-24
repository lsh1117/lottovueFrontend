<!-- src/App.vue -->
<template>
  <!-- 라우트에 따라 컴포넌트가 렌더링됨 -->
  <router-view /> 
  <!-- 팝업 -->
  <PopupManager/>
</template>

<script setup>
import { onMounted } from 'vue';
import PopupManager from '@/components/cmm/PopupManager.vue';
import { useDrwStore } from '@/stores/DrwStore';
import { getDraws } from '@/api/lotto';

const drwStore = useDrwStore();

// 모든 회차 정보 가져오기 (페이지네이션 방식)
async function fetchAllDraws() {
	try {
		//console.log('모든 회차 정보 요청 시작...');
		const allData = [];
		const limit = 1000; // 한 번에 가져올 최대 개수
		let skip = 0;
		let hasMore = true;
		
		// 모든 데이터를 가져올 때까지 반복 요청
		while (hasMore) {
			const data = await getDraws(skip, limit);
			
			if (data && data.length > 0) {
				allData.push(...data);
				skip += limit;
				
				// 가져온 데이터가 limit보다 적으면 마지막 페이지
				if (data.length < limit) {
					hasMore = false;
				}
			} else {
				hasMore = false;
			}
		}
		
		//console.log('회차 정보 응답:', allData);
		
		// 회차번호 내림차순 정렬 (최신 회차가 먼저)
		const sortedData = allData.sort((a, b) => b.drw_no - a.drw_no);
		
		// DrwStore에 저장 (API 응답의 snake_case를 camelCase로 변환)
		const convertedData = sortedData.map(item => ({
			drwNo: item.drw_no,
			drwtNo1: item.drwt_no1,
			drwtNo2: item.drwt_no2,
			drwtNo3: item.drwt_no3,
			drwtNo4: item.drwt_no4,
			drwtNo5: item.drwt_no5,
			drwtNo6: item.drwt_no6,
			bnusNo: item.bnus_no,
			// 기타 필드도 필요하면 추가
			drw_no_date: item.drw_no_date,
			first_winamnt: item.first_winamnt,
			first_przwner_co: item.first_przwner_co,
			first_winamnt_per_game: item.first_winamnt_per_game,
			second_winamnt: item.second_winamnt,
			second_przwner_co: item.second_przwner_co,
			second_winamnt_per_game: item.second_winamnt_per_game,
			third_winamnt: item.third_winamnt,
			third_przwner_co: item.third_przwner_co,
			third_winamnt_per_game: item.third_winamnt_per_game,
			fourth_winamnt: item.fourth_winamnt,
			fourth_przwner_co: item.fourth_przwner_co,
			fourth_winamnt_per_game: item.fourth_winamnt_per_game,
			fifth_winamnt: item.fifth_winamnt,
			fifth_przwner_co: item.fifth_przwner_co,
			fifth_winamnt_per_game: item.fifth_winamnt_per_game,
		}));
		
		drwStore.setNumbers(convertedData);
		//console.log('모든 회차 정보를 DrwStore에 저장 완료:', convertedData.length, '개');
	} catch (err) {
		console.error('회차 정보를 가져오는데 실패했습니다:', err);
		// 에러가 발생해도 앱은 계속 실행되도록 함
	}
}

onMounted(() => {
	fetchAllDraws();
});
</script>

<style>
/* 전역 스타일 (필요시) */
</style>
