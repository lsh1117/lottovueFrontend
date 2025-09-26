import AlertPopup from '@/views/popup/AlertPopup.vue'
import ExceptionPopup from '@/views/popup/ExceptionPopup.vue'
import FixedPopup from '@/views/popup/FixedPopup.vue'
import FixedRecommendPopup from '@/views/popup/FixedRecommendPopup.vue'
import ExceptionRecommendPopup from '@/views/popup/ExceptionRecommendPopup.vue'
import RecommendPopup from '@/views/popup/RecommendPopup.vue'
import MyNumberPopup from '@/views/popup/MyNumberPopup.vue'

/**
 * defaultProps
 * title : 팝업 제목
 * message : 출력 메시지 
 * onOpen : 오픈 이벤트
 * onClose : 닫기 이벤트
 */

export const popupList = {
	alert: {
		type: "alert",
		title: "Alert",
		component: AlertPopup,
		options: {
			message: '기본 경고 메시지입니다.',
		},
	},
	exception: {
		title: '제외번호',
		type:'dialog',
		component: ExceptionPopup,
		options: {
			
		},
	},
	fixed: {
		title: '고정번호',
		type:'dialog',
		component: FixedPopup,
		options: {
			
		},
	},
	fixedRecommend: {
		title: '추천 고정번호',
		type:'dialog',
		component: FixedRecommendPopup,
		options: {
			
		},
	},
	exceptionRecommend: {
		title: '추천 제외번호',
		type:'dialog',
		component: ExceptionRecommendPopup,
		options: {
			
		},
	},
	recommend: {
		title: '번호 뽑기',
		type:'dialog',
		component: RecommendPopup,
		options: {
			
		},
	},
	myNumber: {
		title: '내 번호 보기',
		type:'dialog',
		component: MyNumberPopup,
		options: {
			
		},
	},
}
