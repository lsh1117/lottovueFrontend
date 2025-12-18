import http from '@/api/base'

/**
 * 회원 추천번호 저장
 * @param {Object} recommendation - 추천번호 데이터 { drw_no, no1, no2, no3, no4, no5, no6 }
 * @returns {Promise} 저장된 추천번호 정보
 */
export const createUserRecommendation = async (recommendation) => {
	return await http.post('/recommendations/', recommendation)
}

/**
 * 회원 추천번호 목록 조회
 * @param {number} skip - 건너뛸 레코드 수 (기본값: 0)
 * @param {number} limit - 조회할 레코드 수 (기본값: 100)
 * @param {number} drw_no - 회차번호 필터 (선택사항)
 * @returns {Promise} 추천번호 목록
 */
export const getUserRecommendations = async (skip = 0, limit = 100, drw_no = null) => {
	const params = { skip, limit }
	if (drw_no) {
		params.drw_no = drw_no
	}
	return await http.get('/recommendations/', { params })
}

/**
 * 특정 추천번호 조회
 * @param {number} recommendation_id - 추천번호 ID
 * @returns {Promise} 추천번호 정보
 */
export const getUserRecommendation = async (recommendation_id) => {
	return await http.get(`/recommendations/${recommendation_id}`)
}

/**
 * 회원 추천번호 수정
 * @param {number} recommendation_id - 추천번호 ID
 * @param {Object} recommendation - 수정할 추천번호 데이터
 * @returns {Promise} 수정된 추천번호 정보
 */
export const updateUserRecommendation = async (recommendation_id, recommendation) => {
	return await http.put(`/recommendations/${recommendation_id}`, recommendation)
}

/**
 * 회원 추천번호 삭제
 * @param {number} recommendation_id - 추천번호 ID
 * @returns {Promise}
 */
export const deleteUserRecommendation = async (recommendation_id) => {
	return await http.delete(`/recommendations/${recommendation_id}`)
}
