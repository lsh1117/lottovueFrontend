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
				<div v-if="error" class="error-message" style="margin-top: 10px; color: red; text-align: center;">
					{{ error }}
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { kakaoLogin } from '@/utils/useKakaoLogin';
	import loginApi from '@/api/login';
	import { getUser, logout as authLogout } from '@/utils/auth';

	const router = useRouter();
	const user = ref(null);
	const isLoading = ref(false);
	const error = ref(null);

	// 로그인 처리
	const handleLogin = async () => {
		isLoading.value = true;
		error.value = null;
		
		try {
			// 1. 카카오 SDK로 로그인하여 액세스 토큰 받기
			const kakaoAccessToken = await kakaoLogin();
			console.log('Kakao access token received');
			
			// 2. 백엔드 API로 카카오 로그인 요청
			const response = await loginApi.kakaoLogin(kakaoAccessToken);
			console.log('Backend login response:', response);
			
			// 3. 사용자 정보 저장
			if (response.user) {
				user.value = response.user;
				// 로그인 성공 후 홈으로 이동
				router.push('/home');
			}
		} catch (err) {
			console.error('Login error:', err);
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

	// 컴포넌트 마운트 시 저장된 사용자 정보 확인
	onMounted(() => {
		const savedUser = getUser();
		if (savedUser) {
			user.value = savedUser;
		}
	});
</script>
