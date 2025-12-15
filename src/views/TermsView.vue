<template>
	<div class="TermsView">
		<div class="terms-container">
			<!-- 약관 그룹 선택 -->
			<div class="terms-group-selector" v-if="termGroups.length > 0">
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
				약관을 불러오는 중...
			</div>

			<!-- 에러 상태 -->
			<div v-if="error" class="error">
				{{ error }}
			</div>

			<!-- 약관 목록 -->
			<div v-if="!loading && !error && termsList.length > 0" class="terms-list">
				<div 
					v-for="terms in termsList" 
					:key="terms.id" 
					class="terms-item"
				>
					<div class="terms-header">
						<h2 class="terms-title">{{ terms.title }}</h2>
						<div class="terms-meta">
							<span class="terms-version">버전: {{ terms.version }}</span>
							<span v-if="terms.is_required" class="terms-required">필수</span>
							<span class="terms-date">
								{{ formatDate(terms.updated_at) }}
							</span>
						</div>
					</div>
					<div 
						class="terms-content" 
						v-html="terms.content"
					></div>
				</div>
			</div>

			<!-- 약관이 없을 때 -->
			<div v-if="!loading && !error && termsList.length === 0" class="no-terms">
				약관이 없습니다.
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTermsList, getTermsByGroup, getActiveTermsByGroup } from '@/api/terms'
import { getCommonCodesByGroup } from '@/api/commonCode.js'

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
		const groups = await getCommonCodesByGroup('TERM_GROUP', true)
		termGroups.value = groups || []
	} catch (err) {
		console.error('약관 그룹 로드 실패:', err)
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
		if (selectedTermGroup.value) {
			// 특정 그룹의 활성화된 약관만 조회
			const terms = await getActiveTermsByGroup(selectedTermGroup.value)
			termsList.value = terms || []
		} else {
			// 전체 약관 조회
			const terms = await getTermsList(0, 100)
			termsList.value = terms || []
		}
	} catch (err) {
		console.error('약관 로드 실패:', err)
		error.value = '약관을 불러오는데 실패했습니다.'
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

onMounted(async () => {
	await loadTermGroups()
	await loadTerms()
})
</script>

<style scoped>
.TermsView {
	padding: 2rem;
	max-width: 1200px;
	margin: 0 auto;
}

.terms-container {
	background: #fff;
	border-radius: 8px;
	padding: 2rem;
}

.terms-group-selector {
	margin-bottom: 2rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid #e0e0e0;
}

.terms-group-selector label {
	display: inline-block;
	margin-right: 1rem;
	font-weight: 600;
}

.terms-group-selector select {
	padding: 0.5rem 1rem;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-size: 1rem;
}

.loading,
.error,
.no-terms {
	text-align: center;
	padding: 3rem;
	color: #666;
}

.error {
	color: #d32f2f;
}

.terms-list {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.terms-item {
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 1.5rem;
	background: #fafafa;
}

.terms-header {
	margin-bottom: 1rem;
	padding-bottom: 1rem;
	border-bottom: 2px solid #e0e0e0;
}

.terms-title {
	margin: 0 0 0.5rem 0;
	font-size: 1.5rem;
	color: #333;
}

.terms-meta {
	display: flex;
	gap: 1rem;
	font-size: 0.875rem;
	color: #666;
}

.terms-version {
	font-weight: 500;
}

.terms-required {
	background: #ff5722;
	color: #fff;
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: 600;
}

.terms-date {
	margin-left: auto;
}

.terms-content {
	line-height: 1.8;
	color: #333;
	/* HTML 콘텐츠 스타일링 */
}

/* HTML 콘텐츠 내부 요소 스타일링 */
.terms-content :deep(h1),
.terms-content :deep(h2),
.terms-content :deep(h3) {
	margin-top: 1.5rem;
	margin-bottom: 1rem;
	color: #333;
}

.terms-content :deep(h1) {
	font-size: 1.75rem;
}

.terms-content :deep(h2) {
	font-size: 1.5rem;
}

.terms-content :deep(h3) {
	font-size: 1.25rem;
}

.terms-content :deep(p) {
	margin-bottom: 1rem;
}

.terms-content :deep(ul),
.terms-content :deep(ol) {
	margin-bottom: 1rem;
	padding-left: 2rem;
}

.terms-content :deep(li) {
	margin-bottom: 0.5rem;
}

.terms-content :deep(strong) {
	font-weight: 600;
	color: #333;
}

.terms-content :deep(em) {
	font-style: italic;
}

.terms-content :deep(a) {
	color: #1976d2;
	text-decoration: underline;
}

.terms-content :deep(a:hover) {
	color: #1565c0;
}

.terms-content :deep(table) {
	width: 100%;
	border-collapse: collapse;
	margin-bottom: 1rem;
}

.terms-content :deep(th),
.terms-content :deep(td) {
	border: 1px solid #ddd;
	padding: 0.75rem;
	text-align: left;
}

.terms-content :deep(th) {
	background: #f5f5f5;
	font-weight: 600;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
	.TermsView {
		padding: 1rem;
	}

	.terms-container {
		padding: 1rem;
	}

	.terms-title {
		font-size: 1.25rem;
	}

	.terms-meta {
		flex-direction: column;
		gap: 0.5rem;
	}

	.terms-date {
		margin-left: 0;
	}
}
</style>

