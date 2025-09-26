<template>
	<div class="StatisticsView">
		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">통계 보기</h4>
			</div>
			<div class="section-body">
				<!-- AppearNumber 컴포넌트 삽입 -->
				<LastAppearNumber />
				<AppearNumber />
				<AppearInSuccession />
				<AppearInSuccessionUntil />
				<NotAppearInSuccession />
				<NotAppearInSuccessionUntil />
				<GroupAppearInSuccession />
				<GroupAppearInSuccessionUntil />
				<GroupNotAppearInSuccession />
				<GroupNotAppearInSuccessionUntil />
				<EvenAndOddAppearInSuccession />
				<EvenAndOddAppearInSuccessionUntil />
				<EvenAndOddNotAppearInSuccession />
				<EvenAndOddNotAppearInSuccessionUntil />
			</div>
		</section>
	</div>
</template>

<script setup>
	import LastAppearNumber from "@/components/stt/LastAppearNumber.vue"; // 최근 100회 동안 번호별 등장 횟수 컴포넌트 가져오기
	import AppearNumber from "@/components/stt/AppearNumber.vue"; // 번호별 등장 횟수 컴포넌트 가져오기
	import AppearInSuccession from "@/components/stt/AppearInSuccession.vue"; // 연속등장 컴포넌트 가져오기
	import AppearInSuccessionUntil from "@/components/stt/AppearInSuccessionUntil.vue"; // 현재까지 연속 등장 컴포넌트 가져오기
	import NotAppearInSuccession from "@/components/stt/NotAppearInSuccession.vue"; // 연속 미등장 컴포넌트 가져오기
	import NotAppearInSuccessionUntil from "@/components/stt/NotAppearInSuccessionUntil.vue"; // 현재까지 연속 미등장 컴포넌트 가져오기
	import GroupAppearInSuccession from "@/components/stt/GroupAppearInSuccession.vue"; // 구간별 연속등장 컴포넌트 가져오기
	import GroupAppearInSuccessionUntil from "@/components/stt/GroupAppearInSuccessionUntil.vue"; // 현재까지 구간별 연속등장 컴포넌트 가져오기
	import GroupNotAppearInSuccession from "@/components/stt/GroupNotAppearInSuccession.vue"; // 구간별 연속 미등장 컴포넌트 가져오기
	import GroupNotAppearInSuccessionUntil from "@/components/stt/GroupNotAppearInSuccessionUntil.vue"; // 현재까지 구간별 연속 미등장 컴포넌트 가져오기
	import EvenAndOddAppearInSuccession from "@/components/stt/EvenAndOddAppearInSuccession.vue"; // 짝수홀수 연속 등장 컴포넌트 가져오기
	import EvenAndOddAppearInSuccessionUntil from "@/components/stt/EvenAndOddAppearInSuccessionUntil.vue"; // 현재까지 짝수홀수 연속 등장 컴포넌트 가져오기
	import EvenAndOddNotAppearInSuccession from "@/components/stt/EvenAndOddNotAppearInSuccession.vue"; // 짝수홀수 연속 미등장 컴포넌트 가져오기
	import EvenAndOddNotAppearInSuccessionUntil from "@/components/stt/EvenAndOddNotAppearInSuccessionUntil.vue"; // 짝수홀수 현재까지 연속 미등장 컴포넌트 가져오기
	

</script>

<style scoped>
</style>
