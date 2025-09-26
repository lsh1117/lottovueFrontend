import baseApi from '/src/api/baseApi'

export default {
	getLogin: async function (userInfo) {
		const url = '/login'
		let result = await baseApi.post(url, userInfo)
		return result
	},
}
