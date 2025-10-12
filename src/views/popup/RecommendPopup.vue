<template>
	<div>
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
			:positive-text="'확인'"
			:closable="false"
			@positive-click="handleModalClose"
		>
			<p style="line-height: 1.6;">
				<strong>{{ _nextDrw }}회차</strong>는 이미 최대 <strong>2개</strong>의 번호 조합이 저장되어 있습니다.<br>
				더 이상 번호를 생성할 수 없습니다.
			</p>
		</n-modal>
	</div>
</template>

<script setup>
	import { onMounted, ref } from "vue";
	import { NModal } from "naive-ui";
	import { useCalculateStore } from "@/stores/CalculateStore";
	import { useExceptionStore } from "@/stores/ExceptionStore";
	import { useFixedStore } from "@/stores/FixedStore";
	import { useRecommendStore } from "@/stores/RecommendStore";
	import { useMyPickStore } from "@/stores/MyPickStore";
	import { useDrwStore } from "@/stores/DrwStore";

	// emit 정의
	const emit = defineEmits(['close']);

	// 한도 초과 모달 표시 상태
	const showLimitModal = ref(false);

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
		if (window.AndroidBridge && typeof window.AndroidBridge.getRecommendCount === 'function') {
			try {
				// 현재 회차번호를 전달하여 해당 회차의 생성 개수 조회
				// getRecommendCount는 이미 저장된 picks를 고려하여 생성 가능한 개수를 반환
				_recommendCnt = window.AndroidBridge.getRecommendCount(_nextDrw);
				
				// 오래된 회차 설정값 정리 (선택사항)
				if (typeof window.AndroidBridge.clearOldRecommendCounts === 'function') {
					window.AndroidBridge.clearOldRecommendCounts(_nextDrw);
				}
			} catch (e) {
				console.error('getRecommendCount error:', e);
				_recommendCnt = 0; // 오류 시 기본값
			}
		}

		// 생성 가능한 번호 조합이 0개인 경우 모달 표시
		if (_recommendCnt === 0) {
			showLimitModal.value = true;
		}
	}

	// 모달 닫기 및 팝업 닫기
	function handleModalClose() {
		showLimitModal.value = false;
		emit('close');
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
		}

		// 저장 상태 초기화 (모두 미저장)
		saved.value = Array(recommends.value.length).fill(false);
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
            const payload = {
                drwNo: _nextDrw,
                no1: nums[0],
                no2: nums[1],
                no3: nums[2],
                no4: nums[3],
                no5: nums[4],
                no6: nums[5],
            }
            if (window.AndroidBridge && typeof window.AndroidBridge.savePick === 'function') {
                const ok = window.AndroidBridge.savePick(JSON.stringify(payload))
                // console.log('savePick result:', ok)
            }
			// 로컬 myPickStore에도 저장 (정렬된 번호 객체 배열로 저장)
			const numbersForStore = nums.map(n => ({ number: n }))
			myPickStore.addMyPick(numbersForStore, _nextDrw)
			// 저장 완료 처리 (브리지 유무와 상관없이 UI 상태 갱신)
			saved.value[idx] = true;
			// 모두 저장되었는지 체크하여 전체 버튼 상태 갱신
			allSaved.value = saved.value.every(v => v);
        } catch (e) {
            // console.error('saveMyPick error', e)
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

    onMounted(() => {
		//console.log("###### 번호 뽑기 onMounted" );
		checkRecommendCount();
		// 생성 가능한 번호 조합이 0개인 경우 알럿 표시 후 팝업 닫기
		if (_recommendCnt > 0) {
			createRecommend();
		}
	});
</script>
