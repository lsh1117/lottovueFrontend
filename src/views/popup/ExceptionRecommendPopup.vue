<template>
	<div>
		<div class="scroll-area">
			<div class="text-area">
				<p v-for="message in messages" :key="message">
					<span class="text-normal">{{ message }}</span>
				</p>
			</div>
		</div>
		<div class="btn-area btn-area-center">
			<button class="btn-primary btn-small" @click="$emit('close')">닫기</button>
			<button class="btn-primary btn-small" @click="onAllApply">전체적용</button>
		</div>
	</div>
</template>

<script setup>
	import {onMounted,ref} from "vue";
	import {useDrwStore} from '@/stores/DrwStore';
	import { useExceptionStore } from "@/stores/ExceptionStore";

	// Pinia store 가져오기
	const drwStore = useDrwStore();
	const exceptionStore = useExceptionStore();
	const messages = ref([]);
	const exceptionNumbers = ref([]);

	// Emit 이벤트 정의
	const emit = defineEmits(["close"]);

	onMounted(()=>{
		const _message1 = getAppearInSuccessionUntil();
		if(_message1){
			messages.value.push(_message1);
		}

		const _message2 = getLastAppear();
		if(_message2){
			messages.value.push(_message2);
		}
	});
	
	// 연속 등장 횟수 분석
	function getAppearInSuccessionUntil(){
		// 연속 등장 횟수 계산
		const appearInSuccessionUntil = drwStore.getAppearInSuccessionUntil(drwStore.getNumbers());
		appearInSuccessionUntil.sort((a, b) => b.count - a.count);
		// 연속 3회 이상 등장한 한 번호 모음
		let thirdAppears = [];
		appearInSuccessionUntil.forEach((item) => {
			if(item.count > 1){
				thirdAppears.push(item.number);
				exceptionNumbers.value.push(item.number);
			}
		});

		if(thirdAppears.length > 0){
			const _message = thirdAppears.join() + " 번 : 최근 2번 이상 연속으로 나옴.";
			return _message;
		}
		else{
			return null;
		}
	}

	// 최근 100 회 등장 횟수 분석
	function getLastAppear(){
		// 최근 100 회 통계 데이터
		/*
		let _max = {count:0};
		let _min = {count:100};

		for( let i=0;i<100;i++){
			let startIndex = (drwStore.getNumbers().length - 1) - (100+i);
			let endIndex = startIndex + 100;
			let _lastNumbers = drwStore.getNumbers().slice(startIndex,endIndex);

			const _totalAppear = drwStore.getTotalAppear(_lastNumbers);
			_totalAppear.sort((a, b) => b.count - a.count);

			if(Number(_max.count) < Number(_totalAppear[0].count)){
				_max = _totalAppear[0];
			}

			if(Number(_min.count) > Number(_totalAppear[44].count)){
				_min = _totalAppear[44];
			}
		}

		//console.log("#### _max :", _max);
		//console.log("#### _min :", _min);

		const _message = _max.number + " 번 : 최근 100회동안 " + _max.count + "번 나왔음.";
		return _message;
		*/


		/*
		// 최근 100 회 등장 정보
		const _totalAppear = drwStore.getTotalAppear(_lastNumbers);
		if(_totalAppear){
			_totalAppear.sort((a, b) => b.count - a.count);
			//console.log(_totalAppear)
			return "_totalAppear";
		}
		else {
			null;
		}
		*/
		let _max = {count:0};
		let _min = {count:100};
		let _totalAppear = [];
		let _exceptions = [];

		// 최근 100회 동안 가장 많이 나왔던 횟수 25, 가장 적게 나왔던 횟수 5
		// 20번 이상 나온 번호 제외 추천
		let _lastNumbers = drwStore.getNumbers().slice(0,100);

		_totalAppear = drwStore.getTotalAppear(_lastNumbers);
		_totalAppear.sort((a, b) => b.count - a.count);

		_totalAppear.forEach(item=>{
			if(Number(item.count) > 19){
				_exceptions.push(item.number);
				exceptionNumbers.value.push(item.number);
			}
		})

		_max = _totalAppear[0];
		_min = _totalAppear[44];

		const _message = _exceptions.join() + " : 최근 100회동안 " + "20번 이상 등장으로 많이 나왔음.";
		return _message;
	}

	function onAllApply(){
		exceptionStore.setNumbers(exceptionNumbers.value);
		// 팝업 닫기 이벤트 emit
		emit("close");
	}

</script>

<style scoped>
</style>
