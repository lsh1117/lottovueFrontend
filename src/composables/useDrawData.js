import { ref } from 'vue'
import { useDrwStore } from '@/stores/DrwStore'
import { getDraws } from '@/api/lotto'

const loading = ref(false)
const error = ref(null)
let loadPromise = null

function normalizeDraw(draw) {
	if (!draw) return null

	const drwNo = draw.drwNo ?? draw.drw_no
	const drwtNo1 = draw.drwtNo1 ?? draw.drwt_no1

	if (drwNo == null || drwtNo1 == null) {
		return null
	}

	return {
		drwNo,
		drwNoDate: draw.drwNoDate ?? draw.drw_no_date,
		drwtNo1,
		drwtNo2: draw.drwtNo2 ?? draw.drwt_no2,
		drwtNo3: draw.drwtNo3 ?? draw.drwt_no3,
		drwtNo4: draw.drwtNo4 ?? draw.drwt_no4,
		drwtNo5: draw.drwtNo5 ?? draw.drwt_no5,
		drwtNo6: draw.drwtNo6 ?? draw.drwt_no6,
		bnusNo: draw.bnusNo ?? draw.bnus_no,
		totSellamnt: draw.totSellamnt ?? draw.tot_sellamnt,
		firstWinamnt: draw.firstWinamnt ?? draw.first_winamnt,
		firstPrzwnerCo: draw.firstPrzwnerCo ?? draw.first_przwner_co,
		firstAccumamnt: draw.firstAccumamnt ?? draw.first_accumamnt,
	}
}

export function isDrawDataReady(numbers) {
	if (!Array.isArray(numbers) || numbers.length === 0) {
		return false
	}
	return normalizeDraw(numbers[0]) != null
}

async function fetchAllDraws(drwStore) {
	let allDraws = []
	let skip = 0
	const limit = 1000
	let hasMore = true

	while (hasMore) {
		const data = await getDraws(skip, limit)
		if (data && data.length > 0) {
			allDraws = allDraws.concat(data)
			skip += data.length
			if (data.length < limit) {
				hasMore = false
			}
		} else {
			hasMore = false
		}
	}

	const convertedDraws = allDraws
		.map(normalizeDraw)
		.filter(Boolean)
		.sort((a, b) => Number(b.drwNo) - Number(a.drwNo))

	drwStore.setNumbers(convertedDraws)
	return convertedDraws
}

/**
 * 당첨 번호(DrwStore) 로딩 — 앱 전역에서 한 번만 요청하고 재사용
 */
export function useDrawData() {
	const drwStore = useDrwStore()

	async function ensureDrawsLoaded({ force = false } = {}) {
		if (!force && isDrawDataReady(drwStore.numbers)) {
			return drwStore.numbers
		}

		if (loadPromise && !force) {
			return loadPromise
		}

		loading.value = true
		error.value = null

		loadPromise = (async () => {
			try {
				const draws = await fetchAllDraws(drwStore)
				if (!draws.length) {
					throw new Error('당첨 정보가 없습니다.')
				}
				return draws
			} catch (err) {
				error.value = err.response?.data?.detail || err.message || '데이터를 불러올 수 없습니다.'
				throw err
			} finally {
				loading.value = false
				loadPromise = null
			}
		})()

		return loadPromise
	}

	function resetDrawDataCache() {
		loadPromise = null
		error.value = null
	}

	return {
		loading,
		error,
		ensureDrawsLoaded,
		resetDrawDataCache,
		isDrawDataReady,
	}
}
