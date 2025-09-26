<template>
	<div>
		<section class="section section-area">
			<div v-if="user" class="section-body">
				<div>
					<p>로그인 성공!</p>
					<p>이름: {{ user.kakao_account.profile.nickname }}</p>
				</div>
			</div>
			<div v-else class="section-footer">
				<div class="btn-area btn-area-center">
					<button class="btn-primary btn-small" @click="handleLogin">카카오 로그인</button>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	import {ref} from 'vue';
	import {kakaoLogin} from '@/utils/useKakaoLogin';

	const user = ref(null);

	const handleLogin = async () => {
		try {
			const userInfo = await kakaoLogin();
			user.value = userInfo;
		} catch (error) {
			console.error('Login error:', error);
		}
	};

</script>
