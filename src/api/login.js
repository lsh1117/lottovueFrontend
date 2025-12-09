import http from '@/api/base'
import { setToken, setUser } from '@/utils/auth'

export default {
	/**
	 * 카카오 로그인
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
	 * 카카오 회원가입
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
