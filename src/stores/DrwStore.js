import {
	defineStore
} from 'pinia'

export const useDrwStore = defineStore('drwStore', {
	state: () => ({
		numbers: [
		],
	}),
	actions: {
		setNumbers(numbers) {
			this.numbers = numbers; // 선택된 번호를 저장
		},
		getDrwNo(no) {
			return this.numbers.find(item => Number(item.drwNo) === Number(no));
		},
		getNumbers() {
			return this.numbers;
		},
		getTotalAppear(numbers){
			const stats = Array(45).fill(0); // 1~45의 초기 등장 횟수 (0으로 초기화)

			numbers.forEach((item) => {
				// 각 회차의 당첨번호 카운트
				stats[Number(item.drwtNo1) - 1]++;
				stats[Number(item.drwtNo2) - 1]++;
				stats[Number(item.drwtNo3) - 1]++;
				stats[Number(item.drwtNo4) - 1]++;
				stats[Number(item.drwtNo5) - 1]++;
				stats[Number(item.drwtNo6) - 1]++;
			});

			return stats.map((count, index) => ({
				number: index + 1,
				count,
			})); // 번호와 등장 횟수를 객체로 반환
		},
		// 연속 등장 횟수를 계산하는 함수
		getAppearInSuccession(draws) {
			const consecutiveCounts = Array(45).fill(0).map(() => 0); // 번호별 최대 연속 등장 횟수
			const currentConsecutive = Array(45).fill(0); // 번호별 현재 연속 등장 횟수

			// 각 회차의 당첨 번호 순회
			draws.forEach((item) => {
				for (let i = 1; i <= 45; i++) {
					if (
						Number(item.drwtNo1) === i ||
						Number(item.drwtNo2) === i ||
						Number(item.drwtNo3) === i ||
						Number(item.drwtNo4) === i ||
						Number(item.drwtNo5) === i ||
						Number(item.drwtNo6) === i
					) {
						currentConsecutive[i - 1]++; // 연속 등장 횟수 증가

						if (currentConsecutive[i - 1] == 4) {
							////console.log("#############", i, item)
						}

					} else {
						consecutiveCounts[i - 1] = Math.max(consecutiveCounts[i - 1], currentConsecutive[i - 1]);
						currentConsecutive[i - 1] = 0; // 등장하지 않으면 연속 등장 횟수 초기화
					}
				}
			});

			// 마지막 연속 등장 횟수 체크
			for (let i = 0; i < 45; i++) {
				consecutiveCounts[i] = Math.max(consecutiveCounts[i], currentConsecutive[i]);
			}

			return consecutiveCounts.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환

			//return consecutiveCounts; // 번호별 최대 연속 등장 횟수를 배열로 반환
		},
		// 현재까지의 연속 등장 횟수를 계산하는 함수
		getAppearInSuccessionUntil(numbers) {
			const numbersCount = Array(45).fill(0).map(() => 0); // 번호별 최대 연속 등장 횟수

			for (let i = 0; i < 45; i++) {
				const _number = i + 1; // 번호 (1부터 시작)

				// 각 회차 데이터를 순회
				try {
					numbers.forEach((draw) => {
						// 이번 회차의 당첨 번호
						const currentDrawNumbers = [
							Number(draw.drwtNo1),
							Number(draw.drwtNo2),
							Number(draw.drwtNo3),
							Number(draw.drwtNo4),
							Number(draw.drwtNo5),
							Number(draw.drwtNo6),
						];

						if (currentDrawNumbers.includes(_number)) {
							// 이번 회차에 등장 한 번호 -> 카운트 증가
							numbersCount[i]++;
						} else {
							throw new Error("stop loop");
						}
					});
				} catch (e) {
					//console.log("loop end : ", e.message);
				}
			}

			return numbersCount.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
		// 연속 미등장 횟수를 계산하는 함수
		getNotAppearInSuccession(numbers) {
			// 1번부터 45번까지 연속 등장하지 않은 횟수를 저장할 객체
			const nonConsecutiveCounts = Array(45).fill(0); // [0, 0, ..., 0]
			const lastAppearances = Array(45).fill(false); // 번호의 이전 등장 여부 추적

			// 각 회차 데이터를 순회
			numbers.forEach((draw) => {
				// 이번 회차 등장 번호 추적
				const currentDrawNumbers = [
					Number(draw.drwtNo1),
					Number(draw.drwtNo2),
					Number(draw.drwtNo3),
					Number(draw.drwtNo4),
					Number(draw.drwtNo5),
					Number(draw.drwtNo6),
				];

				// 번호 체크
				for (let i = 0; i < 45; i++) {
					const number = i + 1; // 번호 (1부터 시작)
					if (currentDrawNumbers.includes(number)) {
						// 번호가 이번 회차에 등장한 경우 -> 초기화
						lastAppearances[i] = true;
					} else {
						// 번호가 이번 회차에 등장하지 않은 경우
						if (lastAppearances[i]) {
							// 이전 회차에 등장했었다면 연속 등장 실패 -> 카운트 증가
							nonConsecutiveCounts[i]++;
						}
						// 이번 회차에도 등장하지 않은 경우, 상태 유지
						lastAppearances[i] = false;
					}
				}
			});

			return nonConsecutiveCounts.map((count, index) => ({
				number: index + 1,
				count: count,
			}));
		},
		// 현재까지의 연속 미등장 횟수를 계산하는 함수
		getNotAppearInSuccessionUntil(numbers) {
			const numbersCount = Array(45).fill(0).map(() => 0); // 번호별 최대 연속 등장 횟수

			for (let i = 0; i < 45; i++) {
				const _number = i + 1; // 번호 (1부터 시작)

				// 각 회차 데이터를 순회
				try {
					numbers.forEach((draw) => {
						// 이번 회차의 당첨 번호
						const currentDrawNumbers = [
							Number(draw.drwtNo1),
							Number(draw.drwtNo2),
							Number(draw.drwtNo3),
							Number(draw.drwtNo4),
							Number(draw.drwtNo5),
							Number(draw.drwtNo6),
						];

						if (!currentDrawNumbers.includes(_number)) {
							// 이번 회차에 등장하지 않은 번호 -> 카운트 증가
							numbersCount[i]++;
						} else {
							throw new Error("stop loop");
						}
					});
				} catch (e) {
					//console.log("loop end : ", e.message);
				}
			}

			return numbersCount.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
		// 구간별 연속 등장 횟수를 계산하는 함수
		getGroupAppearInSuccession(numbers) {
			const consecutiveCounts = Array(5).fill(0).map(() => 0); // 번호별 최대 연속 등장 횟수
			const currentConsecutive = Array(5).fill(0); // 번호별 현재 연속 등장 횟수

			// 그룹(색상) 계산 함수
			const getGroup = function (number) {
				return Math.floor((number - 1) / 10) + 1;
			}

			// 각 회차의 당첨 번호 순회
			numbers.forEach((item) => {
				for (let i = 1; i <= 5; i++) {
					const no1 = getGroup(Number(item.drwtNo1));
					const no2 = getGroup(Number(item.drwtNo2));
					const no3 = getGroup(Number(item.drwtNo3));
					const no4 = getGroup(Number(item.drwtNo4));
					const no5 = getGroup(Number(item.drwtNo5));
					const no6 = getGroup(Number(item.drwtNo6));
					if (
						no1 === i ||
						no2 === i ||
						no3 === i ||
						no4 === i ||
						no5 === i ||
						no6 === i
					) {
						currentConsecutive[i - 1]++; // 연속 등장 횟수 증가
					} else {
						consecutiveCounts[i - 1] = Math.max(consecutiveCounts[i - 1], currentConsecutive[i - 1]);
						currentConsecutive[i - 1] = 0; // 등장하지 않으면 연속 등장 횟수 초기화
					}
				}
			});

			// 마지막 연속 등장 횟수 체크
			for (let i = 0; i < 5; i++) {
				consecutiveCounts[i] = Math.max(consecutiveCounts[i], currentConsecutive[i]);
			}

			return consecutiveCounts.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
		// 현재까지의 구간별 연속 등장 횟수를 계산하는 함수
		getGroupAppearInSuccessionUntil(numbers) {
			const numbersCount = Array(5).fill(0).map(() => 0); // 번호별 최대 연속 등장 횟수

			// 그룹(색상) 계산 함수
			const getGroup = function (number) {
				return Math.floor((number - 1) / 10) + 1;
			}

			for (let i = 0; i < 5; i++) {
				const _number = i + 1; // 번호 (1부터 시작)

				// 각 회차 데이터를 순회
				try {
					numbers.forEach((draw) => {
						// 이번 회차의 당첨 번호 구간번호
						const currentDrawNumbers = [
							getGroup(Number(draw.drwtNo1)),
							getGroup(Number(draw.drwtNo2)),
							getGroup(Number(draw.drwtNo3)),
							getGroup(Number(draw.drwtNo4)),
							getGroup(Number(draw.drwtNo5)),
							getGroup(Number(draw.drwtNo6)),
						];

						if (currentDrawNumbers.includes(_number)) {
							// 이번 회차에 등장 한 구간 -> 카운트 증가
							numbersCount[i]++;
						} else {
							throw new Error("stop loop");
						}
					});
				} catch (e) {
					//console.log("loop end : ", e.message);
				}
			}

			return numbersCount.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
		// 구간별 연속 미등장 횟수를 계산하는 함수
		getGroupNotAppearInSuccession(numbers) {
			const consecutiveCounts = Array(5).fill(0).map(() => 0); // 최대 연속 미등장 횟수
			const currentConsecutive = Array(5).fill(0); // 현재 연속 미등장 횟수

			// 그룹(색상) 계산 함수
			const getGroup = function (number) {
				return Math.floor((number - 1) / 10) + 1;
			}

			// 각 회차의 당첨 번호 순회
			numbers.forEach((draw) => {
				for (let i = 1; i <= 5; i++) {
					
					const currentDrawNumbers = [
						getGroup(Number(draw.drwtNo1)),
						getGroup(Number(draw.drwtNo2)),
						getGroup(Number(draw.drwtNo3)),
						getGroup(Number(draw.drwtNo4)),
						getGroup(Number(draw.drwtNo5)),
						getGroup(Number(draw.drwtNo6)),
					];
					if (!currentDrawNumbers.includes(i)) {
						currentConsecutive[i - 1]++; // 연속 미등장 횟수 증가
					} else {
						consecutiveCounts[i - 1] = Math.max(consecutiveCounts[i - 1], currentConsecutive[i - 1]);
						currentConsecutive[i - 1] = 0; // 등장하면 연속 미등장 횟수 초기화
					}
				}
			});

			// 마지막 연속 미등장 횟수 체크
			for (let i = 0; i < 5; i++) {
				consecutiveCounts[i] = Math.max(consecutiveCounts[i], currentConsecutive[i]);
			}

			return consecutiveCounts.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
		// 현재까지의 구간별 연속 미등장 횟수를 계산하는 함수
		getGroupNotAppearInSuccessionUntil(numbers) {
			const numbersCount = Array(5).fill(0).map(() => 0); // 번호별 최대 연속 등장 횟수

			// 그룹(색상) 계산 함수
			const getGroup = function (number) {
				return Math.floor((number - 1) / 10) + 1;
			}

			for (let i = 0; i < 5; i++) {
				const _number = i + 1; // 번호 (1부터 시작)

				// 각 회차 데이터를 순회
				try {
					numbers.forEach((draw) => {
						// 이번 회차의 당첨 번호 구간번호
						const currentDrawNumbers = [
							getGroup(Number(draw.drwtNo1)),
							getGroup(Number(draw.drwtNo2)),
							getGroup(Number(draw.drwtNo3)),
							getGroup(Number(draw.drwtNo4)),
							getGroup(Number(draw.drwtNo5)),
							getGroup(Number(draw.drwtNo6)),
						];

						if (!currentDrawNumbers.includes(_number)) {
							// 이번 회차에 미등장 한 구간 -> 카운트 증가
							numbersCount[i]++;
						} else {
							throw new Error("stop loop");
						}
					});
				} catch (e) {
					//console.log("loop end : ", e.message);
				}
			}

			return numbersCount.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
		// 짝수, 홀수 연속 등장 횟수를 계산하는 함수
		getEvenAndOddAppearInSuccession(numbers) {
			const consecutiveCounts = Array(2).fill(0).map(() => 0); // 최대 연속 미등장 횟수
			const currentConsecutive = Array(2).fill(0); // 현재 연속 미등장 횟수

			// 그룹(색상) 계산 함수
			const getGroup = function (number) {
				return number%2;
			}

			// 각 회차의 당첨 번호 순회
			numbers.forEach((draw) => {
				for (let i = 0; i < 2; i++) {
					const currentDrawNumbers = [
						getGroup(Number(draw.drwtNo1)),
						getGroup(Number(draw.drwtNo2)),
						getGroup(Number(draw.drwtNo3)),
						getGroup(Number(draw.drwtNo4)),
						getGroup(Number(draw.drwtNo5)),
						getGroup(Number(draw.drwtNo6)),
					];
					if (currentDrawNumbers.includes(i)) {
						currentConsecutive[i]++; // 연속 미등장 횟수 증가
					} else {
						consecutiveCounts[i] = Math.max(consecutiveCounts[i], currentConsecutive[i]);
						currentConsecutive[i] = 0; // 등장하면 연속 미등장 횟수 초기화
					}
				}
			});

			// 마지막 연속 미등장 횟수 체크
			for (let i = 0; i < 2; i++) {
				consecutiveCounts[i] = Math.max(consecutiveCounts[i], currentConsecutive[i]);
			}

			return consecutiveCounts.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
		// 현재까지의 짝수,홀수 연속 등장 횟수를 계산하는 함수
		getEvenAndOddAppearInSuccessionUntil(numbers) {
			const numbersCount = Array(2).fill(0).map(() => 0); // 번호별 최대 연속 등장 횟수

			// 짝수홀수 계산 함수
			const getGroup = function (number) {
				return number%2;
			}

			for (let i = 0; i < 2; i++) {
				// 각 회차 데이터를 순회
				try {
					numbers.forEach((draw) => {
						// 이번 회차의 당첨 번호 구간번호
						const currentDrawNumbers = [
							getGroup(Number(draw.drwtNo1)),
							getGroup(Number(draw.drwtNo2)),
							getGroup(Number(draw.drwtNo3)),
							getGroup(Number(draw.drwtNo4)),
							getGroup(Number(draw.drwtNo5)),
							getGroup(Number(draw.drwtNo6)),
						];

						if (currentDrawNumbers.includes(i)) {
							// 이번 회차에 등장 한 구간 -> 카운트 증가
							numbersCount[i]++;
						} else {
							throw new Error("stop loop");
						}
					});
				} catch (e) {
					//console.log("loop end : ", e.message);
				}
			}

			return numbersCount.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
		// 짝수, 홀수 연속 미등장 횟수를 계산하는 함수
		getEvenAndOddNotAppearInSuccession(numbers) {
			const consecutiveCounts = Array(2).fill(0).map(() => 0); // 최대 연속 미등장 횟수
			const currentConsecutive = Array(2).fill(0); // 현재 연속 미등장 횟수

			// 그룹(색상) 계산 함수
			const getGroup = function (number) {
				return number%2;
			}

			// 각 회차의 당첨 번호 순회
			numbers.forEach((draw) => {
				for (let i = 0; i < 2; i++) {
					const currentDrawNumbers = [
						getGroup(Number(draw.drwtNo1)),
						getGroup(Number(draw.drwtNo2)),
						getGroup(Number(draw.drwtNo3)),
						getGroup(Number(draw.drwtNo4)),
						getGroup(Number(draw.drwtNo5)),
						getGroup(Number(draw.drwtNo6)),
					];
					if (!currentDrawNumbers.includes(i)) {
						currentConsecutive[i]++; // 연속 미등장 횟수 증가
					} else {
						consecutiveCounts[i] = Math.max(consecutiveCounts[i], currentConsecutive[i]);
						currentConsecutive[i] = 0; // 등장하면 연속 미등장 횟수 초기화
					}
				}
			});

			// 마지막 연속 미등장 횟수 체크
			for (let i = 0; i < 2; i++) {
				consecutiveCounts[i] = Math.max(consecutiveCounts[i], currentConsecutive[i]);
			}

			return consecutiveCounts.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
		// 현재까지의 짝수,홀수 연속 미등장 횟수를 계산하는 함수
		getEvenAndOddNotAppearInSuccessionUntil(numbers) {
			const numbersCount = Array(2).fill(0).map(() => 0); // 번호별 최대 연속 등장 횟수

			// 짝수홀수 계산 함수
			const getGroup = function (number) {
				return number%2;
			}

			for (let i = 0; i < 2; i++) {
				// 각 회차 데이터를 순회
				try {
					numbers.forEach((draw) => {
						// 이번 회차의 당첨 번호 구간번호
						const currentDrawNumbers = [
							getGroup(Number(draw.drwtNo1)),
							getGroup(Number(draw.drwtNo2)),
							getGroup(Number(draw.drwtNo3)),
							getGroup(Number(draw.drwtNo4)),
							getGroup(Number(draw.drwtNo5)),
							getGroup(Number(draw.drwtNo6)),
						];

						if (!currentDrawNumbers.includes(i)) {
							// 이번 회차에 등장 한 구간 -> 카운트 증가
							numbersCount[i]++;
						} else {
							throw new Error("stop loop");
						}
					});
				} catch (e) {
					//console.log("loop end : ", e.message);
				}
			}

			return numbersCount.map((count, index) => ({
				number: index + 1,
				count,
			})); // 객체로 반환
		},
	},
})
