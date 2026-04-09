<template>
	<div class="EmailRegisterView">
		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">회원가입</h4>
			</div>
			<div class="section-body">
				<div class="box-area">
					<n-card class="register-card" :bordered="false">
						<n-space vertical :size="12">
							<n-alert type="info" :bordered="false">
								회원가입 시 임시 비밀번호(숫자 8자리)가 이메일로 발송됩니다.
							</n-alert>

							<n-form label-placement="top">
								<n-form-item label="닉네임">
									<n-input
										v-model:value="form.nickname"
										type="text"
										placeholder="닉네임을 입력하세요"
									/>
								</n-form-item>

								<n-form-item label="이메일">
									<n-input
										v-model:value="form.email"
										type="text"
										placeholder="example@email.com"
									/>
								</n-form-item>
							</n-form>

							<n-alert v-if="error" type="error" :bordered="false">
								{{ error }}
							</n-alert>

							<n-button type="primary" block :loading="loading" @click="handleRegister">
								가입하기
							</n-button>

							<n-button type="warning" block :loading="kakaoLoading" @click="handleKakaoSignup">
								카카오 회원가입
							</n-button>

							<n-space justify="center">
								<n-button type="primary" @click="goToLogin">
									로그인
								</n-button>
							</n-space>
						</n-space>
					</n-card>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NAlert, NButton, NCard, NForm, NFormItem, NInput, NSpace, useMessage } from 'naive-ui'
import { logout, setToken, setUser } from '@/utils/auth'
import loginApi from '@/api/login'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const loading = ref(false)
const kakaoLoading = ref(false)
const error = ref('')
const form = reactive({
	nickname: '',
	email: '',
})
const postRegisterRedirectPath = computed(() => {
	const redirectPath = route.query?.redirect
	return typeof redirectPath === 'string' && redirectPath.startsWith('/') ? redirectPath : '/home'
})

const handleRegister = async () => {
	error.value = ''

	if (!form.nickname || !form.email) {
		error.value = '닉네임과 이메일을 입력해주세요.'
		return
	}

	loading.value = true
	try {
		await loginApi.emailRegister({
			nickname: form.nickname.trim(),
			email: form.email.trim(),
		})
		logout()
		message.success('회원가입이 완료되었습니다. 이메일로 받은 임시 비밀번호로 로그인해주세요.')
		router.push({
			path: '/email-login',
			query: { email: form.email.trim(), redirect: postRegisterRedirectPath.value },
		})
	} catch (err) {
		error.value = err.response?.data?.detail || '회원가입에 실패했습니다.'
	} finally {
		loading.value = false
	}
}

const goToLogin = () => {
	router.push({
		path: '/email-login',
		query: {
			email: form.email || undefined,
			redirect: postRegisterRedirectPath.value,
		},
	})
}

const handleKakaoSignup = () => {
	try {
		kakaoLoading.value = true
		error.value = ''
		const redirectUrl = loginApi.getKakaoSignupRedirectUrl()
		if (!redirectUrl) {
			error.value = '회원가입 URL을 가져올 수 없습니다.'
			kakaoLoading.value = false
			return
		}

		const popup = window.open(redirectUrl, '카카오 회원가입', 'width=500,height=600,scrollbars=yes,resizable=yes')
		if (!popup) {
			error.value = '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.'
			kakaoLoading.value = false
			return
		}

		const messageHandler = async (event) => {
			const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8030/api/'
			const backendOrigin = apiBaseUrl.replace('/api/', '').replace(/\/$/, '')
			const allowedOrigins = [window.location.origin, 'http://localhost:8030', 'https://lottovue-backend.onrender.com', backendOrigin].filter(Boolean)
			const isAllowedOrigin = allowedOrigins.some(origin => event.origin === origin || event.origin.startsWith(origin) || origin.includes(event.origin.split(':')[0]))
			if (!isAllowedOrigin && !import.meta.env.DEV) return

			if (event.data && event.data.type === 'kakao-signup-success') {
				window.removeEventListener('message', messageHandler)
				popup.close()
				try {
					setToken(event.data.token)
					const userInfo = await loginApi.getCurrentUser()
					if (userInfo) {
						setUser(userInfo)
						window.dispatchEvent(new CustomEvent('lottovue:userUpdated'))
						message.success('카카오 회원가입이 완료되었습니다.')
						router.push(postRegisterRedirectPath.value)
					} else {
						error.value = '사용자 정보를 가져오는데 실패했습니다.'
					}
				} catch (err) {
					error.value = err.response?.data?.detail || err.message || '회원가입 처리 중 오류가 발생했습니다.'
				} finally {
					kakaoLoading.value = false
				}
			} else if (event.data && event.data.type === 'kakao-signup-error') {
				window.removeEventListener('message', messageHandler)
				popup.close()
				error.value = event.data.message || '회원가입에 실패했습니다.'
				kakaoLoading.value = false
			}
		}

		window.addEventListener('message', messageHandler)
		const checkClosed = setInterval(() => {
			if (popup.closed) {
				clearInterval(checkClosed)
				window.removeEventListener('message', messageHandler)
				if (kakaoLoading.value) kakaoLoading.value = false
			}
		}, 1000)
	} catch (err) {
		error.value = err.message || '회원가입 페이지를 여는데 실패했습니다.'
		kakaoLoading.value = false
	}
}
</script>

<style scoped>
.section-header {
	text-align: center;
}

.register-card {
	max-width: 520px;
	margin: 0 auto;
}
</style>
