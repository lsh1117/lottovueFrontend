<template>
	<div>
		<div class="scroll-area">
			<!-- 회차 선택 Select -->
			<article class="article-area">
				<div class="select-area">
					<label for="drwSelect" class="select-label label-big">회차 선택</label>
					<select id="drwSelect" v-model="selectedDrwNo" @change="updateResult">
						<option v-for="drw in drwList" :key="drw" :value="drw">
							{{ drw }}회
						</option>
					</select>
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
							<tr v-for="recommend in myPickList" :key="recommend">
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
								<span>{{ $formatCurrency(no1 * $getWinamnt(1)) }}</span>
								<span>원</span>
							</td>
						</tr>
						<tr>
							<th><span>2등</span></th>
							<td><span>{{ no2 }}</span></td>
							<td>
								<span>{{ $formatCurrency(no2 * $getWinamnt(2)) }}</span>
								<span>원</span>
							</td>
						</tr>
						<tr>
							<th><span>3등</span></th>
							<td><span>{{ no3 }}</span></td>
							<td>
								<span>{{ $formatCurrency(no3 * $getWinamnt(3)) }}</span>
								<span>원</span>
							</td>
						</tr>
						<tr>
							<th><span>4등</span></th>
							<td><span>{{ no4 }}</span></td>
							<td>
								<span>{{ $formatCurrency(no4 * $getWinamnt(4)) }}</span>
								<span>원</span>
							</td>
						</tr>
						<tr>
							<th><span>5등</span></th>
							<td><span>{{ no5 }}</span></td>
							<td>
								<span>{{ $formatCurrency(no5 * $getWinamnt(5)) }}</span>
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

			<article class="article-area example-area">
				<div class="recommend-list">
					<table id="example-table" border="1">
						<thead>
							<tr>
								<th>1번째</th>
								<th>2번째</th>
								<th>3번째</th>
								<th>4번째</th>
								<th>5번째</th>
								<th>6번째</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="recommend in myPickList" :key="recommend">
								<td v-for="item in recommend.numbers" :key="item">
									{{item.number}}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</article>
		</div>
		<div class="btn-area btn-area-center">
			<button class="btn-primary btn-small" @click="$emit('close')">닫기</button>
			<button class="btn-primary btn-small" @click="exportTableToExcel('example-table', 'table-data.xlsx')">엑셀다운받기</button>
		</div>
	</div>
</template>

<script setup>
	import {
		onMounted,
		ref,
		getCurrentInstance
	} from "vue";
	import {
		useMyPickStore
	} from "@/stores/MyPickStore";
	import {
		useDrwStore
	} from "@/stores/DrwStore";
	import * as XLSX from 'xlsx';

	const instance = getCurrentInstance();
	const _global = instance.appContext.config.globalProperties;

	// 회차 정보
	const drwStore = useDrwStore();
    // 마지막 회차 번호 (DrwStore에서 최신 회차)
    const _lastDrw = Number(drwStore.getNumbers()[0].drwNo) + 1;

	// 추천(뽑기)번호 정보
	const myPickStore = useMyPickStore();
    // 선택 가능한 회차 리스트: 1회부터 최신 회차까지
    const drwList = ref([]);

    // 선택된 회차 (기본값은 최신 회차로 설정)
    const selectedDrwNo = ref(_lastDrw);

	// 추천(뽑기)번호 리스트
	const myPickList = ref(myPickStore.getMyPicks());

	const no1 = ref(0);
	const no2 = ref(0);
	const no3 = ref(0);
	const no4 = ref(0);
	const no5 = ref(0);
	const no6 = ref(0);

	const totalWon = ref(0);

	//console.log("####### 회차 리스트",drwList)

	// 번호 그룹 계산 함수
	function getGroup(n) {
		return Math.floor((n - 1) / 10) + 1;
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
        // 1) 안드로이드 저장 픽 불러오기
        try {
            const drwNo = Number(selectedDrwNo.value)
            if (window.AndroidBridge && typeof window.AndroidBridge.getPicksJson === 'function') {
                const json = window.AndroidBridge.getPicksJson(drwNo)
                const picks = JSON.parse(json || '[]')
                const converted = picks.map(p => ({
                    drw: p.drwNo,
                    numbers: [p.no1, p.no2, p.no3, p.no4, p.no5, p.no6].map(n => ({ number: Number(n) })),
                }))
                // 추천 목록 앞쪽에 내가 저장한 번호 우선 표시
                myPickList.value = converted.concat(myPickStore.getMyPicks(selectedDrwNo.value))
            } else {
                myPickList.value = myPickStore.getMyPicks(selectedDrwNo.value)
            }
        } catch (_) {
            myPickList.value = myPickStore.getMyPicks(selectedDrwNo.value)
        }
		myPickList.value.forEach(item => {
			// 저장한 회차가 다음 추첨 회차(최신 회차 + 1) 이상이면 아직 미추첨 처리
			if (Number(item.drw) >= Number(_lastDrw) ) {
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

		totalWon.value += no5.value * _global.$getWinamnt(5);
		totalWon.value += no4.value * _global.$getWinamnt(4);
		totalWon.value += no3.value * _global.$getWinamnt(3);
		totalWon.value += no2.value * _global.$getWinamnt(2);
		totalWon.value += no1.value * _global.$getWinamnt(1);

	}

	function checkMatching(drw, number) {
		try {
			
			// const _drwNo = {
			// 	"drwNo": "1160",
			// 	"drwNoDate": "2025.02.22",
			// 	"drwtNo1": "7",
			// 	"drwtNo2": "13",
			// 	"drwtNo3": "18",
			// 	"drwtNo4": "36",
			// 	"drwtNo5": "39",
			// 	"drwtNo6": "45",
			// 	"bnusNo": "19"
			// }
		
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
			// const _drwNo = {
			// 	"drwNo": "1160",
			// 	"drwNoDate": "2025.02.22",
			// 	"drwtNo1": "7",
			// 	"drwtNo2": "13",
			// 	"drwtNo3": "18",
			// 	"drwtNo4": "36",
			// 	"drwtNo5": "39",
			// 	"drwtNo6": "45",
			// 	"bnusNo": "19"
			// }
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

	function exportTableToExcel(tableID, filename = '') {
		// 테이블 요소 가져오기
		const table = document.getElementById(tableID);
		 // 테이블 데이터를 워크북으로 변환
		 const workbook = XLSX.utils.table_to_book(table);

		// 엑셀 파일 생성 및 다운로드
		XLSX.writeFile(workbook, filename);
		/*
		const rows = table.rows;

		// 엑셀 데이터 생성
		let excelContent = '<table>';
		for (let i = 0; i < rows.length; i++) {
			excelContent += '<tr>';
			const cells = rows[i].cells;
			for (let j = 0; j < cells.length; j++) {
				excelContent += '<td>' + cells[j].innerText + '</td>';
			}
			excelContent += '</tr>';
		}
		excelContent += '</table>';

		// Blob 생성 및 다운로드
		const excelFile =
			'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
			'<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>' +
			'<body>' +
			excelContent +
			'</body></html>';

		const blob = new Blob([excelFile], {
			type: 'application/vnd.ms-excel'
		});
		const url = URL.createObjectURL(blob);

		// 링크 생성 및 클릭으로 다운로드
		const a = document.createElement('a');
		a.href = url;
		a.download = filename ? filename + '.xls' : 'download.xls';
		a.click();

		// 메모리 해제
		URL.revokeObjectURL(url);
		*/
	}

    onMounted(() => {
        // 1 ~ 마지막 회차까지 생성 (오름차순)
        const list = [];
        for (let i = 1; i <= _lastDrw; i++) list.push(i);
        drwList.value = list.reverse(); // 최신 회차가 위에 오도록 내림차순 정렬
        selectedDrwNo.value = _lastDrw;
        updateResult();
    });
</script>

<style scoped>
</style>
