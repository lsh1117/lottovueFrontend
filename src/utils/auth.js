// 인증 관련 유틸리티 함수

const TOKEN_KEY = 'lottovue_access_token'
const USER_KEY = 'lottovue_user'

/**
 * JWT 토큰 저장
 */
export const setToken = (token) => {
	if (token) {
		localStorage.setItem(TOKEN_KEY, token)
	} else {
		localStorage.removeItem(TOKEN_KEY)
	}
}

/**
 * JWT 토큰 가져오기
 */
export const getToken = () => {
	return localStorage.getItem(TOKEN_KEY)
}

/**
 * 사용자 정보 저장
 */
export const setUser = (user) => {
	if (user) {
		localStorage.setItem(USER_KEY, JSON.stringify(user))
	} else {
		localStorage.removeItem(USER_KEY)
	}
}

/**
 * 사용자 정보 가져오기
 */
export const getUser = () => {
	const userStr = localStorage.getItem(USER_KEY)
	return userStr ? JSON.parse(userStr) : null
}

/**
 * 로그아웃 (토큰 및 사용자 정보 제거)
 */
export const logout = () => {
	localStorage.removeItem(TOKEN_KEY)
	localStorage.removeItem(USER_KEY)
}

/**
 * 로그인 여부 확인
 */
export const isAuthenticated = () => {
	return !!getToken()
}

