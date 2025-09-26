<template>
	<div class="popup-area">
		<div :class="'popup-content ' + 'popup-type-' + type">
			<div class="popup-header">
				<h2 class="title-h3"><span>{{ title }}</span></h2>
			</div>
			<div class="popup-body">
				<slot />
			</div>
			<div class="popup-footer">
				<button class="btn-close popup-close" @click="onCloseHandler">닫기</button>
			</div>
		</div>
		<div class="popup-overlay"></div>
	</div>
</template>

<script setup>
	const emit = defineEmits(["close"]);

	defineProps({
		type: {
			type: String,
			required: true,
			default: 'full', // full:전체 사이즈, dialog:중간 사이즈, bottom:하단에서 올라오는 팝업,
		},
		title:{
			type: String,
			required: true,
			default: '팝업입니다.',
		},
		onConfirm:{
			type: Function,
			required: false,
		},
		onCancel:{
			type: Function,
			required: false,
		},
		options:{
			type:Object,
			required: false,
		}
	})

	function onCloseHandler(){
		emit('close')
	}

</script>
