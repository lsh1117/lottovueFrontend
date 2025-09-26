import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'

let http = axios.create({
	baseURL: '/api/',
	timeout: 10000,
})

let loadingInstance

// 인터셉터 추가
http.interceptors.request.use(
	config => {
		loadingInstance = ElLoading.service('로드 중')

		return config
	},
	err => {
		//요청 오류(프론트 엔드 작업은 로딩 원을 취소하는 것이며 네트워크 예외 메시지가 나타납니다)
		loadingInstance?.close()
		ElMessage.error('네트워크 이상')
		return Promise.reject(err)
	},
)

//응답 인터셉터
http.interceptors.response.use(
	res => {
		loadingInstance?.close()
		return res.data
	},
	err => {
		// 요청이 실패했습니다(프론트 엔드 방법은 로딩 원을 취소하고 프롬프트를 제공하는 것입니다)
		loadingInstance?.close()
		ElMessage.error('요청 실패')
		return Promise.reject(err)
	},
)

export default http
