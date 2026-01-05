import axios from 'axios'
import { getToken, logout } from '@/utils/auth'

// 백엔드 API 기본 경로 설정
// 환경 변수 VITE_API_BASE_URL이 설정되어 있으면 사용하고, 없으면 기본값 사용
// 프로덕션 환경에서는 HTTPS를 사용하도록 자동 감지
const getDefaultBaseURL = () => {
	// 프로덕션 환경 감지 (localhost가 아니고 HTTPS를 사용하는 경우)
	if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.protocol === 'https:') {
		return 'https://lottovue-backend.onrender.com/api/'
	}
	// 로컬 개발 환경
	return 'http://localhost:8030/api/'
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultBaseURL()

let http = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000, // 30초로 증가 (데이터베이스 쿼리 시간 고려)
})

// 인터셉터 추가
http.interceptors.request.use(
	config => {
		//console.log('API 요청:', config.method?.toUpperCase(), config.url)
		
		// JWT 토큰이 있으면 헤더에 추가
		const token = getToken()
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}

		return config
	},
	err => {
		console.error('요청 오류:', err)
		return Promise.reject(err)
	},
)

//응답 인터셉터
http.interceptors.response.use(
	res => {
		//console.log('API 응답 성공:', res.config.url, res.status)
		return res.data
	},
	err => {
		// 타임아웃 에러인 경우 더 자세한 정보 제공
		if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
			console.error('API 요청 타임아웃:', {
				url: err.config?.url,
				method: err.config?.method,
				baseURL: err.config?.baseURL,
				timeout: err.config?.timeout,
				message: '서버 응답이 지연되고 있습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
			})
		} else if (err.code === 'ERR_NETWORK' || !err.response) {
			console.error('API 네트워크 오류:', {
				url: err.config?.url,
				method: err.config?.method,
				baseURL: err.config?.baseURL,
				message: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'
			})
		} else {
			console.error('API 응답 오류:', {
				url: err.config?.url,
				method: err.config?.method,
				status: err.response?.status,
				statusText: err.response?.statusText,
				data: err.response?.data,
				message: err.message
			})
		}
		
		// 401 Unauthorized 에러 시 로그아웃 처리
		if (err.response?.status === 401) {
			logout()
			// 로그인 페이지로 리다이렉트 (router는 컴포넌트에서만 사용 가능하므로 window.location 사용)
			if (window.location.pathname !== '/login') {
				window.location.href = '/#/login'
			}
		}
		
		return Promise.reject(err)
	},
)

export default http
