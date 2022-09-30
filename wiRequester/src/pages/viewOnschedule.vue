<template>
  <q-page padding>
    <q-list separator sparse>
      <q-item v-for="(w, index) in wiSkillers" :key="index">
        <q-item-side>
          <q-item-tile avatar>
            <img style="height: 40px; width: 40px;" :src="w.photoURL">
          </q-item-tile>
        </q-item-side>
        <q-item-main :label="w.displayName" :sublabel="w.address" />
        <q-item-side right>
          <!-- <q-item-tile icon="Book" color="green" /> -->
          <q-btn @click.native="ViewBookOnSchedule(w)" label="View & Schedule" no-caps color="purple" />
        </q-item-side>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { db } from 'src/firebase.js'
export default {
  data () {
    return {
      wiSkillers: []
    }
  },
  mounted () {
    this.$binding('wiSkillers', db.firestore().collection('wiSkillers'))
    db.auth().onAuthStateChanged(user => {
      if (user) {

      } else {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    ViewBookOnSchedule (skiller) {
      skiller.type = 'OnSchedule'
      this.$store.commit('example/skillerProfileState', skiller)
      this.$router.push('/profile')
    }
  }
}
</script>

<style>

</style>
