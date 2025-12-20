<template>
	<div class="HomeView">
		<section class="section section-area" v-if="result && result.drw_no">
			<div class="section-header">
				<h4 class="title-big">
					<strong>{{ result.drw_no }}회</strong> 당첨결과
				</h4>
				<p><span class="text-description-medium">({{ formatDate(result.drw_no_date) }} 추첨)</span></p>
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
										:class="'ball-' + getGroup(result.bnus_no)">{{ result.bnus_no }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="section section-area" v-else-if="loading">
			<div class="section-body">
				<p class="text-description-medium" style="text-align: center;">로딩 중...</p>
			</div>
		</section>
		<section class="section section-area" v-else-if="error">
			<div class="section-body">
				<p class="text-description-medium" style="text-align: center; color: #ff4444;">{{ error }}</p>
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
	import { getLatestDraw } from "@/api/lotto";

	const result = ref(null);
	const loading = ref(false);
	const error = ref(null);

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

	// 그룹(색상) 계산 함수
	function getGroup(number) {
		// (number - 1)을 10으로 나누고 1을 더해 그룹 계산
		return Math.floor((number - 1) / 10) + 1;
	}

	// 날짜 포맷팅 함수
	function formatDate(dateString) {
		if (!dateString) return ''
		// YYYY-MM-DD 형식으로 반환
		return dateString
	}

	// 최신 당첨 정보 가져오기
	async function fetchLatestDraw() {
		loading.value = true
		error.value = null
		try {
			console.log('최신 당첨 정보 요청 시작...')
			const data = await getLatestDraw()
			console.log('최신 당첨 정보 응답:', data)
			result.value = data
		} catch (err) {
			console.error('최신 당첨 정보를 가져오는데 실패했습니다:', err)
			console.error('에러 상세:', {
				message: err.message,
				code: err.code,
				response: err.response,
				status: err.response?.status,
				data: err.response?.data,
				config: err.config
			})
			
			// 타임아웃 또는 네트워크 에러인 경우 사용자 친화적인 메시지 표시
			if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
				error.value = '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.'
			} else if (err.code === 'ERR_NETWORK' || !err.response) {
				error.value = '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
			} else {
				error.value = err.response?.data?.detail || err.message || '데이터를 불러올 수 없습니다.'
			}
			result.value = null
		} finally {
			loading.value = false
		}
	}
	
	onMounted(() => {
		fetchLatestDraw()
	})

</script>
