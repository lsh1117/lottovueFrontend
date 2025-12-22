<template>
	<div class="MyWinningNumberView">
		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">내 당첨번호 확인</h4>
			</div>
			<div class="section-body">
				<!-- 회차 선택 Select -->
				<article class="article-area">
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
				</article>

				<!-- 결과 목록 -->
				<article class="article-area">
					<div class="recommend-list">
						<table class="table-list">
							<colgroup>
								<col style="width:20%">
								<col style="width:65%">
								<col style="width:15%">
							</colgroup>
							<thead>
								<tr>
									<th><span>회차</span></th>
									<th><span>번호</span></th>
									<th><span>결과</span></th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="myPickList.length === 0">
									<td colspan="3" class="empty-cell">저장된 번호가 없습니다.</td>
								</tr>
								<tr v-else v-for="recommend in myPickList" :key="recommend">
									<td><span>{{ recommend.drw }}</span><span>회</span></td>
									<td>
										<div class="ball-area">
											<ul class="ball-list">
												<li class="ball-item" v-for="item in recommend.numbers" :key="item">
													<span v-if="item.matching" class="ball-645 ball-645-small" :class="'ball-' + getGroup(item.number)">{{item.number}}</span>
													<span v-else class="ball-645 ball-645-small ball-645-disable" :class="'ball-' + getGroup(item.number)">{{item.number}}</span>
												</li>
											</ul>
										</div>
									</td>
									<td v-if="recommend.result"><strong>{{recommend.no}}</strong><span>등</span></td>
									<td v-else><span>미추첨</span></td>
								</tr>
							</tbody>
						</table>
					</div>
				</article>

				<!-- 당첨금 확인 -->
				<article class="article-area">
					<table class="table-item">
						<colgroup>
							<col style="width:30%">
							<col style="width:35%">
							<col style="width:35%">
						</colgroup>
						<tbody>
							<tr>
								<th><span>1등</span></th>
								<td><span>{{ no1 }}</span></td>
								<td>
									<span v-if="currentDrawResult && currentDrawResult.first_winamnt_per_game">
										{{ formatCurrency(no1 * currentDrawResult.first_winamnt_per_game) }}
									</span>
									<span v-else>별도 확인 필요</span>
									<span v-if="currentDrawResult && currentDrawResult.first_winamnt_per_game">원</span>
								</td>
							</tr>
							<tr>
								<th><span>2등</span></th>
								<td><span>{{ no2 }}</span></td>
								<td>
									<span v-if="currentDrawResult && currentDrawResult.second_winamnt_per_game">
										{{ formatCurrency(no2 * currentDrawResult.second_winamnt_per_game) }}
									</span>
									<span v-else>별도 확인 필요</span>
									<span v-if="currentDrawResult && currentDrawResult.second_winamnt_per_game">원</span>
								</td>
							</tr>
							<tr>
								<th><span>3등</span></th>
								<td><span>{{ no3 }}</span></td>
								<td>
									<span v-if="currentDrawResult && currentDrawResult.third_winamnt_per_game">
										{{ formatCurrency(no3 * currentDrawResult.third_winamnt_per_game) }}
									</span>
									<span v-else>별도 확인 필요</span>
									<span v-if="currentDrawResult && currentDrawResult.third_winamnt_per_game">원</span>
								</td>
							</tr>
							<tr>
								<th><span>4등</span></th>
								<td><span>{{ no4 }}</span></td>
								<td>
									<span v-if="currentDrawResult && currentDrawResult.fourth_winamnt_per_game">
										{{ formatCurrency(no4 * currentDrawResult.fourth_winamnt_per_game) }}
									</span>
									<span v-else>{{ formatCurrency(no4 * $getWinamnt(4)) }}</span>
									<span>원</span>
								</td>
							</tr>
							<tr>
								<th><span>5등</span></th>
								<td><span>{{ no5 }}</span></td>
								<td>
									<span v-if="currentDrawResult && currentDrawResult.fifth_winamnt_per_game">
										{{ formatCurrency(no5 * currentDrawResult.fifth_winamnt_per_game) }}
									</span>
									<span v-else>{{ formatCurrency(no5 * $getWinamnt(5)) }}</span>
									<span>원</span>
								</td>
							</tr>
							<tr>
								<th><span>꽝</span></th>
								<td><span>{{ no6 }}</span></td>
								<td>
									<span>0</span>
								</td>
							</tr>
						</tbody>
					</table>
				</article>

				<!-- 총 당첨금 -->
				<article class="article-area">
					<table class="table-item">
						<colgroup>
							<col style="width:30%">
							<col style="width:70%">
						</colgroup>
						<tbody>
							<tr>
								<th><span>총 당첨금</span></th>
								<td><span>{{ formatCurrency(totalWon) }}</span><span>원</span></td>
							</tr>
						</tbody>
					</table>
				</article>
			</div>
		</section>
	</div>
</template>

<script setup>
	import {
		onMounted,
		ref,
		getCurrentInstance,
		computed,
		watch
	} from "vue";
	import {
		useMyPickStore
	} from "@/stores/MyPickStore";
	import {
		useDrwStore
	} from "@/stores/DrwStore";
	import { NSelect } from "naive-ui";
	import { getDraws, getDrawByNumber } from "@/api/lotto";
	import { useEventStore } from '@/stores/EventStore';

	const instance = getCurrentInstance();
	const _global = instance.appContext.config.globalProperties;

	// 회차 정보
	const drwStore = useDrwStore();
	// AI 추천 번호 정보
	const myPickStore = useMyPickStore();
	// 이벤트 스토어
	const eventStore = useEventStore();

	// 상태 관리
	const loading = ref(false);
	const draws = ref([]);
	const error = ref(null);
	const currentDrawResult = ref(null); // 선택된 회차의 당첨 정보

	// 회차 목록 옵션
	const drwOptions = computed(() => {
		return draws.value.map(d => ({
			label: `${d.drw_no}회`,
			value: d.drw_no,
		}));
	});

    // 선택된 회차 (기본값은 최신 회차로 설정)
    const selectedDrwNo = ref(null);

	// 마지막 회차 번호 계산 함수 (drwStore에서 가져오기 - 기존 로직 유지)
	function getLastDrwNo() {
		const numbers = drwStore.getNumbers();
		if (numbers && numbers.length > 0 && numbers[0]?.drwNo) {
			return Number(numbers[0].drwNo) + 1;
		}
		// API에서 가져온 회차 목록이 있으면 그것을 사용
		if (draws.value.length > 0) {
			return draws.value[0].drw_no + 1;
		}
		return 1; // 기본값 1
	}

	// 회차 목록 가져오기
	async function fetchDraws() {
		loading.value = true;
		error.value = null;
		try {
			console.log('회차 목록 요청 시작...');
			const data = await getDraws(0, 1000); // 최대 1000개까지 가져오기
			console.log('회차 목록 응답:', data);
			
			// 회차번호 내림차순 정렬 (최신 회차가 먼저)
			draws.value = data.sort((a, b) => b.drw_no - a.drw_no);
			
			// 기본값을 최신 회차로 설정
			if (draws.value.length > 0 && !selectedDrwNo.value) {
				selectedDrwNo.value = draws.value[0].drw_no;
				// 회차 정보를 drwStore에도 업데이트
				drwStore.setNumbers(draws.value);
			}
		} catch (err) {
			console.error('회차 목록을 가져오는데 실패했습니다:', err);
			error.value = err.response?.data?.detail || err.message || '데이터를 불러올 수 없습니다.';
		} finally {
			loading.value = false;
		}
	}

	// AI 추천 번호 리스트
	const myPickList = ref(myPickStore.getMyPicks());

	const no1 = ref(0);
	const no2 = ref(0);
	const no3 = ref(0);
	const no4 = ref(0);
	const no5 = ref(0);
	const no6 = ref(0);

	const totalWon = ref(0);

	// 경고 팝업 열기
	function openWarningPopup() {
		// 하루 동안 닫기 상태 확인
		const dismissedTime = localStorage.getItem('myWinningNumberWarningDismissed');
		if (dismissedTime) {
			const oneDay = 24 * 60 * 60 * 1000; // 24시간
			if (Date.now() - Number(dismissedTime) < oneDay) {
				return; // 하루 이내에 닫았으면 팝업을 띄우지 않음
			}
		}
		
		eventStore.emit('popup', {
			id: 'warning',
			title: '⚠️ 중요 안내',
			onClose: onWarningPopupClose,
		});
	}

	// 경고 팝업 닫기 핸들러
	function onWarningPopupClose() {
		// 로컬 스토리지에 닫기 상태 저장 (하루 동안)
		localStorage.setItem('myWinningNumberWarningDismissed', Date.now().toString());
	}

	// 번호 그룹 계산 함수
	function getGroup(n) {
		return Math.floor((n - 1) / 10) + 1;
	}

	// 선택된 회차의 당첨 정보 가져오기
	async function fetchDrawByNumber(drwNo) {
		if (!drwNo) return;
		
		try {
			console.log(`회차 ${drwNo} 당첨 정보 요청 시작...`);
			const data = await getDrawByNumber(drwNo);
			console.log(`회차 ${drwNo} 당첨 정보 응답:`, data);
			currentDrawResult.value = data;
		} catch (err) {
			console.error(`회차 ${drwNo} 당첨 정보를 가져오는데 실패했습니다:`, err);
			currentDrawResult.value = null;
		}
	}

	// 회차 변경 시 결과 업데이트
    async function updateResult() {
		//console.log("##### 회차 변경 시 결과 업데이트 :", selectedDrwNo.value);
		totalWon.value = 0;
		no1.value = 0;
		no2.value = 0;
		no3.value = 0;
		no4.value = 0;
		no5.value = 0;
		no6.value = 0;
		
		// 선택된 회차의 당첨 정보 가져오기
		if (selectedDrwNo.value) {
			await fetchDrawByNumber(selectedDrwNo.value);
		}
		
        // 웹 환경에서는 MyPickStore에서 데이터 가져오기
        try {
            myPickList.value = myPickStore.getMyPicks(selectedDrwNo.value)
        } catch (_) {
            myPickList.value = myPickStore.getMyPicks(selectedDrwNo.value)
        }
		const lastDrw = getLastDrwNo();
		myPickList.value.forEach(item => {
			// 저장한 회차가 다음 추첨 회차(최신 회차 + 1) 이상이면 아직 미추첨 처리
			if (Number(item.drw) >= Number(lastDrw) ) {
				// 결과 발표 안됨
				item.result = false;
				//console.log("결과 발표 안됨",item.drw)
			} else {
				// 결과 발표 됨
				//console.log("결과 발표 됨",item.drw)
				item.result = true;
				const _drw = item.drw;
				const _numbers = item.numbers;
				let _cnt = 0;
				let _no2 = 0;

				_numbers.forEach(numberObj => {
					const _matching = checkMatching(_drw, numberObj.number);
					numberObj.matching = _matching;
					if (_matching) {
						_cnt++;
					} else {
						_no2 = numberObj.number;
					}
				});

				if (_cnt === 3) {
					no5.value++;
					item.no = 5;
				} else if (_cnt === 4) {
					no4.value++;
					item.no = 4;
				} else if (_cnt === 5) {
					// 2등 여부 체크.
					if (checkNo2(_drw, _no2)) {
						no2.value++;
						item.no = 2;
					} else {
						no3.value++;
						item.no = 3;
					}

				} else if (_cnt === 6) {
					no1.value++;
					item.no = 1;

				} else {
					no6.value++;
					item.no = 6;
					item.won = 0;
				}
			}

		});

		// 실제 회차의 1게임당 당첨금으로 계산
		if (currentDrawResult.value) {
			if (currentDrawResult.value.first_winamnt_per_game) {
				totalWon.value += no1.value * currentDrawResult.value.first_winamnt_per_game;
			}
			if (currentDrawResult.value.second_winamnt_per_game) {
				totalWon.value += no2.value * currentDrawResult.value.second_winamnt_per_game;
			}
			if (currentDrawResult.value.third_winamnt_per_game) {
				totalWon.value += no3.value * currentDrawResult.value.third_winamnt_per_game;
			}
			if (currentDrawResult.value.fourth_winamnt_per_game) {
				totalWon.value += no4.value * currentDrawResult.value.fourth_winamnt_per_game;
			}
			if (currentDrawResult.value.fifth_winamnt_per_game) {
				totalWon.value += no5.value * currentDrawResult.value.fifth_winamnt_per_game;
			}
		} else {
			// 당첨 정보가 없을 경우 기존 방식 사용 (fallback)
			totalWon.value += no5.value * _global.$getWinamnt(5);
			totalWon.value += no4.value * _global.$getWinamnt(4);
			totalWon.value += no3.value * _global.$getWinamnt(3);
			totalWon.value += no2.value * _global.$getWinamnt(2);
			totalWon.value += no1.value * _global.$getWinamnt(1);
		}

	}

	function checkMatching(drw, number) {
		try {
			const _drwNo = drwStore.getDrwNo(drw);
			const _numbers = [
				Number(_drwNo.drwtNo1),
				Number(_drwNo.drwtNo2),
				Number(_drwNo.drwtNo3),
				Number(_drwNo.drwtNo4),
				Number(_drwNo.drwtNo5),
				Number(_drwNo.drwtNo6),
			]
			if (_numbers.includes(number)) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			console.log("error:",e.message);
			return null;
		}
	}

	function checkNo2(drw, number) {
		try {
			const _drwNo = drwStore.getDrwNo(drw);

			console.log("### 2등 체크 여부 보너스 번호 : ", Number(_drwNo.bnusNo))
			console.log("### 2등 체크 여부 선택 번호 : ", number)

			if (Number(_drwNo.bnusNo) === number) {
				return true;
			} else {
				return false;
			}

		} catch (e) {
			console.log("error:",e.message);
			return null;
		}
	}

	function formatCurrency(amount) {
		// 숫자를 문자열로 변환하고 정규식을 이용하여 3자리마다 ',' 삽입
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

    onMounted(async () => {
		// 회차 목록 가져오기
		await fetchDraws();
		
		// 회차 목록 로드 후 결과 업데이트
		if (selectedDrwNo.value) {
			updateResult();
		}

		// 경고 팝업 표시
		openWarningPopup();
    });
</script>

