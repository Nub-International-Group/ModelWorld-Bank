<template>
  <div class="col-md-12">
    <div class="panel panel-primary">
      <div class="panel-heading">
        Account Description
      </div>
      <div class="panel-footer">
        <div class="row">
          <div class="col-md-12">
            <label for="wage-name">Account Description:</label>
            <div class="input-group">
              <span class="input-group-addon">Description:</span>
              <input v-model="newDescription" type="text" class="form-control">
            </div>
            <br>
            <button type="button" v-on:click="updateDescription" class="btn btn-primary">Save Description</button>
          </div>
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
    name: 'TransactionDescriptionDialogue',
    store: ['user', 'jwt'],
    props: ['description'],
    data: function () {
      return {
        newDescription: this.description
      }
    },
    methods: {
      updateDescription: function () {
        swal({
          title: 'ARE YOU SURE?',
          icon: 'warning',
          text: 'Clicking \'ok\' will change the description',
          dangerMode: true,
          buttons: true
        }).then((choice) => {
          if (choice === true) {
            axios.request({
              url: '/api/account/id/' + this.$route.params.id,
              headers: {jwt: this.$store.jwt},
              data: {changes: {description: this.newDescription}},
              method: 'put'
            }).then((response) => {
              this.$emit('updatedAccountDescription')
            }).catch(errorHandler)
          }
        })
      }
    }
  }
</script>
