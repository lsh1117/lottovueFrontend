<template>
	<div class="ContactView">
		<!-- 광고 영역 (Free Plan만 표시) 
		<section v-if="isFreePlan" class="section section-area adsense-section">
			<AdSense 
				ad-slot="4556458490"
				ad-format="auto"
				container-class="contact-adsense"
			/>
		</section>
		-->
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
				<button class="btn-primary btn-large" @click="openMyNumberPopup" >내번호보기</button>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { computed, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { useEventStore } from '@/stores/EventStore';
	import { useExceptionStore } from "@/stores/ExceptionStore";
	import { useFixedStore } from "@/stores/FixedStore";
	import { useRecommendStore } from "@/stores/RecommendStore";
	import { useCalculateStore } from "@/stores/CalculateStore";
	import { useDrwStore } from "@/stores/DrwStore";
	import { isAuthenticated, getUser } from '@/utils/auth';
	import AdSense from "@/components/cmm/AdSense.vue";

	const router = useRouter();

	const eventStore = useEventStore();
	const exceptionStore = useExceptionStore();
	const fixedStore = useFixedStore();
	const recommendStore = useRecommendStore();
	const calculateStore = useCalculateStore();
	// Pinia store 가져오기
	const drwStore = useDrwStore();
	
	// Free Plan 여부 확인 (Pro, Max 플랜은 광고 미표시)
	const isFreePlan = computed(() => {
		const user = getUser();
		return !user || !user.plan || user.plan === 'free';
	});
	
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
