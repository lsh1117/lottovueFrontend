<template>
	<div class="email-change-password-popup">
		<div class="form-group">
			<label class="label">현재 비밀번호</label>
			<input v-model="form.currentPassword" type="password" class="input" placeholder="현재 비밀번호" />
		</div>

		<div class="form-group">
			<label class="label">새 비밀번호</label>
			<input v-model="form.newPassword" type="password" class="input" placeholder="8자 이상 입력" />
		</div>

		<div class="form-group">
			<label class="label">새 비밀번호 확인</label>
			<input v-model="form.newPasswordConfirm" type="password" class="input" placeholder="새 비밀번호 확인" />
		</div>

		<p v-if="error" class="error-text">{{ error }}</p>

		<div class="btn-area btn-area-center">
			<button class="btn-primary btn-large" :disabled="loading" @click="handleChangePassword">
				{{ loading ? '변경 중...' : '비밀번호 변경' }}
			</button>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { isAuthenticated } from '@/utils/auth'
import loginApi from '@/api/login'

const emit = defineEmits(['close'])
const loading = ref(false)
const error = ref('')
const form = reactive({
	currentPassword: '',
	newPassword: '',
	newPasswordConfirm: '',
})

const handleChangePassword = async () => {
	error.value = ''

	if (!isAuthenticated()) {
		alert('로그인이 필요합니다.')
		emit('close')
		return
	}
	if (!form.currentPassword || !form.newPassword || !form.newPasswordConfirm) {
		error.value = '모든 항목을 입력해주세요.'
		return
	}
	if (form.newPassword.length < 8) {
		error.value = '새 비밀번호는 8자 이상이어야 합니다.'
		return
	}
	if (form.newPassword !== form.newPasswordConfirm) {
		error.value = '새 비밀번호 확인이 일치하지 않습니다.'
		return
	}
	if (form.currentPassword === form.newPassword) {
		error.value = '현재 비밀번호와 다른 비밀번호를 입력해주세요.'
		return
	}

	loading.value = true
	try {
		await loginApi.emailChangePassword({
			current_password: form.currentPassword,
			new_password: form.newPassword,
		})
		window.dispatchEvent(new CustomEvent('lottovue:userUpdated'))
		emit('close')
		alert('비밀번호가 변경되었습니다.')
	} catch (err) {
		error.value = err.response?.data?.detail || '비밀번호 변경에 실패했습니다.'
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
.email-change-password-popup {
	padding: 8px 16px;
}
.form-group { margin-bottom: 14px; }
.label { display: block; margin-bottom: 6px; font-weight: 600; }
.input {
	width: 100%;
	height: 42px;
	padding: 0 12px;
	border: 1px solid #ddd;
	border-radius: 8px;
}
.error-text {
	color: #d32f2f;
	font-size: 14px;
	margin: 6px 0 12px;
}


</style>
