<template>
	<div>
		<section class="section section-area">
			<div v-if="user" class="section-body">
				<div>
					<p>로그인 성공!</p>
					<p>닉네임: {{ user.nickname }}</p>
					<p>이메일: {{ user.email || '이메일 미제공' }}</p>
					<p>플랜: {{ user.plan }}</p>
					<p>크레딧: {{ user.credits }}개</p>
					<div class="btn-area btn-area-center" style="margin-top: 20px;">
						<button class="btn-primary btn-small" @click="handleLogout">로그아웃</button>
					</div>
				</div>
			</div>
			<div v-else class="section-footer">
				<div class="btn-area btn-area-center">
					<button class="btn-primary btn-small" @click="handleLogin" :disabled="isLoading">
						{{ isLoading ? '로그인 중...' : '카카오 로그인' }}
					</button>
				</div>
				<div class="btn-area btn-area-center" style="margin-top: 10px;">
					<button class="btn-secondary btn-small" @click="handleSignup" :disabled="isLoading">
						{{ isLoading ? '회원가입 중...' : '카카오 회원가입' }}
					</button>
				</div>
				<div v-if="error" class="error-message" style="margin-top: 10px; color: red; text-align: center;">
					{{ error }}
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import { useRouter, useRoute } from 'vue-router';
	import loginApi from '@/api/login';
	import { getUser, logout as authLogout } from '@/utils/auth';

	const router = useRouter();
	const route = useRoute();
	const user = ref(null);
	const isLoading = ref(false);
	const error = ref(null);

	// 카카오 로그인 처리 (새 창으로 열기)
	const handleLogin = () => {
		try {
			isLoading.value = true;
			error.value = null;
			
			const redirectUrl = loginApi.getKakaoLoginRedirectUrl();
			console.log('카카오 로그인 URL:', redirectUrl);
			
			if (!redirectUrl) {
				error.value = '로그인 URL을 가져올 수 없습니다.';
				isLoading.value = false;
				return;
			}
			
			const popup = window.open(
				redirectUrl,
				'카카오 로그인',
				'width=500,height=600,scrollbars=yes,resizable=yes'
			);
			
			if (!popup) {
				error.value = '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.';
				isLoading.value = false;
				return;
			}
			
			// 새 창에서 메시지 받기
			const messageHandler = async (event) => {
				// 보안을 위해 origin 확인 (실제 운영 환경에서는 더 엄격하게)
				if (event.origin !== window.location.origin && !event.origin.includes('localhost')) {
					return;
				}
				
				if (event.data && event.data.type === 'kakao-login-success') {
					window.removeEventListener('message', messageHandler);
					popup.close();
					
					try {
						// JWT 토큰 저장
						const { setToken, setUser } = await import('@/utils/auth');
						setToken(event.data.token);
						
						// 사용자 정보 조회
						const loginApiModule = (await import('@/api/login')).default;
						const userInfo = await loginApiModule.getCurrentUser();
						
						if (userInfo) {
							setUser(userInfo);
							user.value = userInfo;
							
							// 신규 회원가입인 경우 안내 메시지 표시
							if (event.data.isNewUser) {
								// 간단한 알림 (실제로는 toast나 모달을 사용하는 것이 좋음)
								alert('회원가입이 완료되었습니다! 환영합니다.');
							}
							
							// 로그인 성공 후 홈으로 이동
							router.push('/home');
						} else {
							error.value = '사용자 정보를 가져오는데 실패했습니다.';
						}
					} catch (err) {
						console.error('Login success handler error:', err);
						error.value = err.response?.data?.detail || err.message || '로그인 처리 중 오류가 발생했습니다.';
					} finally {
						isLoading.value = false;
					}
				} else if (event.data && event.data.type === 'kakao-login-error') {
					window.removeEventListener('message', messageHandler);
					popup.close();
					error.value = event.data.message || '로그인에 실패했습니다.';
					isLoading.value = false;
				}
			};
			
			window.addEventListener('message', messageHandler);
			
			// 팝업이 닫혔는지 확인
			const checkClosed = setInterval(() => {
				if (popup.closed) {
					clearInterval(checkClosed);
					window.removeEventListener('message', messageHandler);
					if (isLoading.value) {
						isLoading.value = false;
					}
				}
			}, 1000);
		} catch (err) {
			console.error('Login redirect error:', err);
			error.value = err.message || '로그인 페이지를 여는데 실패했습니다.';
			isLoading.value = false;
		}
	};

	// 카카오 회원가입 처리 (새 창으로 열기)
	const handleSignup = () => {
		try {
			isLoading.value = true;
			error.value = null;
			
			const redirectUrl = loginApi.getKakaoSignupRedirectUrl();
			console.log('카카오 회원가입 URL:', redirectUrl);
			
			if (!redirectUrl) {
				error.value = '회원가입 URL을 가져올 수 없습니다.';
				isLoading.value = false;
				return;
			}
			
			const popup = window.open(
				redirectUrl,
				'카카오 회원가입',
				'width=500,height=600,scrollbars=yes,resizable=yes'
			);
			
			if (!popup) {
				error.value = '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.';
				isLoading.value = false;
				return;
			}
			
			// 새 창에서 메시지 받기
			const messageHandler = async (event) => {
				// 보안을 위해 origin 확인 (실제 운영 환경에서는 더 엄격하게)
				if (event.origin !== window.location.origin && !event.origin.includes('localhost')) {
					return;
				}
				
				if (event.data && event.data.type === 'kakao-signup-success') {
					window.removeEventListener('message', messageHandler);
					popup.close();
					
					try {
						// JWT 토큰 저장
						const { setToken, setUser } = await import('@/utils/auth');
						setToken(event.data.token);
						
						// 사용자 정보 조회
						const loginApiModule = (await import('@/api/login')).default;
						const userInfo = await loginApiModule.getCurrentUser();
						
						if (userInfo) {
							setUser(userInfo);
							user.value = userInfo;
							// 회원가입 성공 후 홈으로 이동
							router.push('/home');
						} else {
							error.value = '사용자 정보를 가져오는데 실패했습니다.';
						}
					} catch (err) {
						console.error('Signup success handler error:', err);
						error.value = err.response?.data?.detail || err.message || '회원가입 처리 중 오류가 발생했습니다.';
					} finally {
						isLoading.value = false;
					}
				} else if (event.data && event.data.type === 'kakao-signup-error') {
					window.removeEventListener('message', messageHandler);
					popup.close();
					error.value = event.data.message || '회원가입에 실패했습니다.';
					isLoading.value = false;
				}
			};
			
			window.addEventListener('message', messageHandler);
			
			// 팝업이 닫혔는지 확인
			const checkClosed = setInterval(() => {
				if (popup.closed) {
					clearInterval(checkClosed);
					window.removeEventListener('message', messageHandler);
					if (isLoading.value) {
						isLoading.value = false;
					}
				}
			}, 1000);
		} catch (err) {
			console.error('Signup redirect error:', err);
			error.value = err.message || '회원가입 페이지를 여는데 실패했습니다.';
			isLoading.value = false;
		}
	};

	// 카카오 콜백 처리 (백엔드에서 리다이렉트된 경우)
	const handleCallback = async () => {
		isLoading.value = true;
		error.value = null;

		try {
			// 백엔드에서 리다이렉트된 경우 token 파라미터 확인
			const token = route.query.token;
			const success = route.query.success;
			const callbackType = route.query.type;

			if (success === 'true' && token) {
				// JWT 토큰 저장
				const { setToken, setUser } = await import('@/utils/auth');
				setToken(token);

				// 사용자 정보 조회
				const loginApi = (await import('@/api/login')).default;
				const userInfo = await loginApi.getCurrentUser();
				
				if (userInfo) {
					setUser(userInfo);
					user.value = userInfo;
					
					// 신규 회원가입인 경우 안내 메시지 표시
					const isNewUser = route.query.isNewUser === 'true';
					if (isNewUser) {
						// 간단한 알림 (실제로는 toast나 모달을 사용하는 것이 좋음)
						alert('회원가입이 완료되었습니다! 환영합니다.');
					}
					
					// 로그인 성공 후 홈으로 이동
					router.push('/home');
				} else {
					error.value = '사용자 정보를 가져오는데 실패했습니다.';
				}
			} else {
				// 기존 방식: code 파라미터로 처리
				const code = route.query.code;
				const isSignup = route.path.includes('signup') || callbackType === 'signup';

				if (!code) {
					error.value = '인증 코드가 제공되지 않았습니다.';
					isLoading.value = false;
					return;
				}

				let response;
				if (isSignup) {
					response = await loginApi.kakaoSignupCallback(code);
				} else {
					response = await loginApi.kakaoLoginCallback(code);
				}

				if (response.user) {
					user.value = response.user;
					// 로그인 성공 후 홈으로 이동
					router.push('/home');
				}
			}
		} catch (err) {
			console.error('Callback error:', err);
			error.value = err.response?.data?.detail || err.message || '로그인에 실패했습니다.';
		} finally {
			isLoading.value = false;
		}
	};

	// 로그아웃 처리
	const handleLogout = () => {
		authLogout();
		user.value = null;
		router.push('/login');
	};

	// 컴포넌트 마운트 시 처리
	onMounted(async () => {
		// 저장된 사용자 정보 확인
		const savedUser = getUser();
		if (savedUser) {
			user.value = savedUser;
		}

		// URL에 token 또는 code 파라미터가 있으면 콜백 처리
		if (route.query.token || route.query.code) {
			await handleCallback();
		}
	});
</script>
