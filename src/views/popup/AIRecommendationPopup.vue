<template>
	<div class="ai-recommendation-popup">
		<div v-if="loading" class="loading-area">
			<p class="text-description-medium">AI 분석 중...</p>
		</div>
		
		<div v-else-if="error" class="error-area">
			<p class="text-description-medium" style="color: red;">오류: {{ error }}</p>
		</div>
		
		<div v-else-if="recommendation" class="recommendation-content">
			<!-- 마크다운 형식의 추천 내용을 HTML로 변환하여 표시 -->
			<div class="recommendation-text" v-html="formattedRecommendation"></div>
			
			<!-- 사용량 정보 (선택사항) -->
			<div v-if="usage" class="usage-info">
				<p class="text-description-small">
					모델: {{ model || 'N/A' }} | 
					토큰 사용량: {{ usage.total_tokens || 0 }} (프롬프트: {{ usage.prompt_tokens || 0 }}, 생성: {{ usage.completion_tokens || 0 }})
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	recommendation: {
		type: String,
		default: null
	},
	model: {
		type: String,
		default: null
	},
	usage: {
		type: Object,
		default: null
	},
	loading: {
		type: Boolean,
		default: false
	},
	error: {
		type: String,
		default: null
	}
})

// 마크다운 형식의 텍스트를 HTML로 변환
const formattedRecommendation = computed(() => {
	if (!props.recommendation) return ''
	
	let html = props.recommendation
		// ## 제목을 h2로 변환
		.replace(/^## (.+)$/gm, '<h2 class="recommendation-h2">$1</h2>')
		// ### 제목을 h3로 변환
		.replace(/^### (.+)$/gm, '<h3 class="recommendation-h3">$1</h3>')
		// **굵은 글씨**를 strong으로 변환
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		// - 리스트 항목을 li로 변환
		.replace(/^- (.+)$/gm, '<li class="recommendation-li">$1</li>')
		// 줄바꿈을 br로 변환
		.replace(/\n/g, '<br>')
	
	// li가 연속으로 나오면 ul로 감싸기
	html = html.replace(/(<li class="recommendation-li">.*?<\/li>(?:<br>)?)+/g, (match) => {
		return '<ul class="recommendation-ul">' + match.replace(/<br>/g, '') + '</ul>'
	})
	
	return html
})
</script>