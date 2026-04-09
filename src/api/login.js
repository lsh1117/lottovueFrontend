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
		// account_email scope가 비활성인 앱에서도 동작하도록 최소 scope만 요청
		const scope = encodeURIComponent('profile_nickname')
		const url = `${http.defaults.baseURL}auth/kakao/signup/redirect?scope=${scope}`
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
	 * 이메일 회원가입 (닉네임 + 이메일)
	 * @param {{nickname: string, email: string}} payload
	 * @returns {Promise}
	 */
	emailRegister: async function (payload) {
		try {
			const response = await http.post('/auth/email/register', payload)
			if (response.access_token) {
				setToken(response.access_token)
			}
			if (response.user) {
				setUser(response.user)
			}
			return response
		} catch (error) {
			console.error('Email register error:', error)
			throw error
		}
	},

	/**
	 * 이메일 로그인
	 * @param {{email: string, password: string}} payload
	 * @returns {Promise}
	 */
	emailLogin: async function (payload) {
		try {
			const response = await http.post('/auth/email/login', payload)
			if (response.access_token) {
				setToken(response.access_token)
			}
			if (response.user) {
				setUser(response.user)
			}
			return response
		} catch (error) {
			console.error('Email login error:', error)
			throw error
		}
	},

	/**
	 * 이메일 비밀번호 변경
	 * @param {{current_password: string, new_password: string}} payload
	 * @returns {Promise}
	 */
	emailChangePassword: async function (payload) {
		try {
			const response = await http.post('/auth/email/change-password', payload)
			if (response) {
				setUser(response)
			}
			return response
		} catch (error) {
			console.error('Email change password error:', error)
			throw error
		}
	},

	/**
	 * 이메일 비밀번호 찾기 (임시 비밀번호 발송)
	 * @param {{email: string}} payload
	 * @returns {Promise}
	 */
	emailForgotPassword: async function (payload) {
		try {
			const response = await http.post('/auth/email/forgot-password', payload)
			return response
		} catch (error) {
			console.error('Email forgot password error:', error)
			throw error
		}
	},

	/**
	 * 내 계정 이메일 인증코드 발송
	 * @param {{email: string}} payload
	 * @returns {Promise<{success: boolean, message: string, ttl_seconds: number}>}
	 */
	sendMyEmailVerificationCode: async function (payload) {
		try {
			const response = await http.post('/users/me/email-verification/send', payload)
			return response
		} catch (error) {
			console.error('Send email verification code error:', error)
			throw error
		}
	},

	/**
	 * 내 계정 이메일 인증코드 확인 및 이메일 등록
	 * @param {{email: string, code: string}} payload
	 * @returns {Promise}
	 */
	confirmMyEmailVerificationCode: async function (payload) {
		try {
			const response = await http.post('/users/me/email-verification/confirm', payload)
			if (response) {
				setUser(response)
			}
			return response
		} catch (error) {
			console.error('Confirm email verification code error:', error)
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
