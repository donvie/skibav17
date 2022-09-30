<template>
  <q-page padding>
    <q-list
      no-border
    >
      <q-list-header>Top-up Current Balance</q-list-header>
      <q-item>
        <q-item-side color="purple">
          <q-icon size="36px" name="account_balance_wallet" />
        </q-item-side>
        <q-item-main>
          {{wiSkiller.topUp}} PHP
        </q-item-main>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { db } from 'src/firebase.js'
export default {
  data () {
    return {
      wiSkiller: []
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('wiSkiller', db.firestore().collection('wiSkillers').doc(user.uid))
      } else {
        this.$router.push('/login')
      }
    })
  }
}
</script>
