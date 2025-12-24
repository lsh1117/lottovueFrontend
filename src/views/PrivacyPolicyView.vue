<template>
	<div class="PrivacyPolicyView">
		<div class="privacy-container">
			<!-- 로딩 상태 -->
			<div v-if="loading" class="loading">
				<p>개인정보처리방침을 불러오는 중...</p>
			</div>

			<!-- 에러 상태 -->
			<div v-if="error" class="error">
				<p><strong>오류가 발생했습니다.</strong></p>
				<p>{{ error }}</p>
				<button @click="loadPrivacyPolicy" class="retry-button">다시 시도</button>
			</div>

			<!-- 개인정보처리방침 내용 -->
			<div v-if="!loading && !error && privacyPolicy" class="privacy-content-wrapper">
				<div class="privacy-header">
					<h1 class="privacy-title">{{ privacyPolicy.title || '개인정보처리방침' }}</h1>
					<div class="privacy-meta">
						<span v-if="privacyPolicy.version" class="privacy-version">
							버전: {{ privacyPolicy.version }}
						</span>
						<span v-if="privacyPolicy.effective_date" class="privacy-effective-date">
							시행일: {{ formatDate(privacyPolicy.effective_date) }}
						</span>
						<span v-if="privacyPolicy.updated_at" class="privacy-date">
							최종 수정일: {{ formatDate(privacyPolicy.updated_at) }}
						</span>
					</div>
				</div>
				<div 
					class="privacy-content" 
					v-html="privacyPolicy.content || ''"
				></div>
			</div>

			<!-- 개인정보처리방침이 없을 때 -->
			<div v-if="!loading && !error && !privacyPolicy" class="no-privacy">
				<p>개인정보처리방침이 없습니다.</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getActivePrivacyPolicy } from '@/api/privacyPolicy'

const loading = ref(false)
const error = ref(null)
const privacyPolicy = ref(null)

/**
 * 개인정보처리방침 로드
 */
async function loadPrivacyPolicy() {
	loading.value = true
	error.value = null
	
	try {
		//console.log('개인정보처리방침 조회 시작')
		const response = await getActivePrivacyPolicy()
		
		//console.log('개인정보처리방침 API 응답:', response)
		
		// 응답이 객체면 그대로 사용, 배열이면 첫 번째 항목 사용
		if (response && typeof response === 'object') {
			if (Array.isArray(response)) {
				privacyPolicy.value = response.length > 0 ? response[0] : null
			} else if (response.data) {
				privacyPolicy.value = response.data
			} else {
				privacyPolicy.value = response
			}
		} else {
			privacyPolicy.value = null
		}
		
		//console.log('개인정보처리방침:', privacyPolicy.value)
		
		if (!privacyPolicy.value) {
			console.warn('개인정보처리방침이 없습니다.')
		}
	} catch (err) {
		console.error('개인정보처리방침 로드 실패:', err)
		error.value = err.response?.data?.detail || err.message || '개인정보처리방침을 불러오는데 실패했습니다.'
		privacyPolicy.value = null
	} finally {
		loading.value = false
	}
}

/**
 * 날짜 포맷팅
 */
function formatDate(dateString) {
	if (!dateString) return ''
	const date = new Date(dateString)
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
}

onMounted(async () => {
	await loadPrivacyPolicy()
})
</script>

