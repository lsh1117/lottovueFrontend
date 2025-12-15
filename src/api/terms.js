import http from './base'

/**
 * 약관 API
 */

/**
 * 모든 약관 목록 조회
 * @param {number} skip - 건너뛸 레코드 수
 * @param {number} limit - 조회할 레코드 수
 * @returns {Promise} 약관 목록
 */
export function getTermsList(skip = 0, limit = 100) {
	return http.get('/terms', {
		params: { skip, limit }
	})
}

/**
 * 약관 그룹별 조회
 * @param {string} termGroup - 약관 그룹 코드
 * @param {boolean|null} isActive - 활성화 여부 필터 (null이면 전체)
 * @returns {Promise} 약관 목록
 */
export function getTermsByGroup(termGroup, isActive = null) {
	const params = {}
	if (isActive !== null) {
		params.is_active = isActive
	}
	return http.get(`/terms/group/${termGroup}`, { params })
}

/**
 * 활성화된 약관 그룹별 조회
 * @param {string} termGroup - 약관 그룹 코드
 * @returns {Promise} 활성화된 약관 목록
 */
export function getActiveTermsByGroup(termGroup) {
	return http.get(`/terms/group/${termGroup}/active`)
}

/**
 * 약관 상세 조회
 * @param {number} termsId - 약관 ID
 * @returns {Promise} 약관 상세 정보
 */
export function getTermsDetail(termsId) {
	return http.get(`/terms/${termsId}`)
}

/**
 * 약관 생성 (관리자만 가능)
 * @param {Object} termsData - 약관 데이터
 * @returns {Promise} 생성된 약관 정보
 */
export function createTerms(termsData) {
	return http.post('/terms', termsData)
}

/**
 * 약관 수정 (관리자만 가능)
 * @param {number} termsId - 약관 ID
 * @param {Object} termsData - 수정할 약관 데이터
 * @returns {Promise} 수정된 약관 정보
 */
export function updateTerms(termsId, termsData) {
	return http.put(`/terms/${termsId}`, termsData)
}

/**
 * 약관 삭제 (관리자만 가능)
 * @param {number} termsId - 약관 ID
 * @returns {Promise}
 */
export function deleteTerms(termsId) {
	return http.delete(`/terms/${termsId}`)
}

