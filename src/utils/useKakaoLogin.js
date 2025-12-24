/**
 * 카카오 로그인하여 액세스 토큰을 가져옵니다.
 * @returns {Promise<string>} 카카오 액세스 토큰
 */
export const kakaoLogin = () => {
	return new Promise((resolve, reject) => {
		if (!window.Kakao.isInitialized()) {
			reject('Kakao SDK is not initialized');
			return;
		}

		window.Kakao.Auth.login({
			scope: 'profile_nickname,account_email', // 요청 권한
			success: (authObj) => {
				//console.log('Kakao authentication successful:', authObj);
				
				// 액세스 토큰 반환
				const accessToken = authObj.access_token;
				if (accessToken) {
					resolve(accessToken);
				} else {
					reject('Access token not found');
				}
			},
			fail: (error) => {
				console.error('Kakao login failed:', error);

				// 모바일 환경에서 intent:// 오류가 발생할 경우 브라우저 fallback URL로 이동
				if (error.error_description && error.error_description.includes('intent:')) {
					const fallbackUrl = error.error_description.match(/S.browser_fallback_url=([^;]*)/)?.[1];
					if (fallbackUrl) {
						window.location.href = decodeURIComponent(fallbackUrl);
					}
				}

				reject(error);
			},
		});
	});
};
