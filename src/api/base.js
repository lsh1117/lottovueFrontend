import axios from 'axios'
import { getToken, logout } from '@/utils/auth'

// 백엔드 API 기본 경로 설정
// 환경 변수 VITE_API_BASE_URL이 설정되어 있으면 사용하고, 없으면 기본값 사용
// 기본값: http://localhost:8030/api/
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8030/api/'

let http = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
})

// 인터셉터 추가
http.interceptors.request.use(
	config => {
		console.log('API 요청:', config.method?.toUpperCase(), config.url)
		
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
		console.log('API 응답 성공:', res.config.url, res.status)
		return res.data
	},
	err => {
		console.error('API 응답 오류:', {
			url: err.config?.url,
			method: err.config?.method,
			status: err.response?.status,
			statusText: err.response?.statusText,
			data: err.response?.data,
			message: err.message
		})
		
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
