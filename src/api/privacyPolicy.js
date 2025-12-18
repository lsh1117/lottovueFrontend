import http from './base'

/**
 * 개인정보처리방침 API
 */

/**
 * 모든 개인정보처리방침 목록 조회
 * @param {number} skip - 건너뛸 레코드 수
 * @param {number} limit - 조회할 레코드 수
 * @returns {Promise} 개인정보처리방침 목록
 */
export function getPrivacyPolicyList(skip = 0, limit = 100) {
	return http.get('/privacy-policy', {
		params: { skip, limit }
	})
}

/**
 * 활성화된 개인정보처리방침 조회
 * @returns {Promise} 활성화된 개인정보처리방침
 */
export function getActivePrivacyPolicy() {
	return http.get('/privacy-policy/active')
}

/**
 * 버전별 개인정보처리방침 조회
 * @param {string} version - 버전
 * @returns {Promise} 버전별 개인정보처리방침 목록
 */
export function getPrivacyPolicyByVersion(version) {
	return http.get(`/privacy-policy/version/${version}`)
}

/**
 * 개인정보처리방침 상세 조회
 * @param {number} policyId - 개인정보처리방침 ID
 * @returns {Promise} 개인정보처리방침 상세 정보
 */
export function getPrivacyPolicyDetail(policyId) {
	return http.get(`/privacy-policy/${policyId}`)
}

/**
 * 개인정보처리방침 생성 (관리자만 가능)
 * @param {Object} policyData - 개인정보처리방침 데이터
 * @returns {Promise} 생성된 개인정보처리방침 정보
 */
export function createPrivacyPolicy(policyData) {
	return http.post('/privacy-policy', policyData)
}

/**
 * 개인정보처리방침 수정 (관리자만 가능)
 * @param {number} policyId - 개인정보처리방침 ID
 * @param {Object} policyData - 수정할 개인정보처리방침 데이터
 * @returns {Promise} 수정된 개인정보처리방침 정보
 */
export function updatePrivacyPolicy(policyId, policyData) {
	return http.put(`/privacy-policy/${policyId}`, policyData)
}

/**
 * 개인정보처리방침 삭제 (관리자만 가능)
 * @param {number} policyId - 개인정보처리방침 ID
 * @returns {Promise}
 */
export function deletePrivacyPolicy(policyId) {
	return http.delete(`/privacy-policy/${policyId}`)
}

