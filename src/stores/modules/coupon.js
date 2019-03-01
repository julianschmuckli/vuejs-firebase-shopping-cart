const state = {
	active_coupon: {}
}

const mutations = {
	'ACTIVE_COUPON' (state, {coupon}) {
		state.active_coupon = coupon; //Setting the address to Vuex
	}
}

const actions = {

}

const getters = {
	activeCoupon: (state) => {
		return state.active_coupon;
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
