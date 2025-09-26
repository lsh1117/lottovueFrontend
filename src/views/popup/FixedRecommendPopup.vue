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
		</div>
	</div>
</template>

<script setup>
	import {onMounted,ref} from "vue";
	import {useDrwStore} from '@/stores/DrwStore';

	// Pinia store 가져오기
	const drwStore = useDrwStore();
	const messages = ref([]);

	onMounted(()=>{
		// 현재까지 연속 미등장
		const _message1 = getAppearInSuccessionUntil();
		if(_message1){
			messages.value.push(_message1);
		}
		// 최근 미등장
		const _message2 = getLastAppear();
		if(_message2){
			messages.value.push(_message2);
		}

		if(_message1 === null && _message2 === null){
			messages.value.push('이번주 추천 고정번호는 없음.')
		}
	});
	
	// 연속 미등장 횟수 분석
	function getAppearInSuccessionUntil(){
		// 현재까지 연속 미등장 횟수 가져오기
		const _statsArray = drwStore.getNotAppearInSuccessionUntil(drwStore.getNumbers());
		_statsArray.sort((a, b) => b.count - a.count);

		// 연속으로 미등장한 횟수 가져오기
		const _notAppearInSuccession = drwStore.getNotAppearInSuccession(drwStore.getNumbers());
		// 연속으로 미등장한 횟수중 가장 많이 미등장한 횟수
		// 연속 140 미등장한 번호는 고정번호로 추천
		const _cnt = 140;//_notAppearInSuccession[0].count;

		let _message = "";
		let items = [];
		
		for(let i=0;i<_statsArray.length;i++){
			if(_statsArray[i].count > _cnt){
				items.push(_statsArray[i].number);
			}
		}
		if(items.length > 0 ){
			_message = items.join() + " 번호 : " + "최근 "+_cnt+"회 이상 연속으로 미등장.";
			return _message;
		}
		else{
			return null;
		}
	}

	// 최근 100 회 등장 횟수 분석
	function getLastAppear(){
		// 최근 100 회 데이터
		let _max = {count:0};
		let _min = {count:100};
		let _totalAppear = [];
		let _fixeds = [];

		// 최근 100회 동안 가장 많이 나왔던 횟수 25, 가장 적게 나왔던 횟수 5
		// 5번 이하로 나온 번호는 고정번호로 추천
		let _lastNumbers = drwStore.getNumbers().slice(0,100);

		_totalAppear = drwStore.getTotalAppear(_lastNumbers);
		_totalAppear.sort((a, b) => b.count - a.count);

		_totalAppear.forEach(item=>{
			if(Number(item.count) < 5){
				_fixeds.push(item.number);
			}
		})

		_max = _totalAppear[0];
		_min = _totalAppear[44];

		let _message ='';
		if(_fixeds.length > 0){
			_message = _fixeds.join() + " : 최근 100회동안 " + _min.count + "번 등장으로 적게 나왔음.";
			return _message;
		}
		else{
			return null;
		}
	}
</script>

<style scoped>
</style>
