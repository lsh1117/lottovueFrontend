<template>
	<div class="warning-popup">
		<div class="warning-content">
			<p><strong>시스템 오류로 인한 등수 표시 오류 가능성 안내</strong></p>
			<p>저장된 번호의 등수 표시는 시스템 오류, 데이터 처리 과정의 문제, 또는 기타 기술적 장애로 인하여 잘못 표기될 수 있습니다.</p>
			<p><strong>저장된 번호의 등수 확인은 반드시 실제 동행복권 공식 사이트(www.dhlottery.co.kr)에서 당첨 번호를 직접 재확인하시기 바랍니다.</strong></p>
			<p>본 서비스에서 표시되는 등수 정보는 참고용이며, 실제 당첨 여부 및 등수 확인의 최종 권한은 동행복권에 있습니다.</p>
			<p class="warning-disclaimer">시스템에서 잘못 표기된 등수 정보로 인한 모든 손해, 불이익, 분쟁 등에 대하여 회사는 책임을 지지 않습니다.</p>
		</div>
		<div class="warning-footer">
			<n-checkbox v-model:checked="dontShowToday" @update:checked="handleCheckboxChange">
				하루동안 안보기
			</n-checkbox>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NCheckbox } from 'naive-ui';

const dontShowToday = ref(false);

// 체크박스 변경 시 로컬스토리지에 저장
function handleCheckboxChange(checked) {
	if (checked) {
		// 체크박스가 체크되면 현재 시간을 로컬스토리지에 저장
		localStorage.setItem('myWinningNumberWarningDismissed', Date.now().toString());
	} else {
		// 체크박스가 해제되면 로컬스토리지에서 제거
		localStorage.removeItem('myWinningNumberWarningDismissed');
	}
}

onMounted(() => {
	// 기존에 저장된 값이 있는지 확인
	const dismissedTime = localStorage.getItem('myWinningNumberWarningDismissed');
	if (dismissedTime) {
		const oneDay = 24 * 60 * 60 * 1000; // 24시간
		// 하루 이내에 저장된 값이 있으면 체크박스를 체크 상태로 표시
		if (Date.now() - Number(dismissedTime) < oneDay) {
			dontShowToday.value = true;
		} else {
			// 하루가 지났으면 로컬스토리지에서 제거
			localStorage.removeItem('myWinningNumberWarningDismissed');
		}
	}
});
</script>

