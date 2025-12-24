import http from '@/api/base'
import { setToken, setUser } from '@/utils/auth'

export default {
	/**
	 * 카카오 로그인 리다이렉트 URL 가져오기
	 * 프론트엔드는 백엔드 API 엔드포인트만 호출하고, redirect URI는 백엔드에서 관리
	 * @returns {string} 백엔드 카카오 로그인 리다이렉트 API URL
	 */
	getKakaoLoginRedirectUrl: function () {
		// 백엔드 API 엔드포인트만 호출 (redirect URI는 백엔드에서 관리)
		const url = http.defaults.baseURL + 'auth/kakao/login/redirect'
		//console.log('카카오 로그인 API 호출:', url)
		return url
	},
	
	/**
	 * 카카오 회원가입 리다이렉트 URL 가져오기
	 * 프론트엔드는 백엔드 API 엔드포인트만 호출하고, redirect URI는 백엔드에서 관리
	 * @returns {string} 백엔드 카카오 회원가입 리다이렉트 API URL
	 */
	getKakaoSignupRedirectUrl: function () {
		// 백엔드 API 엔드포인트만 호출 (redirect URI는 백엔드에서 관리)
		const url = http.defaults.baseURL + 'auth/kakao/signup/redirect'
		//console.log('카카오 회원가입 API 호출:', url)
		return url
	},
	
	/**
	 * 카카오 로그인 콜백 처리
	 * @param {string} code - 카카오 인증 코드
	 * @returns {Promise} 로그인 결과 (JWT 토큰 및 사용자 정보)
	 */
	kakaoLoginCallback: async function (code) {
		try {
			const response = await http.get('/auth/kakao/login/callback', {
				params: { code }
			})
			
			// JWT 토큰 및 사용자 정보 저장
			if (response.access_token) {
				setToken(response.access_token)
			}
			if (response.user) {
				setUser(response.user)
			}
			
			return response
		} catch (error) {
			console.error('Kakao login callback error:', error)
			throw error
		}
	},
	
	/**
	 * 카카오 회원가입 콜백 처리
	 * @param {string} code - 카카오 인증 코드
	 * @returns {Promise} 회원가입 결과 (JWT 토큰 및 사용자 정보)
	 */
	kakaoSignupCallback: async function (code) {
		try {
			const response = await http.get('/auth/kakao/signup/callback', {
				params: { code }
			})
			
			// JWT 토큰 및 사용자 정보 저장
			if (response.access_token) {
				setToken(response.access_token)
			}
			if (response.user) {
				setUser(response.user)
			}
			
			return response
		} catch (error) {
			console.error('Kakao signup callback error:', error)
			throw error
		}
	},
	
	/**
	 * 카카오 로그인 (기존 방식 - 액세스 토큰 직접 전달)
	 * @param {string} accessToken - 카카오 액세스 토큰
	 * @returns {Promise} 로그인 결과 (JWT 토큰 및 사용자 정보)
	 */
	kakaoLogin: async function (accessToken) {
		try {
			const response = await http.post('/auth/kakao/login', {
				access_token: accessToken
			})
			
			// JWT 토큰 및 사용자 정보 저장
			if (response.access_token) {
				setToken(response.access_token)
			}
			if (response.user) {
				setUser(response.user)
			}
			
			return response
		} catch (error) {
			console.error('Kakao login error:', error)
			throw error
		}
	},
	
	/**
	 * 카카오 회원가입 (기존 방식 - 액세스 토큰 직접 전달)
	 * @param {string} accessToken - 카카오 액세스 토큰
	 * @returns {Promise} 회원가입 결과 (JWT 토큰 및 사용자 정보)
	 */
	kakaoRegister: async function (accessToken) {
		try {
			const response = await http.post('/auth/kakao/register', {
				access_token: accessToken
			})
			
			// JWT 토큰 및 사용자 정보 저장
			if (response.access_token) {
				setToken(response.access_token)
			}
			if (response.user) {
				setUser(response.user)
			}
			
			return response
		} catch (error) {
			console.error('Kakao register error:', error)
			throw error
		}
	},
	
	/**
	 * 현재 로그인한 사용자 정보 조회
	 * @returns {Promise} 사용자 정보
	 */
	getCurrentUser: async function () {
		try {
			const response = await http.get('/auth/me')
			if (response) {
				setUser(response)
			}
			return response
		} catch (error) {
			console.error('Get current user error:', error)
			throw error
		}
	}
}
