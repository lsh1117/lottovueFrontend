import {defineStore} from 'pinia'

export const useFixedStore = defineStore('fixedStore', {
    state: () => ({
        numbers: [],
    }),
    actions: {
        setNumbers(numbers) {
			this.numbers = numbers; // 선택된 번호를 저장
		},
    },
})
