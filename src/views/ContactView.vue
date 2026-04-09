<template>
	<div class="ContactView">
		<div v-if="isGeneratingAI" class="ai-loading-overlay">
			<n-spin size="large"></n-spin>
		</div>

		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">고정번호</h4>
			</div>
			<div class="section-body">
				<div class="box-area">
					<div class="box box-round-bg">
						<div class="ball-area">
							<ul class="ball-list">
								<li class="ball-item" v-for="number in fixedNumbers" :key="number">
									<span class="ball-645" :class="'ball-'+getGroup(number)">{{ number }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="section-footer">
				<div class="btn-area btn-area-center">
					<button class="btn-primary btn-small"  @click="openFixedPopup">변경</button>
					<button class="btn-primary btn-small"  @click="openFixedRecommendPopup">분석 고정번호</button>
				</div>
			</div>
		</section>

		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">제외번호</h4>
			</div>
			<div class="section-body">
				<div class="box-area">
					<div class="box box-round-bg">
						<div class="ball-area">
							<ul class="ball-list">
								<li class="ball-item" v-for="number in exceptionNumbers" :key="number">
									<span class="ball-645" :class="'ball-'+getGroup(number)">{{ number }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="section-footer">
				<div class="btn-area btn-area-center">
					<button class="btn-primary btn-small" @click="openExceptionPopup">변경</button>
					<button class="btn-primary btn-small" @click="openExceptionRecommendPopup">분석 제외번호</button>
				</div>
			</div>
		</section>
		<section class="section section-area fixed-bottom">
			<div class="btn-area btn-area-center">
				<button class="btn-primary btn-large" @click="openRecommendPopup" >번호 생성</button>
				<button class="btn-primary btn-large" @click="openAIRecommendPopup" >AI번호생성</button>
				<button class="btn-primary btn-large" @click="openMyNumberPopup" >내번호보기</button>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { computed, h, onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { NInputNumber, NSpin, useDialog, useMessage } from 'naive-ui';
	import { useEventStore } from '@/stores/EventStore';
	import { useExceptionStore } from "@/stores/ExceptionStore";
	import { useFixedStore } from "@/stores/FixedStore";
	import { useRecommendStore } from "@/stores/RecommendStore";
	import { useMyPickStore } from "@/stores/MyPickStore";
	import { useCalculateStore } from "@/stores/CalculateStore";
	import { useDrwStore } from "@/stores/DrwStore";
	import { isAuthenticated, setUser } from '@/utils/auth';
	import { getAIRecommendationNumbers } from '@/api/lotto';
	import { createUserRecommendation } from '@/api/recommendation';
	import http from '@/api/base';

	const router = useRouter();
	const dialog = useDialog();
	const message = useMessage();
	const isGeneratingAI = ref(false);
	const aiDialogCount = ref(1);
	const aiDialogResults = ref([]);
	const aiDialogError = ref('');
	const aiDialogGenerating = ref(false);

	const eventStore = useEventStore();
	const exceptionStore = useExceptionStore();
	const fixedStore = useFixedStore();
	const recommendStore = useRecommendStore();
	const myPickStore = useMyPickStore();
	const calculateStore = useCalculateStore();
	// Pinia store 가져오기
	const drwStore = useDrwStore();
	
	// 제외 번호 - computed로 변경하여 자동 반영
	const exceptionNumbers = computed(() => exceptionStore.numbers);
	
	// 제외번호 팝업 호출
	function openExceptionPopup() {
		//console.log("제외번호 변경");
		eventStore.emit('popup',{
			id:"exception",
			title:"제외번호1",
			onConfirm:onExceptionPopupConfirm,
			onClose:onExceptionPopupClose,
		});
	}

	// 제외번호 확인 핸들러.
	function onExceptionPopupConfirm(e){
		// computed로 자동 반영되므로 수동 업데이트 불필요
		//console.log("제외번호 확인 핸들러 :",e);
	}

	// 제외번호 닫기 핸들러.
	function onExceptionPopupClose(e){
		// computed로 자동 반영되므로 수동 업데이트 불필요
		//console.log("제외번호 닫기 핸들러 :",e);
	}

	// 분석 제외번호 팝업 호출
	function openExceptionRecommendPopup() {
		//console.log("분석 제외번호 보기");
		eventStore.emit('popup',{
			id:"exceptionRecommend",
			title:"분석 제외번호 보기",
			onClose:onExceptionRecommendPopupClose,
		});
	}

	// 분석 제외번호 닫기 핸들러.
	function onExceptionRecommendPopupClose(e){
		// computed로 자동 반영되므로 수동 업데이트 불필요
		//console.log("분석 제외번호 닫기 핸들러 :",e);
	}

	// 고정번호 - computed로 변경하여 자동 반영
	const fixedNumbers = computed(() => fixedStore.numbers);
	
	// 고정번호 팝업 호출
	function openFixedPopup() {
		//console.log("고정번호 변경");
		eventStore.emit('popup',{
			id:"fixed",
			title:"고정번호",
			onConfirm:onFixedPopupConfirm,
			onClose:onFixedPopupClose,
		});
	}

	// 고정번호 확인 핸들러.
	function onFixedPopupConfirm(e){
		// computed로 자동 반영되므로 수동 업데이트 불필요
		//console.log("고정번호 확인 핸들러 :",e);
	}

	// 고정번호 닫기 핸들러.
	function onFixedPopupClose(e){
		// computed로 자동 반영되므로 수동 업데이트 불필요
		//console.log("고정번호 닫기 핸들러 :",e);
	}

	// 분석 고정번호 팝업 호출
	function openFixedRecommendPopup() {
		//console.log("분석 고정번호 보기");
		eventStore.emit('popup',{
			id:"fixedRecommend",
			title:"분석 고정번호 보기",
			onClose:onFixedRecommendPopupClose,
		});
	}

	// 분석 고정번호 닫기 핸들러.
	function onFixedRecommendPopupClose(e){
		//console.log("분석 고정번호 닫기 핸들러 :",e);
	}

	function getGroup(n) {
		// (n - 1)을 10으로 나눈 몫에 1을 더함
		return Math.floor((n - 1) / 10) + 1;
	}

	function getNextDrwNo() {
		const numbers = drwStore.getNumbers();
		if (numbers && numbers.length > 0 && numbers[0]?.drwNo) {
			return Number(numbers[0].drwNo) + 1;
		}
		return 1;
	}

	// AI 분석 팝업 호출
	function openRecommendPopup() {
		//console.log("AI 분석 팝업 호출");

		if (!isAuthenticated()) {
			alert('번호 생성 기능은 로그인 후 이용 가능합니다.\n계정 정보에서 로그인해주세요.');
			return;
		}

		if(calculateStore.getState() === false) {
			calculate();
		}
		eventStore.emit('popup',{
			id:"recommend",
			title:"번호 생성",
		});
	}

	async function openAIRecommendPopup() {
		if (!isAuthenticated()) {
			dialog.warning({
				title: '로그인 필요',
				content: 'AI번호생성 기능은 로그인 후 이용 가능합니다. 계정 정보에서 로그인해주세요.',
				positiveText: '확인'
			});
			return;
		}
		aiDialogCount.value = 1;
		aiDialogResults.value = [];
		aiDialogError.value = '';
		aiDialogGenerating.value = false;

		const dialogReactive = dialog.create({
			title: 'AI번호생성',
			class: 'ai-create-dialog',
			content: () =>
				h('div', { 
					class: 'content-area'
					}, [
					h('div', { 
					 	class: 'input-area'
					}, [
						h('span', { style: 'font-size:14px;' }, '생성 개수'),
						h(NInputNumber, {
							value: aiDialogCount.value,
							min: 1,
							max: 10,
							step: 1,
							size: 'small',
							style: 'width:120px;',
							'onUpdate:value': (v) => {
								aiDialogCount.value = v ?? 1;
							},
						}),
						h('span', { style: 'font-size:12px;opacity:0.8;' }, '(최대 10개)'),
					]),
					h(
						'button',
						{
							class: 'btn-primary btn-small',
							style: 'width:110px;',
							disabled: aiDialogGenerating.value,
							onClick: async () => {
								await generateAINumbersInDialog();
							},
						},
						aiDialogGenerating.value ? '생성 중...' : '생성하기',
					),
					aiDialogError.value
						? h('div', { style: 'color:#ef4444;font-size:13px;white-space:pre-wrap;' }, aiDialogError.value)
						: null,
					aiDialogResults.value.length > 0
						? h(
								'div',
								{
									style:
										'font-size:13px;line-height:1.6;max-height:260px;overflow:auto;border:1px solid #334155;padding:8px;border-radius:6px;',
								},
								aiDialogResults.value.map((set, idx) =>
									h('div', { style: 'margin-bottom:10px;' }, [
										h(
											'ul',
											{ class: 'ball-list' },
											set.numbers.map((number) =>
												h('li', { class: 'ball-item' }, [
													h(
														'span',
														{ class: ['ball-645', `ball-${getGroup(number)}`] },
														String(number),
													),
												]),
											),
										),
									]),
								),
						  )
						: null,
				]),
			onPositiveClick: () => {
				dialogReactive.destroy();
			},
			onNegativeClick: () => {
				dialogReactive.destroy();
			},
		});
	}

	async function generateAINumbersInDialog() {
		const generateCount = Math.max(1, Math.min(10, Number(aiDialogCount.value) || 1));
		aiDialogCount.value = generateCount;
		aiDialogError.value = '';
		aiDialogGenerating.value = true;
		isGeneratingAI.value = true;
		try {
			const updatedUser = await http.post(`/users/me/deduct-credits?amount=${generateCount}`);
			if (updatedUser) {
				setUser(updatedUser);
				window.dispatchEvent(new CustomEvent('lottovue:userUpdated'));
			}

			const generatedSets = [];
			for (let i = 0; i < generateCount; i++) {
				const aiResult = await getAIRecommendationNumbers(100);
				const numbers = (aiResult?.numbers || []).map((n) => Number(n)).sort((a, b) => a - b);
				if (numbers.length !== 6) {
					throw new Error('AI 추천번호 생성 결과가 올바르지 않습니다.');
				}

				const numberObjs = numbers.map((n) => ({ number: n }));
				const drwNo = Number(aiResult?.drw_no || getNextDrwNo());

				recommendStore.addRecommend(numberObjs, drwNo);
				myPickStore.addMyPick(numberObjs, drwNo);
				await createUserRecommendation({
					drw_no: drwNo,
					no1: numbers[0],
					no2: numbers[1],
					no3: numbers[2],
					no4: numbers[3],
					no5: numbers[4],
					no6: numbers[5],
				});

				generatedSets.push({ drwNo, numbers });
			}

			aiDialogResults.value = generatedSets;
		} catch (error) {
			console.error('AI번호생성 실패:', error);
			aiDialogError.value = error.response?.data?.detail || error.message || 'AI번호 생성 중 오류가 발생했습니다.';
		} finally {
			aiDialogGenerating.value = false;
			isGeneratingAI.value = false;
		}
	}

	// 내번호 보기 화면으로 이동
	function openMyNumberPopup() {
		//console.log("내번호 보기 화면으로 이동");
		if (!isAuthenticated()) {
			alert('내 당첨번호 확인 기능은 로그인 후 이용 가능합니다.\n계정 정보에서 로그인해주세요.');
			return;
		}
		router.push('/my-winning-number');
	}

	function calculate(){
		calculateStore.setState(true);
		// 전체 번호
		let calculateNumbers = [];

		// 등장 횟수
		let appearNumber = drwStore.getTotalAppear(drwStore.numbers);
		appearNumber.sort((a, b) => b.count - a.count);
		const appearCnt = appearNumber[0].count;
		appearNumber.forEach((item) => {
			const _cnt = appearCnt - item.count;
			for(let i=0;i<_cnt;i++){
				calculateNumbers.push(item.number);
			}
		});

		// 현재까지 연속 미등장 횟수
		let notAppearInSuccessionUntil = drwStore.getNotAppearInSuccessionUntil(drwStore.numbers);
		notAppearInSuccessionUntil.sort((a, b) => b.count - a.count);
		notAppearInSuccessionUntil.forEach((item) => {
			for(let i=0;i<item.count;i++){
				calculateNumbers.push(item.number);
			}
		});

		// 현재까지 구간별 연속 미등장 횟수
		let GroupnotAppearInSuccessionUntil = drwStore.getGroupNotAppearInSuccessionUntil(drwStore.numbers);
		GroupnotAppearInSuccessionUntil.sort((a, b) => b.count - a.count);
		GroupnotAppearInSuccessionUntil.forEach((item) => {
			if(item.count > 0){
				// 가중치
				const _marginRate = item.count * 10;
				const _cnt = (item.number<5)?10:5;
				// 구간번호
				for( let j=0;j<_cnt;j++){
					const _number = ( (item.number - 1) * 10 ) +(j+1);
					// 가중치 만큼 추가.
					for(let i=0;i<_marginRate;i++){
						calculateNumbers.push(_number);
					}
				}
			}
		});

		// 최근 100회 등장 횟수/
		/*
		let _lastNumbers = drwStore.getTotalAppear( drwStore.numbers.slice(0,100) );
		_lastNumbers.sort((a, b) => b.count - a.count);
		const lastCnt = _lastNumbers[0].count;
		_lastNumbers.forEach((item) => {
			const _cnt = lastCnt - item.count;
			for(let i=0;i<_cnt;i++){
				calculateNumbers.push(item.number);
			}
		});
		*/

		calculateStore.setNumbers(calculateNumbers);
	}

	// 로그인 체크 제거 - 비로그인 사용자도 번호 생성 화면 이용 가능
	onMounted(() => {
		// 로그인 체크 제거됨
	});
</script>

<style scoped>
.ai-loading-overlay {
	position: fixed;
	inset: 0;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.45);
	backdrop-filter: blur(2px);
}
</style>
