<template>
  <div class="container">
    <h2>Feedback</h2>
    <p>If you want to give some feedback to the vendor, you can do that here:</p>
    <form ref="feedback" id="feedback" @submit="submitFeedback">
      <input type="email" v-model="email" class="form-control" name="email" placeholder="Email">
      <textarea class="form-control" v-model="text" rows="6" name="text" placeholder="Feedback"></textarea>
      <div style="width:100%;text-align:right;">
        <input type="submit" class="btn btn-default" :disabled="!isFilled" value="submit">
      </div>
    </form>
  </div>
</template>
<script>
import {
  mapActions
} from 'vuex';

export default {
  name: "Feedback",
  data() {
    return {
      email: "",
      text: ""
    }
  },
  computed: {
    isFilled(){
      return this.email.trim() != "" && this.text.trim() != "";
    }
  },
  methods: {
    ...mapActions(['submitFeedbackRemote', 'addMessage']),
    submitFeedback(){
      event.preventDefault();
      if(this.isFilled){
        if(this.submitFeedbackRemote({email: this.email, text: this.text})){
          this.addMessage({
            messageClass: 'success',
            message: "The feedback has been sent.",
          });
          this.email = "";
          this.text = "";
        } else {
          this.addMessage({
            messageClass: 'danger',
            message: "An error occurred during sending the form.",
          });
        }
      }
    }
  }
}
</script>
<style>
.form-control, .btn{
  margin-top: 7px;
  resize: none;
}
</style>
