<template>
	<div class="ContactView">
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
					<button class="btn-primary btn-small" :disabled="drawsLoading" @click="openFixedRecommendPopup">분석 고정번호</button>
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
					<button class="btn-primary btn-small" :disabled="drawsLoading" @click="openExceptionRecommendPopup">분석 제외번호</button>
				</div>
			</div>
		</section>
		<section class="section section-area fixed-bottom">
			<div class="btn-area btn-area-center">
				<button class="btn-primary btn-large" :disabled="drawsLoading" @click="openRecommendPopup">번호생성</button>
				<button class="btn-primary btn-large" :disabled="drawsLoading" @click="openAIRecommendPopup">AI번호생성</button>
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
	import { useDrawData } from '@/composables/useDrawData';
	import { useStatisticsCalculate } from '@/composables/useStatisticsCalculate';
	import { isAuthenticated } from '@/utils/auth';

	const router = useRouter();

	const eventStore = useEventStore();
	const exceptionStore = useExceptionStore();
	const fixedStore = useFixedStore();
	const { loading: drawsLoading } = useDrawData();
	const { ensureStatisticsReady } = useStatisticsCalculate();

	async function requireDraws() {
		try {
			const ready = await ensureStatisticsReady();
			if (!ready) {
				alert('당첨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
				return false;
			}
			return true;
		} catch {
			alert('당첨 정보를 불러오는데 실패했습니다. 네트워크를 확인한 뒤 다시 시도해 주세요.');
			return false;
		}
	}

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
	async function openExceptionRecommendPopup() {
		if (!(await requireDraws())) return;
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
	async function openFixedRecommendPopup() {
		if (!(await requireDraws())) return;
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

	// 번호 생성 팝업 (통계 기반)
	async function openRecommendPopup() {
		if (!isAuthenticated()) {
			alert('번호 생성 기능은 로그인 후 이용 가능합니다.\n계정 정보에서 로그인해주세요.');
			return;
		}
		if (!(await requireDraws())) return;
		eventStore.emit('popup',{
			id:"recommend",
			title:"번호 생성",
			options: { generateMode: 'normal' },
		});
	}

	async function openAIRecommendPopup() {
		if (!isAuthenticated()) {
			alert('AI번호생성 기능은 로그인 후 이용 가능합니다.\n계정 정보에서 로그인해주세요.');
			return;
		}
		if (!(await requireDraws())) return;
		eventStore.emit('popup',{
			id:"recommend",
			title:"AI 번호 생성",
			options: { generateMode: 'ai' },
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

	onMounted(async () => {
		try {
			await ensureStatisticsReady();
		} catch (err) {
			console.error('당첨/통계 데이터 로드 실패:', err);
		}
	});
</script>
