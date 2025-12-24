import http from './base'

/**
 * 공지사항 API
 */

/**
 * 공지사항 목록 조회
 * @param {number} skip - 건너뛸 레코드 수
 * @param {number} limit - 조회할 레코드 수
 * @returns {Promise} 공지사항 목록
 */
export function getNoticesList(skip = 0, limit = 100) {
	return http.get('/notices', {
		params: { skip, limit }
	})
}

/**
 * 중요 공지사항 목록 조회
 * @returns {Promise} 중요 공지사항 목록
 */
export function getImportantNotices() {
	return http.get('/notices/important')
}

/**
 * 공지사항 상세 조회
 * @param {number} noticeId - 공지사항 ID
 * @returns {Promise} 공지사항 상세 정보
 */
export function getNoticeDetail(noticeId) {
	return http.get(`/notices/${noticeId}`, {
		params: { increment_view: true }
	})
}

