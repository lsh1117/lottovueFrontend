<template>
	<div class="NoticeDetailView">
		<div class="notice-detail-container">
			<div v-if="loading" class="loading">
				<p>공지사항을 불러오는 중...</p>
			</div>

			<div v-if="error" class="error">
				<p><strong>오류가 발생했습니다.</strong></p>
				<p>{{ error }}</p>
				<button @click="loadNotice" class="retry-button">다시 시도</button>
				<button @click="goToList" class="back-button">목록으로</button>
			</div>

			<div v-if="!loading && !error && notice" class="notice-detail">
				<div class="notice-detail-header">
					<button @click="goToList" class="back-btn">← 목록으로</button>
					<div class="notice-detail-title-section">
						<div v-if="notice.is_important" class="notice-badge important">중요</div>
						<h1 class="notice-detail-title">{{ notice.title }}</h1>
					</div>
					<div class="notice-detail-meta">
						<span class="notice-meta-item">작성자: {{ notice.author_name }}</span>
						<span class="notice-meta-item">작성일: {{ formatDate(notice.created_at) }}</span>
						<span class="notice-meta-item">조회수: {{ notice.view_count }}</span>
					</div>
				</div>
				<div class="notice-detail-content" v-html="notice.content"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getNoticeDetail } from '@/api/notice'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const error = ref('')
const notice = ref(null)

const noticeId = computed(() => parseInt(route.params.noticeId))

const loadNotice = async () => {
	loading.value = true
	error.value = ''
	try {
		const data = await getNoticeDetail(noticeId.value)
		notice.value = data
	} catch (err) {
		console.error('공지사항 상세 조회 오류:', err)
		error.value = '공지사항을 불러오는데 실패했습니다.'
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

const goToList = () => {
	router.push('/notice/list')
}

onMounted(() => {
	loadNotice()
})
</script>

