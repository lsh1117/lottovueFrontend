import {defineStore} from 'pinia'

export const usePremiumStore = defineStore('PremiumStore', {
    state: () => ({
        status: [],
    }),
    actions: {
        setStatus(status) {
			this.status = status; // 프리미엄 타입 
		},
    },
})
