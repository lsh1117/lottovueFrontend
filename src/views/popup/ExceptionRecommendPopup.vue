<template>
	<div>
		<div class="scroll-area">
			<div class="text-area">
				<p v-if="isLoading" class="text-normal">당첨 정보를 불러오는 중...</p>
				<p v-else-if="loadError" class="text-normal">{{ loadError }}</p>
				<template v-else>
					<p v-for="message in messages" :key="message">
						<span class="text-normal">{{ message }}</span>
					</p>
				</template>
			</div>
		</div>
		<div class="btn-area btn-area-center">
			<button class="btn-primary btn-small" @click="$emit('close')">닫기</button>
			<button class="btn-primary btn-small" :disabled="isLoading || !!loadError" @click="onAllApply">전체적용</button>
			<button class="btn-primary btn-small" :disabled="isLoading || !!loadError" @click="onExcludePreviousDrawAll">이전 회차 전체 제외</button>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDrwStore } from '@/stores/DrwStore'
import { useExceptionStore } from '@/stores/ExceptionStore'
import { useDrawData } from '@/composables/useDrawData'

const drwStore = useDrwStore()
const { numbers } = storeToRefs(drwStore)
const { ensureDrawsLoaded } = useDrawData()
const exceptionStore = useExceptionStore()
const messages = ref([])
const exceptionNumbers = ref([])
const isLoading = ref(true)
const loadError = ref(null)
const emit = defineEmits(['close'])

function refreshMessages() {
	exceptionNumbers.value = []
	const nextMessages = []
	const _message1 = getAppearInSuccessionUntil()
	if (_message1) nextMessages.push(_message1)
	const _message2 = getLastAppear()
	if (_message2) nextMessages.push(_message2)
	if (nextMessages.length === 0) {
		nextMessages.push('이번주 분석 제외번호는 없음.')
	}
	messages.value = nextMessages
}

async function loadAndAnalyze() {
	isLoading.value = true
	loadError.value = null
	try {
		await ensureDrawsLoaded()
		refreshMessages()
	} catch (err) {
		loadError.value = err?.message || '당첨 정보를 불러오지 못했습니다.'
		messages.value = []
	} finally {
		isLoading.value = false
	}
}

onMounted(loadAndAnalyze)

watch(numbers, () => {
	if (!isLoading.value && numbers.value.length > 0) {
		refreshMessages()
	}
}, { deep: true })

function getAppearInSuccessionUntil() {
	const draws = drwStore.getNumbers()
	if (!draws || draws.length === 0) return null
	const appearInSuccessionUntil = drwStore.getAppearInSuccessionUntil(draws)
	if (!appearInSuccessionUntil?.length) return null
	appearInSuccessionUntil.sort((a, b) => b.count - a.count)
	const thirdAppears = []
	appearInSuccessionUntil.forEach((item) => {
		if (item.count > 1) {
			thirdAppears.push(item.number)
			exceptionNumbers.value.push(item.number)
		}
	})
	if (thirdAppears.length > 0) {
		return thirdAppears.join() + ' 번 : 최근 2번 이상 연속으로 나옴.'
	}
	return null
}

function getLastAppear() {
	const allNumbers = drwStore.getNumbers()
	if (!allNumbers?.length) return null
	const sortedNumbers = [...allNumbers].sort((a, b) => Number(b.drwNo) - Number(a.drwNo))
	const lastNumbers = sortedNumbers.slice(0, 100)
	if (!lastNumbers.length) return null
	const exceptions = []
	const totalAppear = drwStore.getTotalAppear(lastNumbers)
	if (!totalAppear?.length) return null
	totalAppear.sort((a, b) => b.count - a.count)
	totalAppear.forEach((item) => {
		if (Number(item.count) > 19 && !exceptionNumbers.value.includes(item.number)) {
			exceptions.push(item.number)
			exceptionNumbers.value.push(item.number)
		}
	})
	if (exceptions.length > 0) {
		return exceptions.join(', ') + ' 번 : 최근 100회동안 20번 이상 등장으로 많이 나왔음.'
	}
	return null
}

function onAllApply() {
	exceptionStore.setNumbers([...new Set(exceptionNumbers.value)])
	emit('close')
}

function onExcludePreviousDrawAll() {
	const draws = drwStore.getNumbers()
	if (!draws?.length) return
	const latestDraw = [...draws].sort((a, b) => Number(b.drwNo) - Number(a.drwNo))[0]
	if (!latestDraw) return
	const prevDrawNumbers = [
		Number(latestDraw.drwtNo1),
		Number(latestDraw.drwtNo2),
		Number(latestDraw.drwtNo3),
		Number(latestDraw.drwtNo4),
		Number(latestDraw.drwtNo5),
		Number(latestDraw.drwtNo6),
	].filter((num) => Number.isFinite(num))
	exceptionNumbers.value = [...new Set([...exceptionNumbers.value, ...prevDrawNumbers])]
	const msg = latestDraw.drwNo + '회차 전체 번호 제외: ' + prevDrawNumbers.join(', ')
	if (!messages.value.includes(msg)) {
		messages.value.push(msg)
	}
}
</script>

<style scoped>
</style>
