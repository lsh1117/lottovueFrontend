const globalMethods = {
	formatCurrency(value) {
		if (typeof value !== 'number') return value;
		return value.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
		});
	},
	formatDate(date) {
		if (!(date instanceof Date)) return date;
		return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
	},
	toCurrency(value,code) {
		if (typeof value !== 'number') return value;
		if( code === 'us'){
			return value.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD',
			});
		}
		else {
			return value.toLocaleString('ko-KR', {
				style: 'currency',
				currency: 'KRW'
			});
		}
	},
	formatCurrency(amount){
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	},
	getWinamnt(no) {
		if (typeof Number(no) !== 'number' || no > 5) return null;
		switch(Number(no)){
			case 1 : 
			return 1800000000;
			case 2 : 
			return 75000000;
			case 3 : 
			return 1500000;
			case 4 : 
			return 50000;
			case 5 : 
			return 5000;
			default :
			return 0;
		}
	},
	/**
	 * 배열을 무작위로 섞는 함수
	 * @param {Array} array - 섞을 배열
	 * @returns {Array} - 무작위로 섞인 배열
	 */
	shuffleArray(array) {
		// 배열을 복사하여 원본 배열을 수정하지 않음
		const shuffled = [...array];

		// 배열의 끝에서부터 시작하여 무작위로 요소 교환
		for (let i = shuffled.length - 1; i > 0; i--) {
			// 0에서 i 사이의 랜덤 인덱스 생성
			const randomIndex = Math.floor(Math.random() * (i + 1));

			// 현재 요소와 무작위 요소를 교환
			const temp = shuffled[i];
			shuffled[i] = shuffled[randomIndex];
			shuffled[randomIndex] = temp;
		}

		return shuffled;
	}
};

export default globalMethods;
