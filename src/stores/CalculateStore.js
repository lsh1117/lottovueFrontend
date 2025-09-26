import {defineStore} from 'pinia'

export const useCalculateStore = defineStore('calculateStore', {
    state: () => ({
        state: false,
        numbers: [],
    }),
    actions: {
        setState(state){
            this.state = state;
        },
        getState(){
            return this.state;
        },
        setNumbers(numbers) {
			this.numbers = numbers;
		},
        getNumbers(){
            return this.numbers;
        }
    },
})
