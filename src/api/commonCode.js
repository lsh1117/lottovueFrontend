import http from './base'

/**
 * 공통코드 API
 */

/**
 * 공통코드 목록 조회
 * @param {string|null} codeGroup - 코드 그룹 필터
 * @param {boolean|null} isActive - 사용 여부 필터
 * @param {number} skip - 건너뛸 레코드 수
 * @param {number} limit - 조회할 레코드 수
 * @returns {Promise} 공통코드 목록
 */
export function getCommonCodes(codeGroup = null, isActive = null, skip = 0, limit = 100) {
	const params = { skip, limit }
	if (codeGroup) params.code_group = codeGroup
	if (isActive !== null) params.is_active = isActive
	return http.get('/common-code', { params })
}

/**
 * 특정 코드 그룹의 공통코드 목록 조회
 * @param {string} codeGroup - 코드 그룹
 * @param {boolean|null} isActive - 사용 여부 필터
 * @param {number} skip - 건너뛸 레코드 수
 * @param {number} limit - 조회할 레코드 수
 * @returns {Promise} 공통코드 목록
 */
export function getCommonCodesByGroup(codeGroup, isActive = null, skip = 0, limit = 100) {
	const params = { skip, limit }
	if (isActive !== null) params.is_active = isActive
	return http.get(`/common-code/group/${codeGroup}`, { params })
}

/**
 * 공통코드 상세 조회
 * @param {number} codeId - 공통코드 ID
 * @returns {Promise} 공통코드 상세 정보
 */
export function getCommonCode(codeId) {
	return http.get(`/common-code/${codeId}`)
}

/**
 * 공통코드 생성 (관리자만 가능)
 * @param {Object} commonCodeData - 공통코드 데이터
 * @returns {Promise} 생성된 공통코드 정보
 */
export function createCommonCode(commonCodeData) {
	return http.post('/common-code', commonCodeData)
}

/**
 * 공통코드 수정 (관리자만 가능)
 * @param {number} codeId - 공통코드 ID
 * @param {Object} commonCodeData - 수정할 공통코드 데이터
 * @returns {Promise} 수정된 공통코드 정보
 */
export function updateCommonCode(codeId, commonCodeData) {
	return http.put(`/common-code/${codeId}`, commonCodeData)
}

/**
 * 공통코드 삭제 (관리자만 가능)
 * @param {number} codeId - 공통코드 ID
 * @returns {Promise}
 */
export function deleteCommonCode(codeId) {
	return http.delete(`/common-code/${codeId}`)
}

