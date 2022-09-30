<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-jumbotron style="height: 100vh" gradient="circle, rgba(255,192,203,1) 0%, rgba(128,0,128,1) 80%">
          <div class="text-center q-mt-xl q-mb-xl">
            <img style="height:auto; width:300px;" src="~assets/skiba_new.png">
          </div>
          <q-btn @click="$router.push('/')" icon="mdi-facebook" size="lg" color="white" class="full-width q-mb-sm q-mt-xl text-weight-bolder text-blue" label="Log in with Facebook" no-caps />
          <q-btn @click="googleLogin" icon="mdi-google" size="lg" color="white" class="full-width text-weight-bolder text-red" label="Log in with Google" no-caps />
        </q-jumbotron>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { auth, db } from 'src/firebase.js'
export default {
  data () {
    return {
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        db.firestore().collection('wiSkillers').doc(user.uid).get().then(snapshot => {
          if (snapshot.exists === false) {
            console.log('verify')
            this.$router.push('/verify_account')
          } else {
            this.$router.push('/')
          }
        })
      } else {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    facebookLogin () {
      let provider = new auth.FacebookAuthProvider()
      db.auth().signInWithRedirect(provider)
    },
    googleLogin () {
      let provider = new auth.GoogleAuthProvider()
      db.auth().signInWithRedirect(provider)
    }
  }
}
</script>
<style>
</style>
