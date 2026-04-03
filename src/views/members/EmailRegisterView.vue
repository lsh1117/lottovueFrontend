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

							<n-space justify="center">
								<n-button type="primary" block :loading="loading" @click="handleRegister">
									가입하기
								</n-button>
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NAlert, NButton, NCard, NForm, NFormItem, NInput, NSpace, useMessage } from 'naive-ui'
import { logout } from '@/utils/auth'
import loginApi from '@/api/login'

const router = useRouter()
const message = useMessage()
const loading = ref(false)
const error = ref('')
const form = reactive({
	nickname: '',
	email: '',
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
			query: { email: form.email.trim() },
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
		query: { email: form.email || undefined },
	})
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
