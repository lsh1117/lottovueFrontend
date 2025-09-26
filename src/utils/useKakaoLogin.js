export const kakaoLogin = () => {
	return new Promise((resolve, reject) => {
		if (!window.Kakao.isInitialized()) {
			reject('Kakao SDK is not initialized');
			return;
		}

		window.Kakao.Auth.login({
			scope: 'profile_nickname', // 요청 권한
			success: (authObj) => {
				console.log('Authentication successful:', authObj);

				// 사용자 정보 요청
				window.Kakao.API.request({
					url: '/v2/user/me',
					success: (userInfo) => {
						console.log('User info:', userInfo);
						resolve(userInfo);
					},
					fail: (error) => {
						console.error('Failed to get user info:', error);
						reject(error);
					},
				});
			},
			fail: (error) => {
				console.error('Login failed:', error);

				// 모바일 환경에서 intent:// 오류가 발생할 경우 브라우저 fallback URL로 이동
				if (error.error_description.includes('intent:')) {
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
