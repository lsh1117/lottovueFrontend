export const PLAN_INFO = {
	free: {
		name: 'Free Plan',
		priceText: '무료',
		maxSavedNumbersPerRound: 2,
		weeklyCredits: 2,
		features: [
			'회차별 최대 <strong>2개</strong>까지 생성 번호 저장',
			'주간 크레딧: <strong>2개</strong>',
			'모든 통계 기능',
		],
	},
	pro: {
		name: 'Pro Plan',
		priceText: '월 0원',
		maxSavedNumbersPerRound: 100,
		weeklyCredits: 100,
		features: [
			'회차별 최대 <strong>100개</strong>까지 생성 번호 저장',
			'주간 크레딧: <strong>100개</strong>',
			'모든 통계 기능',
			'통계 기반 AI 분석 기능',
		],
	},
	max: {
		name: 'Max Plan',
		priceText: '월 0원',
		maxSavedNumbersPerRound: 1000,
		weeklyCredits: 1000,
		features: [
			'회차별 최대 <strong>1000개</strong>까지 생성 번호 저장',
			'주간 크레딧: <strong>1000개</strong>',
			'모든 통계 기능',
			'통계 기반 AI 분석 기능',
		],
	},
}

export const CREDIT_PRODUCT = {
	name: '크레딧 추가 구매',
	priceText: '0원',
	amount: 500,
	features: [
		'크레딧 <strong>500개</strong> 추가 구매',
		'크레딧 1개 = 랜덤번호 1개 생성',
		'소멸되지 않는 크레딧',
		'언제든지 사용 가능',
	],
}

export const withCreditUnit = (features) =>
	features.map((feature) =>
		feature.includes('주간 크레딧:')
			? `${feature} (크레딧 1개 = 랜덤번호 1개 생성)`
			: feature,
	)
