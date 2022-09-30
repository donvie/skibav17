<template>
  <q-layout>
    <q-layout-header>
      <q-toolbar color="purple">
        <q-btn
          size="lg"
          flat round dense
          @click="goBack()"
          icon="fas fa-arrow-left"
        />

        <q-toolbar-title>
          Verify your Account
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <q-page padding>
        <!-- <pre>{{user}}</pre> -->
        <div class="row gutter-md">
          <!-- <div class="col-12 text-center">
            <big class="text-bold text-purple">Verify your Account</big>
          </div> -->
          <div class="col-12">
            <q-input disable v-model="displayName" color="purple" float-label="Full Name" placeholder="Full Name" />
          </div>
          <div class="col-12">
            <q-input disable v-model="email" color="purple" float-label="Email Address" placeholder="Email Address" />
          </div>
          <div class="col-12">
            <q-input v-model="secretCode" color="purple" float-label="Secret Code" />
          </div>
          <div class="col-12">
            <q-input v-model="address" color="purple" float-label="Address" />
          </div>
          <div class="col-12">
            <q-input type="number" v-model="age" color="purple" float-label="Age" />
          </div>
          <div class="col-12">
            <q-input v-model="phoneNumber" type="text" float-label="Phone Number" placeholder="+639123456789" />
          </div>
          <div class="col-12 text-center">
            <q-btn @click="signUp" :loading="loading" color="purple" label="Sign up" no-caps />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { db, firestore } from 'src/firebase.js'
export default {
  data () {
    return {
      loading: false,
      uid: '',
      displayName: '',
      photoURL: '',
      email: '',
      address: '',
      age: '',
      phoneNumber: '',
      secretCode: ''
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid
        this.displayName = user.displayName
        this.photoURL = user.photoURL
        this.email = user.email
      }
    })
  },
  methods: {
    goBack () {
      db.auth().signOut().then(() => {
        this.$router.push('/login')
      })
    },
    signUp () {
      this.loading = true
      db.firestore().collection('wiSkillers').doc(this.uid).set({
        uid: this.uid,
        displayName: this.displayName,
        photoURL: this.photoURL,
        email: this.email,
        age: this.age,
        address: this.address,
        phoneNumber: this.phoneNumber,
        secretCode: this.secretCode,
        topUp: 0,
        hasBook: false,
        Request: {},
        longlat: new firestore.GeoPoint(0, 0),
        realtimeBooking: false
      }).then(() => {
        this.loading = false
        this.$router.push('/')
      }).catch(error => {
        console.error('Error writing document: ', error)
      })
    }
  }
}
</script>
<style>
</style>
