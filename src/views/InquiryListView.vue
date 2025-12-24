<template>
	<div class="InquiryListView">
		<div class="inquiry-container">
			<div class="inquiry-header">
				<h1 class="page-title">문의하기</h1>
				<button class="btn-create" @click="goToCreate">문의 등록</button>
			</div>

			<div v-if="loading" class="loading">
				<p>문의 목록을 불러오는 중...</p>
			</div>

			<div v-if="error" class="error">
				<p><strong>오류가 발생했습니다.</strong></p>
				<p>{{ error }}</p>
				<button @click="loadInquiries" class="retry-button">다시 시도</button>
			</div>

			<div v-if="!loading && !error" class="inquiry-list">
				<div
					v-for="inquiry in inquiryList"
					:key="inquiry.id"
					class="inquiry-item accordion accordion-area"
				>
					<div class="accordion-header" @click="toggleAccordion(inquiry.id)">
						<div class="inquiry-header-content">
							<div class="inquiry-title-section">
								<h3 class="inquiry-title">{{ inquiry.title }}</h3>
							</div>
							<div class="inquiry-meta">
								<span class="inquiry-date">{{ formatDate(inquiry.created_at) }}</span>
							</div>
						</div>
						<div>
							<span class="inquiry-status" :class="inquiry.status">
								{{ inquiry.status === 'replied' ? '답변완료' : '대기중' }}
							</span>
						</div>
						<span class="accordion-icon">{{ expandedItems[inquiry.id] ? '▲' : '▼' }}</span>
					</div>
					<div class="accordion-body" v-if="expandedItems[inquiry.id]">
						<div class="inquiry-content-section">
							<div class="inquiry-content">
								<h4>문의 내용</h4>
								<div class="content-text" v-html="formatContent(inquiry.content)"></div>
							</div>
							<div v-if="inquiry.admin_reply" class="inquiry-reply">
								<h4>답변</h4>
								<div class="reply-text" v-html="formatContent(inquiry.admin_reply)"></div>
								<div class="reply-date">
									답변일: {{ formatDate(inquiry.reply_date) }}
								</div>
							</div>
							<div v-else class="inquiry-reply pending">
								<p>답변 대기 중입니다.</p>
							</div>
						</div>
					</div>
				</div>

				<div v-if="!loading && !error && inquiryList.length === 0" class="no-inquiry">
					<p>문의 내역이 없습니다.</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getInquiriesList } from '@/api/inquiry'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const inquiryList = ref([])
const expandedItems = reactive({})

const loadInquiries = async () => {
	loading.value = true
	error.value = ''
	try {
		const data = await getInquiriesList(0, 100)
		inquiryList.value = Array.isArray(data) ? data : []
	} catch (err) {
		console.error('문의 목록 조회 오류:', err)
		error.value = '문의 목록을 불러오는데 실패했습니다.'
	} finally {
		loading.value = false
	}
}

const formatDate = (dateString) => {
	if (!dateString) return ''
	const date = new Date(dateString)
	return date.toLocaleString('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	})
}

const formatContent = (content) => {
	if (!content) return ''
	return content.replace(/\n/g, '<br>')
}

const toggleAccordion = (inquiryId) => {
	expandedItems[inquiryId] = !expandedItems[inquiryId]
}

const goToCreate = () => {
	router.push('/inquiry/create')
}

onMounted(() => {
	loadInquiries()
})
</script>

