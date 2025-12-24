<template>
	<div class="InquiryCreateView">
		<div class="inquiry-create-container">
			<div class="inquiry-create-header">
				<h1 class="page-title">문의 등록</h1>
				<button @click="goToList" class="back-btn">← 목록으로</button>
			</div>

			<form @submit.prevent="handleSubmit" class="inquiry-form">
				<div class="form-group">
					<label for="title" class="form-label">제목 <span class="required">*</span></label>
					<input
						id="title"
						v-model="formData.title"
						type="text"
						class="form-input"
						placeholder="문의 제목을 입력하세요"
						required
						maxlength="200"
					/>
				</div>

				<div class="form-group">
					<label for="content" class="form-label">내용 <span class="required">*</span></label>
					<textarea
						id="content"
						v-model="formData.content"
						class="form-textarea"
						rows="10"
						placeholder="문의 내용을 입력하세요"
						required
					></textarea>
				</div>

				<div v-if="error" class="error-message">
					{{ error }}
				</div>

				<div class="form-actions">
					<button type="button" @click="goToList" class="btn-cancel">취소</button>
					<button type="submit" class="btn-submit" :disabled="loading">
						{{ loading ? '등록 중...' : '등록하기' }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { createInquiry } from '@/api/inquiry'
import { isAuthenticated } from '@/utils/auth'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const formData = reactive({
	title: '',
	content: ''
})

const handleSubmit = async () => {
	if (!isAuthenticated()) {
		alert('로그인이 필요합니다.')
		router.push('/home')
		return
	}

	if (!formData.title.trim() || !formData.content.trim()) {
		error.value = '제목과 내용을 모두 입력해주세요.'
		return
	}

	loading.value = true
	error.value = ''

	try {
		await createInquiry({
			title: formData.title.trim(),
			content: formData.content.trim()
		})
		alert('문의가 성공적으로 등록되었습니다.')
		router.push('/inquiry/list')
	} catch (err) {
		console.error('문의 등록 오류:', err)
		error.value = err.response?.data?.detail || '문의 등록에 실패했습니다.'
	} finally {
		loading.value = false
	}
}

const goToList = () => {
	router.push('/inquiry/list')
}
</script>

