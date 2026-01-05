import axios from 'axios'
import { getToken, logout } from '@/utils/auth'

// 백엔드 API 기본 경로 설정
// 환경 변수 VITE_API_BASE_URL이 설정되어 있으면 사용하고, 없으면 기본값 사용
// 프로덕션 환경에서는 HTTPS를 사용하도록 자동 감지
const getDefaultBaseURL = () => {
	// 환경 변수가 설정되어 있으면 우선 사용 (하지만 HTTP는 HTTPS로 강제 변환)
	let envUrl = import.meta.env.VITE_API_BASE_URL
	if (envUrl && typeof window !== 'undefined' && window.location.protocol === 'https:') {
		envUrl = envUrl.replace('http://', 'https://')
	}
	if (envUrl) {
		return envUrl
	}
	
	// 브라우저 환경에서만 실행
	if (typeof window !== 'undefined' && window.location) {
		const hostname = window.location.hostname
		const protocol = window.location.protocol
		
		// 프로덕션 환경 감지 (localhost가 아니거나 HTTPS를 사용하는 경우)
		if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
			// 프로덕션 환경에서는 무조건 HTTPS 사용
			return 'https://lottovue-backend.onrender.com/api/'
		}
	}
	
	// 로컬 개발 환경
	return 'http://localhost:8030/api/'
}

let API_BASE_URL = getDefaultBaseURL()

// 프로덕션 환경에서 HTTP가 감지되면 강제로 HTTPS로 변경
if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
	if (API_BASE_URL.startsWith('http://')) {
		API_BASE_URL = API_BASE_URL.replace('http://', 'https://')
		console.log('프로덕션 환경 감지: API baseURL을 HTTPS로 설정:', API_BASE_URL)
	}
}

let http = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000, // 30초로 증가 (데이터베이스 쿼리 시간 고려)
})

// 런타임에 baseURL이 올바르게 설정되었는지 확인하고 필요시 업데이트
if (typeof window !== 'undefined' && window.location) {
	const currentProtocol = window.location.protocol
	const currentHostname = window.location.hostname
	
	// 프로덕션 환경에서는 무조건 HTTPS 사용
	if (currentHostname !== 'localhost' && currentHostname !== '127.0.0.1') {
		// 프로덕션 환경에서는 무조건 HTTPS baseURL 사용
		http.defaults.baseURL = 'https://lottovue-backend.onrender.com/api/'
		console.log('프로덕션 환경: API baseURL을 HTTPS로 강제 설정:', http.defaults.baseURL)
	} else if (currentProtocol === 'https:' && http.defaults.baseURL.startsWith('http://')) {
		// 로컬 HTTPS 환경에서도 HTTP baseURL을 HTTPS로 변경
		http.defaults.baseURL = http.defaults.baseURL.replace('http://', 'https://')
		console.log('API baseURL이 HTTPS로 자동 변경되었습니다:', http.defaults.baseURL)
	}
}

// 인터셉터 추가
http.interceptors.request.use(
	config => {
		//console.log('API 요청:', config.method?.toUpperCase(), config.url)
		
		// HTTPS 페이지에서 HTTP 요청을 강제로 HTTPS로 변경
		if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
			// baseURL이 HTTP로 시작하면 HTTPS로 변경
			if (config.baseURL && config.baseURL.startsWith('http://')) {
				config.baseURL = config.baseURL.replace('http://', 'https://')
				console.log('baseURL이 HTTPS로 변경되었습니다:', config.baseURL)
			}
			
			// url이 전체 URL이고 HTTP로 시작하면 HTTPS로 변경
			if (config.url && config.url.startsWith('http://')) {
				config.url = config.url.replace('http://', 'https://')
				console.log('url이 HTTPS로 변경되었습니다:', config.url)
			}
			
			// 최종 URL이 생성된 후에도 HTTP가 포함되어 있으면 강제로 변경
			// axios가 내부적으로 URL을 조합하기 전에 미리 처리
			const fullUrl = config.baseURL ? (config.baseURL + (config.url || '')) : config.url
			if (fullUrl && fullUrl.includes('http://lottovue-backend.onrender.com')) {
				const httpsUrl = fullUrl.replace('http://lottovue-backend.onrender.com', 'https://lottovue-backend.onrender.com')
				// baseURL과 url을 분리하여 다시 설정
				if (httpsUrl.startsWith('https://lottovue-backend.onrender.com/api/')) {
					config.baseURL = 'https://lottovue-backend.onrender.com/api/'
					config.url = config.url?.replace(/^\/api\//, '') || config.url
				}
				console.log('최종 URL이 HTTPS로 강제 변경되었습니다:', config.baseURL + config.url)
			}
		}
		
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
