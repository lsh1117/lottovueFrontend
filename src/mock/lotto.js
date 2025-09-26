export default [{
		url: '/api/getUser', // 모의 API URL
		method: 'get', // HTTP 메서드
		response: () => {
			return {
				code: 200,
				data: {
					id: 1,
					name: 'John Doe',
				},
			};
		},
	},
	{
		url: '/api/updateUser',
		method: 'post',
		response: (req) => {
			const {
				name
			} = req.body;
			return {
				code: 200,
				message: `User ${name} updated successfully`,
			};
		},
	},
];
