import { ref, firebaseAuth } from '../config/firebaseConfig';

export const updateCart = ({
  commit
}, {item, quantity, isAdd}) => {
  // TODO: Call service
  commit('UPDATE_CART', {item, quantity, isAdd});
  if (isAdd) {
    let message_obj = {
      message: `Add ${item.title} to cart successfully`,
      messageClass: "success",
      autoClose: true
    }
    commit('ADD_MESSAGE', message_obj);
  }
}

export const removeItemInCart = ({commit}, {item}) => {
	commit('REMOVE_CART_ITEM', {item});
}

export const registerByEmail = (_, {email, password}) => {
	return firebaseAuth().createUserWithEmailAndPassword(email, password);
}

export const logout = ({commit}) => {
  commit('SET_CART', []); // clear current cart
  return firebaseAuth().signOut();
}

export function loginWithEmail (_, {email, password}) {
  return firebaseAuth().signInWithEmailAndPassword(email, password);
}

export function listenToProductList({commit}) {
	return ref.child("products").on('value', (products) => {
		commit('UPDATE_PRODUCT_LIST', products.val());
	});
}

export function getShoppingCart({commit}, {uid, currentCart}) {
	if (uid) {
		return ref.child("cart/" + uid).once('value').then((cart) => {
			// console.log(cart.val());
			if (cart.val() && (!currentCart || currentCart.length == 0)) {
				commit('SET_CART', cart.val());
			}
		});
	} else {
		// console.log("User has not logged in");
	}
}

export function saveShoppingCart(_, {uid, cartItemList}) {
	// console.log("ACTIONS saveShoppingCart");
	// console.log("CART DATA", cartItemList);
	return ref.child("cart/" + uid).set(cartItemList);
}

export function saveDeliveryAddressRemote(_, {uid, address}){
  return ref.child("delivery_address/" + uid).set(address)
}

export function getDeliveryAddressRemote({commit}, {uid}){
  if(uid!=null){
    return ref.child("delivery_address/" + uid).once('value').then((address) => {
      if(address.val()){
        commit('SET_ADDRESS', {address: address.val()}); //Sending the address to the Vuex store
      }
    });
  }else{
    return false;
  }
}

export function checkCouponCodeRemote({commit}, {code}){
  if(code!=null){
    return ref.child("coupons/" + code).once('value').then((coupon) => {
      if(coupon.val()){ //If coupon code is valid
        commit('ACTIVE_COUPON', {coupon: coupon.val()}); //Sending the coupon instance to the Vuex store
      }else{ //If not
        commit('ACTIVE_COUPON', {coupon: undefined}); //Send an empty response for frontend
      }
    });
  }else{
    return false;
  }
}

export function submitFeedbackRemote(_, {email, text}) {
  var feedbacks = ref.child("feedbacks").push();
  return feedbacks.set({email: email, text: text});
}

export function saveToTransaction(_, {uid, cartItemList}) {
	let newTransactionKey = ref.child("transactions").push().key;
	var newTransaction = {}
	newTransaction['/transactions/' + uid + '/' + newTransactionKey] = cartItemList;
	return ref.update(newTransaction);
}
