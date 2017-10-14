<template>
  <div id="PageAdminAccount">
    <div class="page-header">
      <h1>Account Addition
        <small>Add a new account</small>
      </h1>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Add Account
          </div>
          <form>
            <div class="panel-body">
              <div class="input-group">
                <span class="input-group-addon">Account Name:</span>
                <input v-model="newAccount.name" type="text" id="wage-name" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Account Description:</span>
                <input v-model="newAccount.description" type="text" id="wage-description" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <span class="input-group-addon">Initial Owner (Case Sensitive without /u/):</span>
                <input v-model="newAccount.owner" type="text" id="wage-amount" class="form-control">
              </div>
              <br>
              <div class="input-group">
                <label for="sel1">Public Account:</label>
                <select v-model="newAccount.public" class="form-control" id="sel1">
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            </div>
            <div class="panel-footer">
              <button v-on:click="submitNew" type="button" class="btn btn-primary">Submit Form</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import errorHandler from '@/errorHandler'
import swal from 'sweetalert'

export default {
  name: 'PageAdminAccount',
  store: ['user', 'jwt', 'currencies'],
  data: function () {
    return {
      newAccount: {
        name: '',
        description: '',
        owner: '',
        public: ''
      }
    }
  },
  methods: {
    submitNew: function (event) {
      let $this = this
      axios.request({
        url: '/api/account',
        method: 'post',
        headers: {jwt: this.$store.jwt},
        data: {newDocument: $this.newAccount}
      }).then(function (response) {
        swal({
          title: 'Creation Success!',
          icon: 'success',
          text: 'Account succesfully created!',
          buttons: {
            stay: {
              text: 'Stay Here',
              value: false
            },
            change: {
              text: 'Visit Account',
              value: true
            }
          }
        }).then((choice) => {
          if (choice) {
            $this.$router.push('/account/' + response.data['_id'])
          }
        })
        console.log(response.data)
      }).catch(errorHandler)
    }
  }
}
</script>