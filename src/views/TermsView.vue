<template>
	<div class="TermsView">
		<div class="terms-container">
			<!-- 약관 그룹 선택 (쿼리 파라미터로 그룹이 지정되지 않았을 때만 표시) -->
			<div class="terms-group-selector" v-if="termGroups.length > 0 && !route.query.group">
				<label for="term-group">약관 그룹:</label>
				<select id="term-group" v-model="selectedTermGroup" @change="loadTerms">
					<option value="">전체</option>
					<option v-for="group in termGroups" :key="group.code" :value="group.code">
						{{ group.code_name }}
					</option>
				</select>
			</div>

			<!-- 로딩 상태 -->
			<div v-if="loading" class="loading">
				<p>약관을 불러오는 중...</p>
			</div>

			<!-- 에러 상태 -->
			<div v-if="error" class="error">
				<p><strong>오류가 발생했습니다.</strong></p>
				<p>{{ error }}</p>
				<button @click="loadTerms" class="retry-button">다시 시도</button>
			</div>

			<!-- 약관 목록 -->
			<div v-if="!loading && !error && termsList.length > 0" class="terms-list">
				<div 
					v-for="terms in termsList" 
					:key="terms.id" 
					class="terms-item"
				>
					<div class="terms-header">
						<h2 class="terms-title">{{ terms.title || '약관' }}</h2>
						<div class="terms-meta">
							<span v-if="terms.version" class="terms-version">
								버전: {{ terms.version }}
							</span>
							<span v-if="terms.is_required === true" class="terms-required">필수</span>
							<span v-if="terms.updated_at" class="terms-date">
								{{ formatDate(terms.updated_at) }}
							</span>
						</div>
					</div>
					<div 
						class="terms-content" 
						v-html="terms.content || ''"
					></div>
				</div>
			</div>

			<!-- 약관이 없을 때 -->
			<div v-if="!loading && !error && termsList.length === 0" class="no-terms">
				<p>표시할 약관이 없습니다.</p>
				<p v-if="selectedTermGroup" class="no-terms-hint">
					선택한 약관 그룹에 활성화된 약관이 없습니다.
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getTermsList, getTermsByGroup, getActiveTermsByGroup } from '@/api/terms'
import { getCommonCodesByGroup } from '@/api/commonCode.js'

const route = useRoute()
const loading = ref(false)
const error = ref(null)
const termsList = ref([])
const termGroups = ref([])
const selectedTermGroup = ref('')

/**
 * 약관 그룹 목록 로드
 */
async function loadTermGroups() {
	try {
		const response = await getCommonCodesByGroup('TERM_GROUP', true)
		// 응답이 배열이면 그대로 사용, 객체면 data 속성 확인
		if (Array.isArray(response)) {
			termGroups.value = response
		} else if (response && Array.isArray(response.data)) {
			termGroups.value = response.data
		} else if (response && response.data) {
			termGroups.value = [response.data]
		} else {
			termGroups.value = []
		}
		console.log('약관 그룹 로드 완료:', termGroups.value)
	} catch (err) {
		console.error('약관 그룹 로드 실패:', err)
		termGroups.value = []
		// 약관 그룹 로드 실패는 에러로 표시하지 않음 (약관 그룹이 없을 수도 있음)
	}
}

/**
 * 약관 목록 로드
 */
async function loadTerms() {
	loading.value = true
	error.value = null
	
	try {
		let response
		if (selectedTermGroup.value) {
			// 특정 그룹의 활성화된 약관만 조회
			console.log('약관 그룹별 활성화된 약관 조회:', selectedTermGroup.value)
			response = await getActiveTermsByGroup(selectedTermGroup.value)
		} else {
			// 전체 약관 조회 (활성화된 것만)
			console.log('전체 활성화된 약관 조회')
			// 전체 약관 조회 후 클라이언트에서 활성화된 것만 필터링
			const allTerms = await getTermsList(0, 1000)
			response = Array.isArray(allTerms) ? allTerms.filter(term => term.is_active === true) : []
		}
		
		console.log('약관 API 응답:', response)
		console.log('약관 API 응답 타입:', typeof response)
		console.log('약관 API 응답이 배열인가?', Array.isArray(response))
		
		// 백엔드 API는 배열을 직접 반환하므로 배열인지 확인
		if (Array.isArray(response)) {
			termsList.value = response
		} else if (response && Array.isArray(response.data)) {
			// 응답이 객체이고 data 속성이 배열인 경우
			termsList.value = response.data
		} else if (response && response.data && !Array.isArray(response.data)) {
			// 응답이 객체이고 data가 단일 객체인 경우
			termsList.value = [response.data]
		} else if (response && typeof response === 'object' && !Array.isArray(response)) {
			// 응답이 객체인 경우, items나 results 같은 속성 확인
			termsList.value = response.items || response.results || response.terms || []
		} else {
			termsList.value = []
		}
		
		// 활성화된 약관만 필터링 (추가 안전장치)
		termsList.value = termsList.value.filter(term => term.is_active === true)
		
		console.log('약관 목록:', termsList.value)
		console.log('약관 목록 개수:', termsList.value.length)
		
		if (termsList.value.length === 0) {
			console.warn('활성화된 약관이 없습니다.')
			console.warn('응답 전체:', JSON.stringify(response, null, 2))
		} else {
			console.log('약관 첫 번째 항목:', termsList.value[0])
		}
	} catch (err) {
		console.error('약관 로드 실패:', err)
		console.error('에러 상세:', {
			message: err.message,
			response: err.response,
			data: err.response?.data,
			status: err.response?.status,
			statusText: err.response?.statusText,
			url: err.config?.url
		})
		error.value = err.response?.data?.detail || err.message || '약관을 불러오는데 실패했습니다.'
		termsList.value = []
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

// 쿼리 파라미터에서 약관 그룹 가져오기
watch(() => route.query.group, async (newGroup) => {
	if (newGroup) {
		selectedTermGroup.value = newGroup
		await loadTerms()
	}
}, { immediate: true })

onMounted(async () => {
	await loadTermGroups()
	
	// 쿼리 파라미터에서 약관 그룹이 있으면 설정
	if (route.query.group) {
		selectedTermGroup.value = route.query.group
	}
	
	await loadTerms()
})
</script>

