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
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDrwStore } from '@/stores/DrwStore'
import { useDrawData } from '@/composables/useDrawData'

const drwStore = useDrwStore()
const { numbers } = storeToRefs(drwStore)
const { ensureDrawsLoaded } = useDrawData()
const messages = ref([])
const isLoading = ref(true)
const loadError = ref(null)

function refreshMessages() {
	const _message1 = getAppearInSuccessionUntil()
	const _message2 = getLastAppear()
	const nextMessages = []
	if (_message1) nextMessages.push(_message1)
	if (_message2) nextMessages.push(_message2)
	if (_message1 === null && _message2 === null) {
		nextMessages.push('이번주 분석 고정번호는 없음.')
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
	const statsArray = drwStore.getNotAppearInSuccessionUntil(draws)
	if (!statsArray?.length) return null
	statsArray.sort((a, b) => b.count - a.count)
	const notAppearInSuccession = drwStore.getNotAppearInSuccession(draws)
	if (!notAppearInSuccession?.length) return null
	const maxNotAppearCount = Math.max(...notAppearInSuccession.map((item) => item.count))
	const threshold = Math.floor(maxNotAppearCount * 0.7)
	const items = statsArray.filter((item) => item.count > threshold).map((item) => item.number)
	if (items.length > 0) {
		return items.join() + ' 번호 : 최근 ' + threshold + '회 이상 연속으로 미등장.'
	}
	return null
}

function getLastAppear() {
	const allNumbers = drwStore.getNumbers()
	if (!allNumbers?.length) return null
	const sortedNumbers = [...allNumbers].sort((a, b) => Number(b.drwNo) - Number(a.drwNo))
	const lastNumbers = sortedNumbers.slice(0, 100)
	if (!lastNumbers.length) return null
	const totalAppear = drwStore.getTotalAppear(lastNumbers)
	if (!totalAppear?.length) return null
	totalAppear.sort((a, b) => b.count - a.count)
	const minCount = totalAppear[totalAppear.length - 1]?.count || 0
	const fixeds = totalAppear.filter((item) => Number(item.count) < 5).map((item) => item.number)
	if (fixeds.length > 0) {
		return fixeds.join() + ' : 최근 100회동안 ' + minCount + '번 등장으로 적게 나왔음.'
	}
	return null
}
</script>

<style scoped>
</style>
