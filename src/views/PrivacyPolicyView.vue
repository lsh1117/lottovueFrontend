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

			<!-- 개인정보처리방침 목록 -->
			<div v-if="!loading && !error && privacyPolicyList.length > 0" class="privacy-list">
				<div 
					v-for="privacyPolicy in privacyPolicyList" 
					:key="privacyPolicy.id" 
					class="privacy-item"
				>
					<div class="privacy-header">
						<h2 class="privacy-title">{{ privacyPolicy.title || '개인정보처리방침' }}</h2>
						<div class="privacy-meta">
							<span v-if="privacyPolicy.version" class="privacy-version">
								버전: {{ privacyPolicy.version }}
							</span>
							<span v-if="privacyPolicy.effective_date" class="privacy-effective-date">
								시행일: {{ formatDate(privacyPolicy.effective_date) }}
							</span>
							<span v-if="privacyPolicy.updated_at" class="privacy-date">
								{{ formatDate(privacyPolicy.updated_at) }}
							</span>
						</div>
					</div>
					<div 
						class="privacy-content" 
						v-html="privacyPolicy.content || ''"
					></div>
				</div>
			</div>

			<!-- 개인정보처리방침이 없을 때 -->
			<div v-if="!loading && !error && privacyPolicyList.length === 0" class="no-privacy">
				<p>표시할 개인정보처리방침이 없습니다.</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getActivePrivacyPolicy } from '@/api/privacyPolicy'

const loading = ref(false)
const error = ref(null)
const privacyPolicyList = ref([])

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
		
		// 백엔드 API는 배열을 직접 반환하므로 배열인지 확인
		if (Array.isArray(response)) {
			privacyPolicyList.value = response
		} else if (response && Array.isArray(response.data)) {
			// 응답이 객체이고 data 속성이 배열인 경우
			privacyPolicyList.value = response.data
		} else if (response && response.data && !Array.isArray(response.data)) {
			// 응답이 객체이고 data가 단일 객체인 경우
			privacyPolicyList.value = [response.data]
		} else if (response && typeof response === 'object' && !Array.isArray(response)) {
			// 응답이 객체인 경우, items나 results 같은 속성 확인
			privacyPolicyList.value = response.items || response.results || response.privacyPolicy || [response]
		} else {
			privacyPolicyList.value = []
		}
		
		// 활성화된 개인정보처리방침만 필터링 (추가 안전장치)
		privacyPolicyList.value = privacyPolicyList.value.filter(policy => policy.is_active === true)
		
		//console.log('개인정보처리방침 목록:', privacyPolicyList.value)
		
		if (privacyPolicyList.value.length === 0) {
			console.warn('활성화된 개인정보처리방침이 없습니다.')
		}
	} catch (err) {
		console.error('개인정보처리방침 로드 실패:', err)
		console.error('에러 상세:', {
			message: err.message,
			response: err.response,
			data: err.response?.data,
			status: err.response?.status,
			statusText: err.response?.statusText,
			url: err.config?.url
		})
		error.value = err.response?.data?.detail || err.message || '개인정보처리방침을 불러오는데 실패했습니다.'
		privacyPolicyList.value = []
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

