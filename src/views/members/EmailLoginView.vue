<template>
	<div class="EmailLoginView">
		<section class="section section-area">
			<div class="section-header">
				<h4 class="title-big">로그인</h4>
			</div>
			<div class="section-body">
				<div class="box-area">
					<n-card class="login-card" :bordered="false">
						<n-space vertical :size="12">
							<n-alert v-if="showPasswordChangedBanner" type="success" :bordered="false">
								비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.
							</n-alert>

							<n-form label-placement="top">
								<n-form-item label="이메일">
									<n-input
										v-model:value="form.email"
										type="text"
										placeholder="example@email.com"
									/>
								</n-form-item>

								<n-form-item label="비밀번호">
									<n-input
										v-model:value="form.password"
										type="password"
										show-password-on="click"
										placeholder="임시 비밀번호 또는 변경한 비밀번호"
									/>
								</n-form-item>
							</n-form>

							<n-alert v-if="error" type="error" :bordered="false">
								{{ error }}
							</n-alert>

							<n-button type="primary" block :loading="loading" @click="handleLogin">
								로그인
							</n-button>

							<n-space vertical :size="8">
								<n-button type="warning" block :loading="kakaoLoading" @click="handleKakaoLogin">
									카카오 로그인
								</n-button>
							</n-space>

							<n-space justify="center">
								<n-button quaternary type="primary" @click="goToRegister">
									회원가입
								</n-button>
								<n-button quaternary type="primary" @click="openForgotDialog">
									비밀번호 찾기
								</n-button>
							</n-space>
						</n-space>
					</n-card>
				</div>
			</div>
		</section>

		<n-modal v-model:show="showForgotDialog" preset="dialog" title="비밀번호 찾기" positive-text="확인" negative-text="취소" @positive-click="submitForgotPassword" @negative-click="closeForgotDialog">
			<n-space vertical :size="10">
				<n-text depth="2">가입한 이메일을 입력하면 임시 비밀번호를 발송합니다.</n-text>
				<n-input
					v-model:value="forgotEmail"
					type="text"
					placeholder="example@email.com"
					:disabled="forgotLoading"
				/>
				<n-alert v-if="forgotError" type="error" :bordered="false">
					{{ forgotError }}
				</n-alert>
			</n-space>
		</n-modal>
	</div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NAlert, NButton, NCard, NForm, NFormItem, NInput, NModal, NSpace, NText, useMessage } from 'naive-ui'
import { setToken, setUser } from '@/utils/auth'
import loginApi from '@/api/login'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const loading = ref(false)
const kakaoLoading = ref(false)
const error = ref('')
const showPasswordChangedBanner = ref(false)
const showForgotDialog = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotError = ref('')
const form = reactive({
	email: '',
	password: '',
})

const handleLogin = async () => {
	error.value = ''

	if (!form.email || !form.password) {
		error.value = '이메일과 비밀번호를 입력해주세요.'
		return
	}

	loading.value = true
	try {
		await loginApi.emailLogin({
			email: form.email,
			password: form.password,
		})
		window.dispatchEvent(new CustomEvent('lottovue:userUpdated'))
		message.success('로그인되었습니다.')
		router.push('/home')
	} catch (err) {
		error.value = err.response?.data?.detail || '로그인에 실패했습니다.'
	} finally {
		loading.value = false
	}
}

const handleKakaoLogin = () => {
	try {
		kakaoLoading.value = true
		error.value = ''
		const redirectUrl = loginApi.getKakaoLoginRedirectUrl()
		if (!redirectUrl) {
			error.value = '로그인 URL을 가져올 수 없습니다.'
			kakaoLoading.value = false
			return
		}
		const popup = window.open(redirectUrl, '카카오 로그인', 'width=500,height=600,scrollbars=yes,resizable=yes')
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

			if (event.data && event.data.type === 'kakao-login-success') {
				window.removeEventListener('message', messageHandler)
				popup.close()
				try {
					setToken(event.data.token)
					const userInfo = await loginApi.getCurrentUser()
					if (userInfo) {
						setUser(userInfo)
						window.dispatchEvent(new CustomEvent('lottovue:userUpdated'))
						if (event.data.isNewUser) {
							message.success('회원가입이 완료되었습니다! 환영합니다.')
						} else {
							message.success('카카오 로그인이 완료되었습니다.')
						}
						router.push('/home')
					} else {
						error.value = '사용자 정보를 가져오는데 실패했습니다.'
					}
				} catch (err) {
					error.value = err.response?.data?.detail || err.message || '로그인 처리 중 오류가 발생했습니다.'
				} finally {
					kakaoLoading.value = false
				}
			} else if (event.data && event.data.type === 'kakao-login-error') {
				window.removeEventListener('message', messageHandler)
				popup.close()
				error.value = event.data.message || '로그인에 실패했습니다.'
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
		error.value = err.message || '로그인 페이지를 여는데 실패했습니다.'
		kakaoLoading.value = false
	}
}

const goToRegister = () => {
	router.push('/email-register')
}

const openForgotDialog = () => {
	forgotError.value = ''
	forgotEmail.value = form.email || ''
	showForgotDialog.value = true
}

const closeForgotDialog = () => {
	showForgotDialog.value = false
	forgotLoading.value = false
}

const submitForgotPassword = async () => {
	forgotError.value = ''
	if (!forgotEmail.value) {
		forgotError.value = '이메일을 입력해주세요.'
		return
	}
	forgotLoading.value = true
	try {
		const res = await loginApi.emailForgotPassword({ email: forgotEmail.value })
		message.success(res?.message || '요청이 처리되었습니다.')
		if (res?.success) {
			form.email = forgotEmail.value
		}
		closeForgotDialog()
	} catch (err) {
		forgotError.value = err.response?.data?.detail || '요청 처리 중 오류가 발생했습니다.'
	} finally {
		forgotLoading.value = false
	}
}

onMounted(() => {
	const queryEmail = route.query?.email
	if (typeof queryEmail === 'string' && queryEmail.length > 0) {
		form.email = queryEmail
	}
	showPasswordChangedBanner.value = route.query?.passwordChanged === '1'
})
</script>

<style scoped>
.section-header {
	text-align: center;
}

.login-card {
	max-width: 520px;
	margin: 0 auto;
}
</style>
