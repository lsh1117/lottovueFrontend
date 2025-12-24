<template>
	<div class="popup-container" :class="{ on: isPopupVisible }">
		<popup v-for="(popup, index) in popups" :key="popup.id" :type="popup.type" :title="popup.title" :onConfirm="popup.onConfirm" :onCancel="popup.onCancel" :options="popup.options" @close="closePopup(index)">
			<template #default>
				<component :is="popup.component" v-bind="popup.props" :onConfirm="popup.onConfirm" :onCancel="popup.onCancel" @close="closePopup(index)"/>
			</template>
		</popup>
	</div>
</template>

<script setup>
	import {reactive, onMounted, onUnmounted, ref} from 'vue'
	import {popupList} from '@/config/PopupList.js'
	import Popup from '@/components/cmm/Popup.vue'
	import { useEventStore } from '@/stores/EventStore';

	const eventStore = useEventStore();
	const isPopupVisible = ref(false);

	// 팝업 목록 관리
	const popups = reactive([])

	onMounted(() => {
		// 이벤트 등록
		eventStore.on('popup', onPopupCall)
	});

	onUnmounted(() => {
		// 이벤트 삭제
		eventStore.off('popup', onPopupCall)
	});

	function onPopupCall(e) {
		// 팝업 호출 이벤트 핸들러
		////console.log(" 팝업 호출 :", e);
		const popupData = popupList[e.id];
		if (!popupData) {
			console.error(`팝업 키 '${e.id}'는 popupList에 정의되어 있지 않습니다.`)
			return
		}

		// 같은 id의 팝업이 이미 열려있는지 확인하고 닫기
		// (특히 aiRecommendation 같은 경우 업데이트를 위해 기존 팝업을 닫아야 함)
		// 원본 id를 저장하여 같은 팝업을 추적
		const originalId = e.id;
		
		// 같은 originalId를 가진 팝업 찾기 (뒤에서부터 찾아서 가장 최근 것부터 닫기)
		for (let i = popups.length - 1; i >= 0; i--) {
			if (popups[i].originalId === originalId) {
				closePopup(i);
				break; // 첫 번째로 찾은 것만 닫기
			}
		}

		// 팝업 인터페이스 값 할당.
		if(e.title){
			popupData.title = e.title;
		}

		if(e.type){
			popupData.type = e.type;
		}

		if(e.onConfirm){
			popupData.onConfirm = e.onConfirm;
		}

		if(e.onCancel){
			popupData.onCancel = e.onCancel;
		}

		if(e.options){
			popupData.options = e.options;
		}
		
		// 원본 id 저장
		popupData.originalId = originalId;
		
		openPopup(popupData);
	}

	// 팝업 열기 함수
	function openPopup(prop) {
		////console.log("******",prop)

		const id = Date.now()
		popups.push({
			id,
			originalId: prop.originalId || null, // 원본 팝업 ID (같은 팝업 업데이트를 위해)
			type: prop.type, // 기본 유형
			title: prop.title, // 팝업 타이틀
			component: prop.component,
			onConfirm: prop.onConfirm,
			onCancel: prop.onCancel,
			props: {
				...prop.options,
			},
		})

		isPopupVisible.value = true // `on` 클래스 추가
	}

	// 팝업 닫기 함수
	function closePopup(index) {
		popups.splice(index, 1);

		if(popups.length>0){
			isPopupVisible.value = true // `on` 클래스 추가
		}
		else{
			isPopupVisible.value = false // `on` 클래스 제거
		}
	}
</script>
