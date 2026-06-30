import { useCalculateStore } from '@/stores/CalculateStore'
import { useDrwStore } from '@/stores/DrwStore'
import { useDrawData } from '@/composables/useDrawData'

/**
 * DrwStore 당첨 데이터를 기반으로 CalculateStore 통계 풀을 구성
 */
export function buildCalculateNumbers(drwStore) {
	const numbers = drwStore.getNumbers()
	if (!numbers?.length) {
		return []
	}

	const calculateNumbers = []

	const appearNumber = drwStore.getTotalAppear(numbers)
	appearNumber.sort((a, b) => b.count - a.count)
	const appearCnt = appearNumber[0]?.count ?? 0
	appearNumber.forEach((item) => {
		const _cnt = appearCnt - item.count
		for (let i = 0; i < _cnt; i++) {
			calculateNumbers.push(item.number)
		}
	})

	const notAppearInSuccessionUntil = drwStore.getNotAppearInSuccessionUntil(numbers)
	notAppearInSuccessionUntil.sort((a, b) => b.count - a.count)
	notAppearInSuccessionUntil.forEach((item) => {
		for (let i = 0; i < item.count; i++) {
			calculateNumbers.push(item.number)
		}
	})

	const groupNotAppearInSuccessionUntil = drwStore.getGroupNotAppearInSuccessionUntil(numbers)
	groupNotAppearInSuccessionUntil.sort((a, b) => b.count - a.count)
	groupNotAppearInSuccessionUntil.forEach((item) => {
		if (item.count > 0) {
			const _marginRate = item.count * 10
			const _cnt = item.number < 5 ? 10 : 5
			for (let j = 0; j < _cnt; j++) {
				const _number = (item.number - 1) * 10 + (j + 1)
				for (let i = 0; i < _marginRate; i++) {
					calculateNumbers.push(_number)
				}
			}
		}
	})

	return calculateNumbers
}

/**
 * 당첨 데이터 로드 후 통계(CalculateStore)까지 준비
 */
export function useStatisticsCalculate() {
	const drwStore = useDrwStore()
	const calculateStore = useCalculateStore()
	const { ensureDrawsLoaded, isDrawDataReady } = useDrawData()

	function applyCalculateStore() {
		const calculateNumbers = buildCalculateNumbers(drwStore)
		if (!calculateNumbers.length) {
			return false
		}
		calculateStore.setState(true)
		calculateStore.setNumbers(calculateNumbers)
		return true
	}

	async function ensureStatisticsReady() {
		await ensureDrawsLoaded()
		if (!isDrawDataReady(drwStore.numbers)) {
			return false
		}
		if (calculateStore.getState() === false || calculateStore.getNumbers().length === 0) {
			return applyCalculateStore()
		}
		return true
	}

	return {
		ensureStatisticsReady,
		applyCalculateStore,
	}
}
