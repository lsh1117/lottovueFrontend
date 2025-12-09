<template>
	<div>
		<!-- 히스토리 표시 안내 메시지 -->
		<div v-if="showingHistory" class="history-notice">
			<p>{{ _nextDrw }}회차에 생성된 번호 목록 (총 {{ currentPickCount }}개)</p>
		</div>
		
        <div class="scroll-area">
            <article class="article-area" v-for="(recommend, idx) in recommends" :key="idx">
				<div class="ball-area">
					<ul class="ball-list">
						<li class="ball-item" v-for="item in recommend.numbers" :key="item">
							<span class="ball-645 ball-645-medium" :class="'ball-' + getGroup(item.number)">{{item.number}}</span>
						</li>
					</ul>
					<button class="btn btn-primary btn-small" :disabled="saved[idx]" @click="saveMyPick(recommend, idx)">{{ saved[idx] ? '완료' : '저장' }}</button>
				</div>
			</article>
		</div>
		
		<div class="btn-area btn-area-center">
			<button class="btn-primary btn-small" :disabled="allSaved" @click="saveAll">{{ allSaved ? '완료' : '전체저장' }}</button>
			<button class="btn-primary btn-small" @click="$emit('close')">닫기</button>
		</div>

		<!-- Naive UI Modal: 생성 한도 초과 알림 -->
		<n-modal
			v-model:show="showLimitModal"
			preset="dialog"
			title="번호 생성 제한"
			:positive-text="isPremium ? (showingHistory ? '닫기' : '기존 생성 번호 보기') : '프로버전 업그레이드'"
			:negative-text="isPremium ? null : (showingHistory ? '닫기' : '기존 생성 번호 보기')"
			:closable="false"
			@positive-click="handleModalPositiveClick"
			@negative-click="handleModalNegativeClick"
		>
			<div style="line-height: 1.8;">
				<!-- 프리 버전 메시지 -->
				<template v-if="!isPremium">
					<p>
						무료 버전에서는 <strong>회차별 최대 2개</strong>의 번호 조합만 생성할 수 있습니다.<br>
						더 많은 번호를 생성하려면 <strong>프로버전으로 업그레이드</strong>가 필요합니다.
					</p>
				</template>
				<!-- 프로 버전 메시지 -->
				<template v-else>
					<p>
						프로 버전에서는 <strong>회차별 최대 100개</strong>까지 번호를 생성할 수 있습니다.<br>
						현재 <strong>{{ _nextDrw }}회차</strong>는 이미 최대 개수인 <strong>{{ currentPickCount }}개</strong>에 도달했습니다.
					</p>
				</template>
			</div>
		</n-modal>
	</div>
</template>

<script setup>
	import { onMounted, onUnmounted, ref } from "vue";
	import { NModal } from "naive-ui";
	import { useCalculateStore } from "@/stores/CalculateStore";
	import { useExceptionStore } from "@/stores/ExceptionStore";
	import { useFixedStore } from "@/stores/FixedStore";
	import { useRecommendStore } from "@/stores/RecommendStore";
	import { useMyPickStore } from "@/stores/MyPickStore";
	import { useDrwStore } from "@/stores/DrwStore";
	import { useEventStore } from "@/stores/EventStore";

	// emit 정의
	const emit = defineEmits(['close']);

	// 한도 초과 모달 표시 상태
	const showLimitModal = ref(false);
	
	// 한도 초과 시 pickHistory 표시 여부
	const showingHistory = ref(false);
	
	// 최대 생성 가능 개수
	const maxPickCount = ref(2);
	
	// 현재 저장된 개수
	const currentPickCount = ref(0);
	
	// 프로 버전 여부
	const isPremium = ref(false);
	
	// EventStore 가져오기
	const eventStore = useEventStore();

	// Pinia store 가져오기
	const exceptionStore = useExceptionStore();
	const fixedStore = useFixedStore();
	const calculateStore = useCalculateStore();
	const recommendStore = useRecommendStore();
	const myPickStore = useMyPickStore();
	const drwStore = useDrwStore();

	// 제외 번호
	const _exceptionNumber = exceptionStore.numbers;
	// 고정 번호
	const _fixedNumber = fixedStore.numbers;

	// 다음 회차 번호
	const _nextDrw = Number(drwStore.numbers[0].drwNo) + 1;

	// 번호뽑기시 삭제해야 할 번호. ( 제외번호+고정번호 )
	const _exc = _exceptionNumber.concat(_fixedNumber);

	// 계산에 필요한 모든 숫자 
	let _totalNumbers = [...calculateStore.getNumbers()];

	// 번호뽑기시 삭제해야 할 번호 제외 한 전체 번호
	let _newTotalNumbers = _totalNumbers.filter(item => !_exc.includes(item));

	// 고정번호를 제외한 나머지 번호 갯수
	const _cnt = 6 - _fixedNumber.length;

	// 추천 번호 리스트
	const recommends = ref([]);
	// 각 항목 저장 상태
	const saved = ref([]);
	// 전체 저장 상태
	const allSaved = ref(false);

	// 추천 번호 갯수 정의 (안드로이드 앱에서 회차별로 가져오기, 웹에서는 기본값 2)
	let _recommendCnt = 0;

	function checkRecommendCount(){
		// 기본값 설정 (웹 환경)
		_recommendCnt = isPremium.value ? 100 : 2;
		currentPickCount.value = 0; // 웹에서는 0으로 설정

		// 생성 가능한 번호 조합이 0개인 경우 모달 표시
		if (_recommendCnt === 0) {
			showLimitModal.value = true;
		}
	}

	// 모달 Positive 버튼 클릭 처리
	function handleModalPositiveClick() {
		if (isPremium.value) {
			// 프로 버전: 기존 생성 번호 보기
			if (showingHistory.value) {
				showLimitModal.value = false;
			} else {
				showLimitModal.value = false;
				loadPickHistory();
			}
		} else {
			// 프리 버전: 프로버전 업그레이드
			// 다이얼로그 닫기
			showLimitModal.value = false;
			// 현재 팝업 닫기
			emit('close');
			// 계정정보 팝업 열기
			openAccountPopup();
		}
	}
	
	// 모달 Negative 버튼 클릭 처리 (프리 버전에서만 표시)
	function handleModalNegativeClick() {
		if (showingHistory.value) {
			showLimitModal.value = false;
		} else {
			showLimitModal.value = false;
			loadPickHistory();
		}
	}
	
	// 계정 정보 팝업 열기 (프로버전 업그레이드)
	function openAccountPopup() {
		eventStore.emit('popup', {
			id: 'account',
			title: '계정 정보',
			onClose: () => {
				// 팝업 닫힌 후 프리미엄 상태 다시 확인 (웹에서는 이벤트로 처리)
				maxPickCount.value = isPremium.value ? 100 : 2;
				checkRecommendCount();
			}
		});
	}
	
	// pickHistory를 로드하여 화면에 표시
	function loadPickHistory() {
		// 웹 환경에서는 MyPickStore에서 데이터 가져오기
		try {
			const myPicks = myPickStore.getMyPicks(_nextDrw);
			
			if (myPicks && myPicks.length > 0) {
				recommends.value = myPicks.map(item => {
					return {
						numbers: item.numbers,
						isSaved: true
					};
				});
				
				saved.value = Array(recommends.value.length).fill(true);
				allSaved.value = true;
				showingHistory.value = true;
				currentPickCount.value = myPicks.length;
			}
		} catch (e) {
			console.error('loadPickHistory error:', e);
		}
	}

	function createRecommend(){
		for( let j=0;j<_recommendCnt;j++){
			let _list = [..._newTotalNumbers];
			let _numbers = [];
			for(let i=0;i<_cnt;i++) {
				let _number = getRandomElement(_list);
				_list = _list.filter(item => item !== _number);
				const _numberObj = {
					number:_number,
				}
				_numbers.push(_numberObj);
			}

			// 고정 번호 추가.
			_fixedNumber.forEach(item=>{
				_numbers.push({
					number:item
				})
			})
			_numbers.sort((a, b) => a.number - b.number);

			const _recommend = {
				"numbers":_numbers
			};

			recommends.value.push(_recommend);
			recommendStore.addRecommend(_numbers,_nextDrw);
			
			// 생성된 번호를 바로 pickHistory에 저장
			saveToHistory(_numbers);
		}

		// 저장 상태 초기화 (모두 미저장)
		saved.value = Array(recommends.value.length).fill(false);
	}
	
	// pickHistory에 번호 저장 (생성 시점에 호출)
	function saveToHistory(numbers) {
		// 웹 환경에서는 MyPickStore에 저장
		try {
			const nums = numbers.map(n => Number(n.number)).sort((a,b)=>a-b);
			if(nums.length !== 6) return;
			
			const numbersForStore = nums.map(n => ({ number: n }));
			myPickStore.addMyPick(numbersForStore, _nextDrw);
			
			console.log('pickHistory에 번호 저장 saveToHistory:', nums);
		} catch (e) {
			console.error('saveToHistory error:', e);
		}
	}

	

	// 번호 그룹 계산 함수
	function getGroup(n) {
		return Math.floor((n - 1) / 10) + 1;
	}

	function getRandomElement(array) {
		if (!Array.isArray(array) || array.length === 0) {
			throw new Error("유효한 배열을 입력해주세요.");
		}

		// 배열의 인덱스를 랜덤으로 선택
		const randomIndex = Math.floor(Math.random() * array.length);

		// 선택된 인덱스의 요소 반환
		return array[randomIndex];
	}

	function saveMyPick(rec, idx){
        try {
			const nums = rec.numbers.map(n => Number(n.number)).sort((a,b)=>a-b)
            if(nums.length !== 6) return
            
			// 로컬 myPickStore에 저장 (정렬된 번호 객체 배열로 저장)
			const numbersForStore = nums.map(n => ({ number: n }))
			myPickStore.addMyPick(numbersForStore, _nextDrw)
			
			// 저장 완료 처리
			saved.value[idx] = true;
			if (recommends.value[idx]) {
				recommends.value[idx].isSaved = true;
			}
			
			// 모두 저장되었는지 체크하여 전체 버튼 상태 갱신
			allSaved.value = saved.value.every(v => v);
        } catch (e) {
            console.error('saveMyPick error', e)
        }
    }

	function saveAll(){
		// 각 추천 항목 저장 시도 및 상태 반영
		recommends.value.forEach((rec, i) => {
			if (!saved.value[i]) {
				saveMyPick(rec, i);
			}
		});
		allSaved.value = true;
	}

	// 프로 상태 변경 이벤트 리스너
	const handlePremiumStatusChange = (event) => {
		if (event.detail && typeof event.detail.isPremium === 'boolean') {
			isPremium.value = event.detail.isPremium;
			maxPickCount.value = isPremium.value ? 100 : 2;
		}
	}

    onMounted(() => {
		//console.log("###### 번호 뽑기 onMounted" );
		
		// 프로 상태 이벤트 리스너 등록
		window.addEventListener('lottovue:premium', handlePremiumStatusChange);
		
		// 초기 프로 상태는 이벤트로 처리 (웹 환경)
		maxPickCount.value = isPremium.value ? 100 : 2;
		
		checkRecommendCount();
		// 생성 가능한 번호 조합이 0개인 경우 알럿 표시 후 팝업 닫기
		if (_recommendCnt > 0) {
			createRecommend();
		}
	});
	
	onUnmounted(() => {
		// 이벤트 리스너 제거
		window.removeEventListener('lottovue:premium', handlePremiumStatusChange);
	});
</script>

<style scoped>
.history-notice {
	background-color: #f0f8ff;
	border: 2px solid #4a90e2;
	border-radius: 8px;
	padding: 12px 16px;
	margin: 0 20px 16px 20px;
	text-align: center;
}

.history-notice p {
	margin: 0;
	color: #2c5aa0;
	font-weight: 600;
	font-size: 14px;
}
</style>
