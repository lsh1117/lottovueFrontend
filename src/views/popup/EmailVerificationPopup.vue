<template>
	<div class="email-verification-popup">
		<div class="form-group">
			<label class="label">이메일 주소</label>
			<input
				v-model.trim="email"
				type="email"
				class="input"
				placeholder="example@email.com"
				:disabled="loading || verifying"
			/>
		</div>

		<div class="btn-area btn-area-center" style="margin-top: 6px;">
			<button class="btn-primary btn-small" :disabled="loading || !email" @click="requestCode">
				{{ loading ? '요청 중...' : '인증 요청' }}
			</button>
		</div>

		<p v-if="requested" class="guide-text">
			인증코드를 발송했습니다. 남은 시간: <strong>{{ remainSeconds }}초</strong>
		</p>

		<div v-if="requested" class="form-group">
			<label class="label">인증 번호(8자리)</label>
			<input
				v-model.trim="code"
				type="text"
				maxlength="8"
				class="input"
				placeholder="8자리 숫자 입력"
				:disabled="verifying || remainSeconds <= 0"
			/>
		</div>

		<div v-if="requested" class="btn-area btn-area-center" style="margin-top: 6px;">
			<button
				class="btn-primary btn-small"
				:disabled="verifying || remainSeconds <= 0 || code.length !== 8"
				@click="verifyCode"
			>
				{{ verifying ? '인증 중...' : '인증하기' }}
			</button>
		</div>

		<p v-if="error" class="error-text">{{ error }}</p>
	</div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import loginApi from '@/api/login'

const emit = defineEmits(['close'])
const email = ref('')
const code = ref('')
const loading = ref(false)
const verifying = ref(false)
const requested = ref(false)
const remainSeconds = ref(0)
const error = ref('')
let timerId = null

const clearTimer = () => {
	if (timerId) {
		clearInterval(timerId)
		timerId = null
	}
}

const startTimer = (ttl) => {
	clearTimer()
	remainSeconds.value = ttl
	timerId = setInterval(() => {
		remainSeconds.value -= 1
		if (remainSeconds.value <= 0) {
			clearTimer()
			remainSeconds.value = 0
		}
	}, 1000)
}

const requestCode = async () => {
	error.value = ''
	if (!email.value) {
		error.value = '이메일을 입력해주세요.'
		return
	}
	loading.value = true
	try {
		const res = await loginApi.sendMyEmailVerificationCode({ email: email.value })
		requested.value = true
		code.value = ''
		startTimer(Number(res?.ttl_seconds || 60))
		alert(res?.message || '인증코드를 발송했습니다.')
	} catch (err) {
		error.value = err.response?.data?.detail || '인증코드 발송에 실패했습니다.'
	} finally {
		loading.value = false
	}
}

const verifyCode = async () => {
	error.value = ''
	if (remainSeconds.value <= 0) {
		error.value = '인증 시간이 만료되었습니다. 다시 요청해주세요.'
		return
	}
	if (code.value.length !== 8) {
		error.value = '인증 번호 8자리를 입력해주세요.'
		return
	}
	verifying.value = true
	try {
		await loginApi.confirmMyEmailVerificationCode({
			email: email.value,
			code: code.value,
		})
		window.dispatchEvent(new CustomEvent('lottovue:userUpdated'))
		clearTimer()
		emit('close')
		alert('이메일 인증이 완료되었습니다.')
	} catch (err) {
		error.value = err.response?.data?.detail || '이메일 인증에 실패했습니다.'
	} finally {
		verifying.value = false
	}
}

onUnmounted(() => {
	clearTimer()
})
</script>

<style scoped>
.email-verification-popup {
	padding: 8px 0;
}
.form-group { margin-bottom: 12px; }
.label { display: block; margin-bottom: 6px; font-weight: 600; }
.input {
	width: 100%;
	height: 42px;
	padding: 0 12px;
	border: 1px solid #ddd;
	border-radius: 8px;
}
.guide-text {
	margin: 10px 0 8px;
	font-size: 13px;
	color: #4a5bb5;
}
.error-text {
	color: #d32f2f;
	font-size: 14px;
	margin-top: 10px;
}
</style>
