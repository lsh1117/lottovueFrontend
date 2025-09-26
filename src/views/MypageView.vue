<template>
	<div class="MypageView">
		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">내정보</h4>
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
					<button class="btn-primary btn-small"  @click="openFixedRecommendPopup">추천 고정번호</button>
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
					<button class="btn-primary btn-small" @click="openExceptionRecommendPopup">추천 제외번호</button>
				</div>
			</div>
		</section>
		<section class="section section-area fixed-bottom">
			<div class="btn-area btn-area-center">
				<button class="btn-primary btn-large" @click="openRecommendPopup" >번호뽑기</button>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { useEventStore } from '@/stores/EventStore';
	import { useExceptionStore } from "@/stores/ExceptionStore";
	import { useFixedStore } from "@/stores/FixedStore";
	import { useRecommendStore } from "@/stores/RecommendStore";
	import { useCalculateStore } from "@/stores/CalculateStore";
	import { useDrwStore } from "@/stores/DrwStore";

	const eventStore = useEventStore();
	const exceptionStore = useExceptionStore();
	const fixedStore = useFixedStore();
	const recommendStore = useRecommendStore();
	const calculateStore = useCalculateStore();
	// Pinia store 가져오기
	const drwStore = useDrwStore();
	
	// 제외 번호
	let exceptionNumbers = ref([]);
	
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
		exceptionNumbers.value = [...exceptionStore.numbers];
		//console.log("제외번호 확인 핸들러 :",e);
	}

	// 제외번호 닫기 핸들러.
	function onExceptionPopupClose(e){
		//console.log("제외번호 닫기 핸들러 :",e);
	}

	// 추천 제외번호 팝업 호출
	function openExceptionRecommendPopup() {
		//console.log("추천 제외번호 보기");
		eventStore.emit('popup',{
			id:"exceptionRecommend",
			title:"추천 제외번호 보기",
			onClose:onExceptionRecommendPopupClose,
		});
	}

	// 추천 제외번호 닫기 핸들러.
	function onExceptionRecommendPopupClose(e){
		//console.log("추천 제외번호 닫기 핸들러 :",e);
	}

	// 고정번호
	let fixedNumbers = ref([]);
	
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
		fixedNumbers.value = [...fixedStore.numbers];
		//console.log("고정번호 확인 핸들러 :",e);
	}

	// 고정번호 닫기 핸들러.
	function onFixedPopupClose(e){
		//console.log("고정번호 닫기 핸들러 :",e);
	}

	// 추천 고정번호 팝업 호출
	function openFixedRecommendPopup() {
		//console.log("추천 고정번호 보기");
		eventStore.emit('popup',{
			id:"fixedRecommend",
			title:"추천 고정번호 보기",
			onClose:onFixedRecommendPopupClose,
		});
	}

	// 추천 고정번호 닫기 핸들러.
	function onFixedRecommendPopupClose(e){
		//console.log("추천 고정번호 닫기 핸들러 :",e);
	}

	function getGroup(n) {
		// (n - 1)을 10으로 나눈 몫에 1을 더함
		return Math.floor((n - 1) / 10) + 1;
	}

	// 번호뽑기 팝업 호출
	function openRecommendPopup() {
		//console.log("번호뽑기 팝업 호출");

		if(calculateStore.getState() === false) {
			calculate();
		}
		eventStore.emit('popup',{
			id:"recommend",
			title:"번호 뽑기",
		});
	}

	function calculate(){
		calculateStore.setState(true);
		// 전체 번호
		let calculateNumbers = [];

		// 등장 횟수
		let appearNumber = drwStore.getTotalAppear(drwStore.getNumbers());
		appearNumber.sort((a, b) => b.count - a.count);
		appearNumber.forEach((item) => {
			for(let i=0;i<item.count;i++){
				calculateNumbers.push(item.number);
			}
		});

		// 현재까지 연속 미등장 횟수
		let notAppearInSuccession = drwStore.getNotAppearInSuccessionUntil(drwStore.getNumbers());
		notAppearInSuccession.sort((a, b) => b.count - a.count);
		notAppearInSuccession.forEach((item) => {
			for(let i=0;i<item.count;i++){
				calculateNumbers.push(item.number);
			}
		});

		calculateStore.setNumbers(calculateNumbers);

		//console.log("@@@@@",calculateNumbers);
	}

	onMounted(() => {
		exceptionNumbers.value = [...exceptionStore.numbers];
		fixedNumbers.value = [...fixedStore.numbers];
	});
</script>
