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
		//console.log(" 팝업 호출 :", e);
		const popupData = popupList[e.id];
		if (!popupData) {
			console.error(`팝업 키 '${key}'는 popupList에 정의되어 있지 않습니다.`)
			return
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
		openPopup(popupData);
	}

	// 팝업 열기 함수
	function openPopup(prop) {
		//console.log("******",prop)

		const id = Date.now()
		popups.push({
			id,
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
