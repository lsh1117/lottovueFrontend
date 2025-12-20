// 인증 관련 유틸리티 함수

const TOKEN_KEY = 'lottovue_access_token'
const USER_KEY = 'lottovue_user'

/**
 * JWT 토큰 저장
 */
export const setToken = (token) => {
	if (token) {
		sessionStorage.setItem(TOKEN_KEY, token)
	} else {
		sessionStorage.removeItem(TOKEN_KEY)
	}
}

/**
 * JWT 토큰 가져오기
 */
export const getToken = () => {
	return sessionStorage.getItem(TOKEN_KEY)
}

/**
 * 사용자 정보 저장
 */
export const setUser = (user) => {
	if (user) {
		sessionStorage.setItem(USER_KEY, JSON.stringify(user))
	} else {
		sessionStorage.removeItem(USER_KEY)
	}
}

/**
 * 사용자 정보 가져오기
 */
export const getUser = () => {
	const userStr = sessionStorage.getItem(USER_KEY)
	return userStr ? JSON.parse(userStr) : null
}

/**
 * 로그아웃 (토큰 및 사용자 정보 제거)
 */
export const logout = () => {
	sessionStorage.removeItem(TOKEN_KEY)
	sessionStorage.removeItem(USER_KEY)
}

/**
 * 로그인 여부 확인
 */
export const isAuthenticated = () => {
	return !!getToken()
}

