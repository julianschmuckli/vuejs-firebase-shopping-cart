<template>
<div class="container">
  <table id="cart" class="table table-hover table-condensed">
    <thead>
      <tr>
        <th style="width:50%">Product</th>
        <th style="width:10%">Price</th>
        <th style="width:8%">Quantity</th>
        <th style="width:22%" class="text-center">Subtotal</th>
        <th style="width:10%"></th>
      </tr>
    </thead>

    <transition-group name="list-shopping-cart" tag="tbody">
      <app-cart-item v-for="cartItem in cartItemList" :cartItem="cartItem" :key="cartItem.id"></app-cart-item>
    </transition-group>

    <tfoot>
      <tr>
        <td colspan="3" class="hidden-xs"></td>
        <td class="hidden-xs text-center"><strong>Total ${{ cartValue }}</strong></td>
        <td></td>
      </tr>
    </tfoot>
  </table>
  <div class="row">
    <div class="col-sm-6">
      <h4>Delivery address</h4>
      <form ref="delivery_form" id="delivery_form" @submit="saveDeliveryAddress">
        <div class="row">
          <div class="col-sm-6">
            <input type="text" class="form-control" name="first_name" placeholder="First name">
          </div>
          <div class="col-sm-6">
            <input type="text" class="form-control" name="last_name" placeholder="Last name">
          </div>
        </div>
        <div class="row">
          <div class="col-sm-9">
            <input type="text" class="form-control" name="street" placeholder="Street">
          </div>
          <div class="col-sm-3">
            <input type="text" class="form-control" name="number" placeholder="Number">
          </div>
        </div>
        <div class="row">
          <div class="col-sm-3">
            <input type="text" class="form-control" name="zip" placeholder="Zip code">
          </div>
          <div class="col-sm-9">
            <input type="text" class="form-control" name="city" placeholder="City">
          </div>
        </div>
        <div style="text-align:right;width:100%;">
          <input type="submit" class="btn btn-default" value="save">
        </div>
      </form>
    </div>
    <div class="col-sm-6">

    </div>
  </div>
  <div class="row" id="end_buttons">
    <div class="col-sm-6">
      <button class="btn btn-warning" @click="saveShoppingCartLocal">
        <i class="fa fa-angle-left"></i>Save and Continue Shopping
      </button>
    </div>
    <div class="col-sm-6" id="checkout_button_wrapper">
      <button class="btn btn-success btn-block" @click="checkout">
        Checkout <i class="fa fa-angle-right"></i>
      </button>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex';
import CartItem from './cart/CartItem.vue';
export default {
  computed: {
    ...mapGetters(['cartItemList', 'isLoggedIn', 'products', 'currentUser', 'cartValue', 'deliveryAddress']),
    isDeliveryAddressSet(){ //Form validation for checkout submit
        return !(this.deliveryAddress.first_name == undefined &&
        this.deliveryAddress.last_name == undefined &&
        this.deliveryAddress.street == undefined &&
        this.deliveryAddress.number == undefined &&
        this.deliveryAddress.zip == undefined &&
        this.deliveryAddress.city == undefined)
    }
  },
  components: {
    appCartItem: CartItem
  },
  watch: {
    deliveryAddress(address){ //After address has been loaded from Firebase
      this.setDeliveryAddress(address);
    },
    currentUser(){ //Waiting until we get information about the user
      var uid = this.currentUser.uid;
      this.getDeliveryAddressRemote({uid: uid}); //Getting the delivery address from the user if available
    }
  },
  created(){ //When page is loading
    var uid = this.currentUser.uid;
    this.getDeliveryAddressRemote({uid: uid});
  },
  methods: {
    ...mapActions(['saveShoppingCart', 'saveDeliveryAddressRemote', 'getDeliveryAddressRemote', 'addMessage', 'saveToTransaction', 'clearCart']),
    checkValidCart(itemList, prodList) {
      let isValid = true;
      let message = "";

      itemList.map(item => {
        for (let prodIdx = 0; prodIdx < prodList.length; prodIdx++) {
          if (prodList[prodIdx].id == item.id) {
            if (prodList[prodIdx].quantity < item.quantity) {
              message = `Only ${prodList[prodIdx].quantity} ${item.title} available in stock`;
              isValid = false;
              return;
            }
            break;
          }
        }
      });
      return {
        isValid,
        message
      }
    },
    saveShoppingCartLocal() {
      if (this.isLoggedIn) {
        let {
          isValid,
          message
        } = this.checkValidCart(this.cartItemList, this.products);

        if (isValid) {
          this.saveShoppingCart({
            cartItemList: this.cartItemList,
            uid: this.currentUser.uid
          }).then(() => {
            this.addMessage({
              messageClass: 'success',
              message: 'Your shopping cart is saved successfully'
            });
            this.$router.push('/');
          });
        } else {
          this.addMessage({
            messageClass: 'danger',
            message: message
          });
        }
      } else {
        this.addMessage({
          messageClass: 'warning',
          message: 'Please login to save your cart'
        });
      }
    },
    setDeliveryAddress(address){
      //Setting address into the form
      this.$refs.delivery_form.first_name.value = address.first_name;
      this.$refs.delivery_form.last_name.value = address.last_name;
      this.$refs.delivery_form.street.value = address.street;
      this.$refs.delivery_form.number.value = address.number;
      this.$refs.delivery_form.zip.value = address.zip;
      this.$refs.delivery_form.city.value = address.city;
    },
    saveDeliveryAddress(){
      event.preventDefault();
      var uid = this.currentUser.uid;

      var first_name = this.$refs.delivery_form.first_name.value;
      var last_name = this.$refs.delivery_form.last_name.value;
      var street = this.$refs.delivery_form.street.value;
      var number = this.$refs.delivery_form.number.value;
      var zip = this.$refs.delivery_form.zip.value;
      var city = this.$refs.delivery_form.city.value;

      var address = {
        first_name: first_name,
        last_name: last_name,
        street: street,
        number: number,
        zip: zip,
        city: city
      };

      if(this.saveDeliveryAddressRemote({
        uid: uid,
        address: address
      })){ //If success
        this.addMessage({
          messageClass: 'success',
          message: "Your address has been saved."
        });
      } else { //If failed
        this.addMessage({
          messageClass: 'danger',
          message: "The address could not be saved."
        });
      }
    },
    checkout() {
      if (this.isLoggedIn) {
        if (this.isDeliveryAddressSet) {
          if (!this.cartItemList || this.cartItemList.length == 0) {
            this.addMessage({
              messageClass: 'warning',
              message: 'Your cart is empty!'
            });
            return;
          }
          let {
            isValid,
            message
          } = this.checkValidCart(this.cartItemList, this.products);

          if (isValid) {
            this.saveToTransaction({
              cartItemList: this.cartItemList,
              uid: this.currentUser.uid
            }).then(() => {
              this.addMessage({
                messageClass: 'success',
                message: 'Your order has been successfully processed!'
              });
              this.saveShoppingCart({
                cartItemList: [],
                uid: this.currentUser.uid
              });
              this.clearCart();
              this.$router.push('/');
            });
          } else {
            this.addMessage({
              messageClass: 'danger',
              message: message
            });
          }
        } else {
          this.addMessage({
            messageClass: 'warning',
            message: 'Please set a delivery address'
          });
        }
      } else {
        this.addMessage({
          messageClass: 'warning',
          message: 'Please login to checkout'
        });
      }
    }
  }
}
</script>

<style scoped>
.list-shopping-cart-leave-active {
  transition: all 0.4s;
}

.list-shopping-cart-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

#delivery_form > div.row input{
  margin-bottom: 7px;
}

#end_buttons{
  margin-top: 10px;
}

#checkout_button_wrapper{
  text-align: right;
}

#checkout_button_wrapper > button{
  width:auto;
  display: inline-block;
}
</style>
