import {defineStore} from 'pinia'

export const usePremiumStore = defineStore('PremiumStore', {
    state: () => ({
        status: [],
    }),
    actions: {
        setStatus(status) {
			this.status = status; // 프로 타입 
		},
        updateStatus(status) {
            this.status = status; // 프로 상태 업데이트
        },
    },
})
