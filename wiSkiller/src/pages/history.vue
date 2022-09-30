<template>
  <q-page padding>
    <q-list separator>
        <q-item v-for="(h, index) in History" :key="index">
          <!-- <pre>{{h}}</pre> -->
          <!-- <q-item-side icon="folder" inverted color="primary" /> -->
          <q-item-main>
          <q-item-tile label>{{h.service}}</q-item-tile>
          <q-item-tile label>{{h.type}}</q-item-tile>
          <q-item-tile label>{{h.area}}</q-item-tile>
          <q-item-tile sublabel>{{date.formatDate(h.timestamp, 'MMM DD, YYYY')}}</q-item-tile>
          </q-item-main>
          <q-item-side right icon="info" color="green" />
        </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { db } from 'src/firebase.js'
import { date } from 'quasar'
export default {
  data () {
    return {
      date,
      History: []
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('History', db.firestore().collection('wiSkillers').doc(user.uid).collection('History').orderBy('timestamp', 'desc'))
      } else {
        this.$router.push('/login')
      }
    })
  }

}
</script>

<style>

</style>
