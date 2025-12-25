<template>
	<div>
		<!-- 히스토리 표시 안내 메시지 -->
		<div v-if="showingHistory" class="history-notice">
			<p>{{ _nextDrw }}회차에 저장된 생성 번호 목록 (총 {{ currentPickCount }}개)</p>
		</div>
		
		<!-- 번호 개수 선택 영역 (히스토리 모드가 아닐 때만 표시) -->
		<div v-if="!showingHistory && recommends.length === 0" class="pick-count-selector">
			<div class="selector-header">
				<h5>생성 번호 개수 선택</h5>
				<p class="credits-info">잔여 크레딧: <strong>{{ userCredits ?? 0 }}</strong>개</p>
			</div>
			<div class="selector-body">
				<div class="count-input-wrapper">
					<label for="pickCount">뽑을 개수:</label>
					<input 
						id="pickCount"
						type="number" 
						v-model.number="selectedCount" 
						:min="1" 
						:max="maxSelectableCount"
						class="count-input"
						@input="validateCount"
					/>
					<span class="count-hint">최대 {{ maxSelectableCount }}개까지 선택 가능</span>
				</div>
				<div class="cost-info">
					<p>사용 크레딧: <strong>{{ selectedCount }}</strong>개</p>
					<p v-if="selectedCount > userCredits" class="error-text">크레딧이 부족합니다!</p>
				</div>
			</div>
			<div class="selector-footer">
				<button 
					class="btn-primary btn-large" 
					@click="handleGenerateRecommend"
					:disabled="selectedCount <= 0 || selectedCount > maxSelectableCount || selectedCount > userCredits"
				>
					생성 번호 생성
				</button>
			</div>
		</div>
		
        <div class="scroll-area" v-if="recommends.length > 0">
            <article class="article-area" v-for="(recommend, idx) in recommends" :key="idx">
				<div class="ball-area">
					<ul class="ball-list">
						<li class="ball-item" v-for="item in recommend.numbers" :key="item">
							<span class="ball-645 ball-645-medium" :class="'ball-' + getGroup(item.number)">{{item.number}}</span>
						</li>
					</ul>
				</div>
			</article>
		</div>
		
		<div class="btn-area btn-area-center" v-if="recommends.length > 0">
			<button class="btn-primary btn-small" @click="$emit('close')">닫기</button>
		</div>

		<!-- Naive UI Modal: 저장 한도 초과 알림 -->
		<n-modal
			v-model:show="showLimitModal"
			preset="dialog"
			title="번호 저장 제한"
			:positive-text="isPremium ? (showingHistory ? '닫기' : '기존 저장 번호 보기') : '프로버전 업그레이드'"
			:negative-text="isPremium ? null : (showingHistory ? '닫기' : '기존 저장 번호 보기')"
			:closable="false"
			@positive-click="handleModalPositiveClick"
			@negative-click="handleModalNegativeClick"
		>
			<div style="line-height: 1.8;">
				<!-- 프리 버전 메시지 -->
				<template v-if="!isPremium">
					<p>
						무료 버전에서는 <strong>회차별 최대 {{ planMaxCount }}개</strong>의 생성 번호만 저장할 수 있습니다.<br>
						더 많은 번호를 저장하려면 <strong>프로버전으로 업그레이드</strong>가 필요합니다.
					</p>
				</template>
				<!-- 프로 버전 메시지 -->
				<template v-else>
					<p>
						프로 버전에서는 <strong>회차별 최대 {{ planMaxCount }}개</strong>까지 생성 번호를 저장할 수 있습니다.<br>
						현재 <strong>{{ _nextDrw }}회차</strong>는 이미 최대 개수인 <strong>{{ currentPickCount }}개</strong>에 도달했습니다.
					</p>
				</template>
			</div>
		</n-modal>
	</div>
</template>

<script setup>
	import { onMounted, onUnmounted, ref, computed, watch } from "vue";
	import { NModal } from "naive-ui";
	import { useCalculateStore } from "@/stores/CalculateStore";
	import { useExceptionStore } from "@/stores/ExceptionStore";
	import { useFixedStore } from "@/stores/FixedStore";
	import { useRecommendStore } from "@/stores/RecommendStore";
	import { useMyPickStore } from "@/stores/MyPickStore";
	import { useDrwStore } from "@/stores/DrwStore";
	import { useEventStore } from "@/stores/EventStore";
	import { createUserRecommendation } from "@/api/recommendation";
	import { getUser, setUser } from "@/utils/auth";
	import http from "@/api/base";

	// emit 정의
	const emit = defineEmits(['close']);

	// 한도 초과 모달 표시 상태
	const showLimitModal = ref(false);
	
	// 한도 초과 시 pickHistory 표시 여부
	const showingHistory = ref(false);
	
	// 최대 저장 가능 개수
	const maxPickCount = ref(2);
	
	// 현재 저장된 개수
	const currentPickCount = ref(0);
	
	// 프로 버전 여부 (computed로 변경하여 사용자 정보에서 자동으로 확인)
	const isPremium = computed(() => {
		const user = getUser();
		return user?.plan === 'pro' || user?.plan === 'max';
	});
	
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

	// 다음 회차 번호 (DrwStore의 데이터로 계산)
	const _nextDrw = ref(1); // 기본값 1
	
	// DrwStore에서 최신 회차 정보를 가져와서 다음 회차 계산
	const updateNextDrw = () => {
		const numbers = drwStore.getNumbers();
		if (!numbers || numbers.length === 0) {
			console.warn('DrwStore에 회차 정보가 없습니다. 기본값 1을 사용합니다.');
			_nextDrw.value = 1;
			return;
		}
		
		// 최신 회차 찾기 (내림차순 정렬)
		const sortedNumbers = [...numbers].sort((a, b) => Number(b.drwNo) - Number(a.drwNo));
		const latestDrw = sortedNumbers[0];
		
		if (!latestDrw || !latestDrw.drwNo) {
			console.warn('최신 회차 정보를 찾을 수 없습니다. 기본값 1을 사용합니다.');
			_nextDrw.value = 1;
			return;
		}
		
		const latestDrwNo = Number(latestDrw.drwNo);
		_nextDrw.value = latestDrwNo + 1;
		//console.log('DrwStore에서 다음 회차 계산:', { latestDrwNo, nextDrw: _nextDrw.value });
	};
	
	// 컴포넌트 마운트 시 최신 회차 정보 계산
	onMounted(() => {
		updateNextDrw();
	});
	
	// DrwStore가 변경될 때마다 다음 회차 재계산 (watch 사용)
	watch(() => drwStore.getNumbers(), () => {
		updateNextDrw();
	}, { deep: true });

	// AI 추천시 제외할 번호. ( 제외번호+고정번호 )
	const _exc = computed(() => {
		return _exceptionNumber.concat(_fixedNumber);
	});

	// 계산에 필요한 모든 숫자 (computed로 변경하여 실시간 계산)
	const _totalNumbers = computed(() => {
		return [...calculateStore.getNumbers()];
	});

	// AI 추천시 제외할 번호 제외 한 전체 번호 (computed로 변경)
	const _newTotalNumbers = computed(() => {
		return _totalNumbers.value.filter(item => !_exc.value.includes(item));
	});

	// 고정번호를 제외한 나머지 번호 갯수
	const _cnt = computed(() => {
		return 6 - _fixedNumber.length;
	});

	// 생성 번호 리스트
	const recommends = ref([]);
	// 각 항목 저장 상태
	const saved = ref([]);
	// 전체 저장 상태
	const allSaved = ref(false);

	// 사용자 크레딧 가져오기
	const userCredits = computed(() => {
		const user = getUser();
		return user?.credits ?? 0;
	});

	// 선택한 번호 개수
	const selectedCount = ref(1);

	// Plan별 최대 선택 가능한 개수
	const planMaxCount = computed(() => {
		const user = getUser();
		if (!user || !user.plan) {
			return 2; // 기본값: free Plan
		}
		// Plan별 최대 개수 설정
		switch (user.plan) {
			case 'free':
				return 2;
			case 'pro':
				return 100;
			case 'max':
				return 1000; // max Plan도 100개 (필요시 변경 가능)
			default:
				return 2;
		}
	});

	// 최대 선택 가능한 개수 (크레딧과 Plan 제한 중 작은 값)
	const maxSelectableCount = computed(() => {
		const planMax = planMaxCount.value;
		const creditsMax = userCredits.value;
		return Math.min(planMax, creditsMax);
	});

	// 생성 번호 갯수 정의
	let _recommendCnt = 0;

	function checkRecommendCount(){
		// 기본값 설정 (웹 환경) - Plan별 최대 개수 사용
		_recommendCnt = planMaxCount.value;
		maxPickCount.value = planMaxCount.value;
		currentPickCount.value = 0; // 웹에서는 0으로 설정

		// 저장 가능한 번호 조합이 0개인 경우 모달 표시
		if (_recommendCnt === 0) {
			showLimitModal.value = true;
		}
	}

	// 개수 유효성 검사
	function validateCount() {
		if (selectedCount.value < 1) {
			selectedCount.value = 1;
		}
		if (selectedCount.value > maxSelectableCount.value) {
			selectedCount.value = maxSelectableCount.value;
		}
		if (selectedCount.value > userCredits.value) {
			selectedCount.value = userCredits.value;
		}
	}

	// 생성 번호 생성 처리
	async function handleGenerateRecommend() {
		if (selectedCount.value <= 0) {
			alert('1개 이상 선택해주세요.');
			return;
		}
		
		if (selectedCount.value > userCredits.value) {
			alert(`크레딧이 부족합니다. (잔여: ${userCredits.value}개, 필요: ${selectedCount.value}개)`);
			return;
		}

		if (selectedCount.value > maxSelectableCount.value) {
			alert(`최대 ${maxSelectableCount.value}개까지 선택 가능합니다.`);
			return;
		}

		try {
			// 크레딧 차감 API 호출
			const updatedUser = await http.post(`/users/me/deduct-credits?amount=${selectedCount.value}`);
			
			// 사용자 정보 업데이트
			if (updatedUser) {
				setUser(updatedUser);
				// 사용자 정보 업데이트 이벤트 발생
				window.dispatchEvent(new CustomEvent('lottovue:userUpdated'));
			}

			// 생성 번호 생성
			_recommendCnt = selectedCount.value;
			await createRecommend();
		} catch (error) {
			console.error('크레딧 차감 실패:', error);
			alert(error.response?.data?.detail || '크레딧 차감 중 오류가 발생했습니다.');
		}
	}

	// 모달 Positive 버튼 클릭 처리
	function handleModalPositiveClick() {
		if (isPremium.value) {
			// 프로 버전: 기존 저장 번호 보기
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
				// 팝업 닫힌 후 Plan 상태 다시 확인 (computed로 자동 업데이트됨)
				checkRecommendCount();
			}
		});
	}
	
	// pickHistory를 로드하여 화면에 표시
	function loadPickHistory() {
		// 웹 환경에서는 MyPickStore에서 데이터 가져오기
		try {
			const myPicks = myPickStore.getMyPicks(_nextDrw.value);
			
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

	async function createRecommend(){
		// 사용 가능한 번호가 충분한지 확인
		if (_newTotalNumbers.value.length < _cnt.value) {
			alert(`생성 번호를 생성할 수 없습니다.\n제외할 번호가 너무 많거나 사용 가능한 번호가 부족합니다.\n(필요: ${_cnt.value}개, 사용 가능: ${_newTotalNumbers.value.length}개)`);
			return;
		}

		for( let j=0;j<_recommendCnt;j++){
			let _list = [..._newTotalNumbers.value];
			let _numbers = [];
			
			// 고정번호를 제외한 나머지 번호 선택
			for(let i=0;i<_cnt.value;i++) {
				if (_list.length === 0) {
					console.error('사용 가능한 번호가 부족합니다.');
					break;
				}
				let _number = getRandomElement(_list);
				_list = _list.filter(item => item !== _number);
				const _numberObj = {
					number:_number,
				}
				_numbers.push(_numberObj);
			}
			
			// 필요한 번호가 모두 선택되지 않은 경우 건너뛰기
			if (_numbers.length < _cnt.value) {
				console.warn(`생성 번호 생성 실패: 필요한 번호 ${_cnt.value}개, 선택된 번호 ${_numbers.length}개`);
				continue;
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
			recommendStore.addRecommend(_numbers, _nextDrw.value);
			
			// AI 추천된 번호를 바로 pickHistory와 백엔드에 저장
			await saveToHistory(_numbers);
		}

		// 저장 상태 초기화 (모두 미저장)
		saved.value = Array(recommends.value.length).fill(false);
	}
	
	// pickHistory에 번호 저장 (생성 시점에 호출)
	async function saveToHistory(numbers) {
		// 웹 환경에서는 MyPickStore에 저장
		try {
			const nums = numbers.map(n => Number(n.number)).sort((a,b)=>a-b);
			if(nums.length !== 6) return;
			
			const numbersForStore = nums.map(n => ({ number: n }));
			myPickStore.addMyPick(numbersForStore, _nextDrw.value);
			
			//console.log('pickHistory에 번호 저장 saveToHistory:', nums);
			
			// 백엔드 API에 저장
			try {
				const recommendationData = {
					drw_no: _nextDrw.value,
					no1: nums[0],
					no2: nums[1],
					no3: nums[2],
					no4: nums[3],
					no5: nums[4],
					no6: nums[5]
				};
				
				await createUserRecommendation(recommendationData);
				//console.log('백엔드에 추천번호 저장 완료:', recommendationData);
			} catch (apiError) {
				// 백엔드 저장 실패는 로그만 남기고 계속 진행
				// (네트워크 오류 등 - 로컬 저장은 정상적으로 완료됨)
				console.warn('백엔드에 추천번호 저장 실패 (무시):', apiError.response?.data?.detail || apiError.message);
			}
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

	async function saveMyPick(rec, idx){
        try {
			const nums = rec.numbers.map(n => Number(n.number)).sort((a,b)=>a-b)
            if(nums.length !== 6) return
            
			// 로컬 myPickStore에 저장 (정렬된 번호 객체 배열로 저장)
			const numbersForStore = nums.map(n => ({ number: n }))
			myPickStore.addMyPick(numbersForStore, _nextDrw.value)
			
			// 백엔드 API에 저장
			try {
				const recommendationData = {
					drw_no: _nextDrw.value,
					no1: nums[0],
					no2: nums[1],
					no3: nums[2],
					no4: nums[3],
					no5: nums[4],
					no6: nums[5]
				};
				
				await createUserRecommendation(recommendationData);
				//console.log('백엔드에 추천번호 저장 완료 (수동):', recommendationData);
			} catch (apiError) {
				// 백엔드 저장 실패는 로그만 남기고 계속 진행
				// (네트워크 오류 등 - 로컬 저장은 정상적으로 완료됨)
				console.warn('백엔드에 추천번호 저장 실패 (무시):', apiError.response?.data?.detail || apiError.message);
			}
			
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

	// 프로 상태 변경 이벤트 리스너 (computed로 변경되어 자동 업데이트되므로 필요시에만 사용)
	const handlePremiumStatusChange = (event) => {
		// isPremium이 computed로 변경되어 사용자 정보가 업데이트되면 자동으로 반영됨
		// 필요시 추가 로직 구현 가능
		checkRecommendCount();
	}

    onMounted(() => {
		////console.log("###### AI 추천 onMounted" );
		
		// 프로 상태 이벤트 리스너 등록
		window.addEventListener('lottovue:premium', handlePremiumStatusChange);
		
		// 사용자 정보 업데이트 이벤트 리스너 등록
		window.addEventListener('lottovue:userUpdated', () => {
			// 크레딧과 Plan 정보가 업데이트되면 computed로 자동으로 반영됨
			checkRecommendCount();
		});
		
		// 초기 Plan 상태 설정
		maxPickCount.value = planMaxCount.value;
		
		// 초기 선택 개수 설정 (크레딧이 있으면 1개, 없으면 0개)
		selectedCount.value = userCredits.value > 0 ? 1 : 0;
		
		checkRecommendCount();
		// 자동 생성하지 않고 사용자가 선택하도록 변경
		// if (_recommendCnt > 0) {
		// 	createRecommend();
		// }
	});
	
	onUnmounted(() => {
		// 이벤트 리스너 제거
		window.removeEventListener('lottovue:premium', handlePremiumStatusChange);
		window.removeEventListener('lottovue:userUpdated', () => {});
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

.pick-count-selector {
	padding: 20px;
	margin: 0 20px 20px 20px;
	background-color: #f8f9fa;
	border-radius: 12px;
	border: 2px solid #e9ecef;
}

.selector-header {
	margin-bottom: 16px;
	text-align: center;
}

.selector-header h5 {
	margin: 0 0 8px 0;
	font-size: 18px;
	font-weight: 600;
	color: #333;
}

.credits-info {
	margin: 0;
	font-size: 14px;
	color: #666;
}

.credits-info strong {
	color: #007bff;
	font-size: 16px;
}

.selector-body {
	margin-bottom: 20px;
}

.count-input-wrapper {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;
}

.count-input-wrapper label {
	font-weight: 600;
	color: #333;
	font-size: 14px;
}

.count-input {
	width: 100%;
	padding: 10px 12px;
	border: 2px solid #ddd;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 600;
	text-align: center;
}

.count-input:focus {
	outline: none;
	border-color: #007bff;
	box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.count-hint {
	font-size: 12px;
	color: #666;
	text-align: center;
}

.cost-info {
	background-color: white;
	padding: 12px;
	border-radius: 8px;
	border: 1px solid #e9ecef;
	text-align: center;
}

.cost-info p {
	margin: 4px 0;
	font-size: 14px;
	color: #333;
}

.cost-info strong {
	color: #007bff;
	font-size: 16px;
}

.error-text {
	color: #dc3545 !important;
	font-weight: 600;
}

.selector-footer {
	display: flex;
	justify-content: center;
}
</style>
