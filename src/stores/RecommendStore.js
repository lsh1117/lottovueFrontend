import {
	defineStore
} from 'pinia'

export const useRecommendStore = defineStore('recommendStore', {
	state: () => ({
		// 추천 받은 번호 컬랙션
		// 컬랙션 타입 object
		// 회차별 컬랙션 데이터 numbers(추천 받은 번호 배열), drw ( 회차 ) : {recommends:[], drw:0000}

		collections: [
		],
	}),
	actions: {
		addRecommend(numbers, drw) {
			const _recommendObj = {
				"numbers": numbers,
				"writeDate": getFormattedDate(),
				"drw": drw
			}

			this.collections.push(_recommendObj);

			function getFormattedDate() {
				const now = new Date(); // 현재 시간 가져오기
				const year = now.getFullYear(); // 연도 (4자리)
				const month = String(now.getMonth() + 1).padStart(2, '0'); // 월 (2자리, 1월은 0이므로 +1 필요)
				const date = String(now.getDate()).padStart(2, '0'); // 날짜 (2자리)

				return `${year}.${month}.${date}`; // 형식에 맞게 조합
			}
		},
		getRecommends(drw) {
			let _recommends = [];
			this.collections.forEach((item) => {
				if (drw === undefined) {
					_recommends.push(item);
				} else {
					if (Number(item.drw) === Number(drw)) {
						_recommends.push(item);
					}
				}
			});
			return _recommends;
		},
		getDrwList() {
			let _list = [];
			this.collections.forEach((item) => {
				if (!_list.includes(Number(item.drw))) {
					_list.push(Number(item.drw));
				}
			});
			_list.sort((a, b) => b - a);
			return _list;
		}
	},
})
