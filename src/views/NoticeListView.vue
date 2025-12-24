<template>
	<div class="NoticeListView">
		<div class="notice-container">
			<h1 class="page-title">공지사항</h1>

			<!-- 중요 공지사항 -->
			<div v-if="importantNotices.length > 0" class="important-notices">
				<h2 class="section-title">중요 공지</h2>
				<div class="notice-list">
					<div
						v-for="notice in importantNotices"
						:key="notice.id"
						class="notice-item important"
						@click="goToDetail(notice.id)"
					>
						<div class="notice-header">
							<span class="notice-badge">중요</span>
							<h3 class="notice-title">{{ notice.title }}</h3>
							<span class="notice-date">{{ formatDate(notice.created_at) }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 일반 공지사항 -->
			<div class="notice-list">
				<div v-if="loading" class="loading">
					<p>공지사항을 불러오는 중...</p>
				</div>

				<div v-if="error" class="error">
					<p><strong>오류가 발생했습니다.</strong></p>
					<p>{{ error }}</p>
					<button @click="loadNotices" class="retry-button">다시 시도</button>
				</div>

				<div v-if="!loading && !error && noticeList.length > 0">
					<div
						v-for="notice in noticeList"
						:key="notice.id"
						class="notice-item"
						@click="goToDetail(notice.id)"
					>
						<div class="notice-header">
							<h3 class="notice-title">{{ notice.title }}</h3>
							<span class="notice-date">{{ formatDate(notice.created_at) }}</span>
						</div>
						<div class="notice-meta">
							<span class="notice-author">작성자: {{ notice.author_name }}</span>
							<span class="notice-views">조회수: {{ notice.view_count }}</span>
						</div>
					</div>
				</div>

				<div v-if="!loading && !error && noticeList.length === 0 && importantNotices.length === 0" class="no-notice">
					<p>공지사항이 없습니다.</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNoticesList, getImportantNotices } from '@/api/notice'

const router = useRouter()

const loading = ref(false)
const error = ref('')
const noticeList = ref([])
const importantNotices = ref([])

const loadNotices = async () => {
	loading.value = true
	error.value = ''
	try {
		const [notices, important] = await Promise.all([
			getNoticesList(0, 100),
			getImportantNotices()
		])
		noticeList.value = Array.isArray(notices) ? notices : []
		importantNotices.value = Array.isArray(important) ? important : []
	} catch (err) {
		console.error('공지사항 조회 오류:', err)
		error.value = '공지사항을 불러오는데 실패했습니다.'
	} finally {
		loading.value = false
	}
}

const formatDate = (dateString) => {
	if (!dateString) return ''
	const date = new Date(dateString)
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	})
}

const goToDetail = (noticeId) => {
	router.push(`/notice/${noticeId}`)
}

onMounted(() => {
	loadNotices()
})
</script>

