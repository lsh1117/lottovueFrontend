export default [
	{
		url: '/api/login', // 모의 로그인 링크
		method: 'post', // 요청 방법
		timeout: 500, // 타임아웃
		statusCode: 200, // 반환된 http 상태 코드
		response: {
			// 반환된 결과 집합
			code: 200,
			message: '성공적 로그인',
			data: {
				name: 'tom1111',
			},
		},
	},
]