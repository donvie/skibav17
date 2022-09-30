<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { date } from 'quasar'
import { db } from 'src/firebase.js'
export default {
  name: 'App',
  data () {
    return {
      messages1: [],
      wiRequester: []
    }
  },
  mounted () {
    document.addEventListener('deviceready', () => {
      cordova.plugins.notification.local.hasPermission(function (granted) {
      })
      cordova.plugins.backgroundMode.enable()
    }, false)
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('wiRequester', db.firestore().collection('wiRequesters').doc(user.uid))
        db.firestore().collection('wiRequesters').doc(user.uid).get().then(doc => {
          if (doc.data().realtimeBooking === true) {
            this.$binding('messages1', db.firestore().collection('wiRequesters').doc(user.uid).collection(user.uid + doc.data().Request.wiSkillerUID).orderBy('stamp', 'desc').limit(1))
          } else {
            console.log('No such document!')
          }
        }).catch(error => {
          console.log('Error getting document:', error)
        })
      } else {
        this.$router.push('/login')
      }
    })
  },
  watch: {
    messages1 (messages1) {
      if (messages1[0]) {
        if (date.getDateDiff(Date.now(), messages1[0].stamp, 'seconds') < 10) {
          if (messages1[0].uid !== this.wiRequester.uid) {
            cordova.plugins.notification.local.schedule({
              title: 'Message',
              text: messages1[0].text[messages1[0].text.length - 1],
              foreground: true
            })
          }
        }
      }
    }
  }
}
</script>

<style>
/* p,h1,h2,h3,h4 {
font-family: Arial, Helvetica, sans-serif !important;
} */
@font-face {
  font-family: Inconsolata;
  src: url(~assets/Inconsolata-Regular.ttf)
}

body {
  font-family: Inconsolata;
}
.leaflet-top {
  font-family: Inconsolata;
}
</style>
