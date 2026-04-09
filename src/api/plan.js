import http from '@/api/base'

export default {
	/**
	 * 플랜/크레딧 카탈로그 조회
	 * @returns {Promise<{plans: Record<string, any>, credit_product: any}>}
	 */
	getCatalog: async function () {
		try {
			return await http.get('/plans/')
		} catch (error) {
			console.error('Get plan catalog error:', error)
			throw error
		}
	},
}

