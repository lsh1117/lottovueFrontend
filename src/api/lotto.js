import http from '@/api/base'

/**
 * 최신 회차의 당첨 정보 조회
 * @returns {Promise} 최신 당첨 정보
 */
export const getLatestDraw = async () => {
	return await http.get('/lotto/latest')
}

/**
 * 특정 회차의 당첨 정보 조회
 * @param {number} drwNo - 회차번호
 * @returns {Promise} 당첨 정보
 */
export const getDrawByNumber = async (drwNo) => {
	return await http.get(`/lotto/${drwNo}`)
}

/**
 * 당첨 정보 목록 조회
 * @param {number} skip - 건너뛸 레코드 수 (기본값: 0)
 * @param {number} limit - 조회할 레코드 수 (기본값: 100)
 * @returns {Promise} 당첨 정보 목록
 */
export const getDraws = async (skip = 0, limit = 100) => {
	return await http.get('/lotto/', { params: { skip, limit } })
}

/**
 * AI 분석 요청 (통계 데이터 기반)
 * @param {Object} statisticsData - 통계 데이터 JSON
 * @returns {Promise} AI 분석 결과
 */
export const getAIRecommendation = async (statisticsData) => {
	// OpenAI API 호출은 시간이 오래 걸릴 수 있으므로 타임아웃을 60초로 설정
	return await http.post('/lotto/ai-recommendation', statisticsData, {
		timeout: 60000 // 60초
	})
}

