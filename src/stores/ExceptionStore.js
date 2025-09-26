import {defineStore} from 'pinia'

export const useExceptionStore = defineStore('exceptionStore', {
    state: () => ({
        numbers: [],
    }),
    actions: {
        setNumbers(numbers) {
			this.numbers = numbers; // 선택된 번호를 저장
		},
    },
})
