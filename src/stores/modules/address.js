const state = {
	delivery_address: {}
}

const mutations = {
	'SET_ADDRESS' (state, {address}) {
		state.delivery_address = address; //Setting the address to Vuex
	}
}

const actions = {

}

const getters = {
	deliveryAddress: (state) => {
		return state.delivery_address;
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
