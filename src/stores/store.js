import Vue from 'vue';
import Vuex from 'vuex';

import address from './modules/address';
import cart from './modules/cart';
import coupon from './modules/coupon';
import products from './modules/products';
import auth from './modules/auth';
import messages from './modules/messages';

import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
	actions,
	modules: {
		auth,
		cart,
		coupon,
		products,
		messages,
		address
	}
});
