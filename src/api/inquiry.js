import http from './base'

/**
 * 문의하기 API
 */

/**
 * 문의 목록 조회
 * @param {number} skip - 건너뛸 레코드 수
 * @param {number} limit - 조회할 레코드 수
 * @returns {Promise} 문의 목록
 */
export function getInquiriesList(skip = 0, limit = 100) {
	return http.get('/inquiries', {
		params: { skip, limit }
	})
}

/**
 * 문의 상세 조회
 * @param {number} inquiryId - 문의 ID
 * @returns {Promise} 문의 상세 정보
 */
export function getInquiryDetail(inquiryId) {
	return http.get(`/inquiries/${inquiryId}`)
}

/**
 * 문의 등록
 * @param {Object} inquiryData - 문의 데이터 { title: string, content: string }
 * @returns {Promise} 생성된 문의 정보
 */
export function createInquiry(inquiryData) {
	return http.post('/inquiries', inquiryData)
}

