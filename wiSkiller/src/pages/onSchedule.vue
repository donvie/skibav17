<template>
  <q-page>
    <!-- <pre>{{wiSkiller}}</pre> -->
    <q-card v-if="wiSkiller">
      <q-card-title>
        <img style="height: 80px; width: 80px" :src="wiSkiller.photoURL" class="avatar"/>
        <div class="ellipsis">{{wiSkiller.displayName}}</div>
        <!-- <q-rating slot="subtitle" v-model="stars" :max="5" /> -->
      </q-card-title>
      <q-card-main>
        <p><span class="text-faded">Service: </span> {{wiSkiller.Service}}</p>
        <p><span class="text-faded">Type: </span> {{wiSkiller.Type}}</p>
        <p><span class="text-faded" v-if="wiSkiller.Area">Area: </span> {{wiSkiller.Area}}</p>
        <p>Cost: {{wiSkiller.Cost + lodash.sumBy(lodash.filter(wiSkiller.addons, ['model', true]), 'total') | currency('')}} PHP</p>
        <p><span class="text-faded">Time: </span> {{wiSkiller.Duration}}</p>
        <p><span class="text-faded">wiSkiller: </span> {{wiSkiller.Candidate}}</p>
        <p><span class="text-faded">Work Address: </span> {{wiSkiller.workAddress}}</p>
        <p><span class="text-faded">Date: </span> {{date.formatDate(wiSkiller.date, 'MMM DD, YYYY')}}</p>
        <p><span class="text-faded">Time: </span> {{date.formatDate(wiSkiller.time, 'HH : mm a')}}</p>
        <q-list highlight v-if="lodash.filter(wiSkiller.addons, ['model', true]).length !== 0">
          <q-list-header>{{wiSkiller.sqms? 'Add-ons': 'Your Selected Furniture'}}</q-list-header>
          <q-item v-for="(a, i) in lodash.filter(wiSkiller.addons, ['model', true])" :key="i">
            <q-item-main>
              <!-- <pre>{{a}}</pre> -->
              <q-item-tile label>Name: {{a.name}}</q-item-tile>
              <q-item-tile label>Cost: {{a.cost | currency('')}} Php</q-item-tile>
              <!-- <q-item-tile label>Duration: {{a.duration}}</q-item-tile>
              <q-item-tile label>wiSkiller: {{a.wiSkiller}}</q-item-tile> -->
              <q-item-tile label>Quantity: {{a.quantity}} qty</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-card-main>
    </q-card>
    <!-- {{wiSkiller.status}} -->
    <span style="display:none" v-if="wiSkiller"> {{ currentStep = wiSkiller.steps }} </span>
    <q-stepper no-header-navigation ref="stepper" vertical v-model="currentStep">
      <q-step class="uppercase" :default="currentStep === 'Arrived'" title="Arrived" name="Arrived">
        <blockquote class="capitalize">
          Click when you're at wiRequester location.
        </blockquote>
        <q-stepper-navigation>
          <q-btn
            @click="Arrived"
            color="green"
            label="Next"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step class="uppercase" :default="currentStep === 'WorkDone'" title="Work Done" name="WorkDone">
        <blockquote class="capitalize">
          click when work is done and let wiRequester sign digitally.
        </blockquote>
        <q-stepper-navigation>
          <q-btn
            color="green"
             @click="WorkDone"
            label="Next"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step class="uppercase" :default="currentStep === 'Signature'" title="Signature" name="Signature">
        <VueSignaturePad
          class="bg-purple-2"
          height="100px"
          ref="signaturePad"
        /> <br>
        <q-btn @click="undo" icon="undo" color="blue" />
        <q-stepper-navigation>
          <q-btn
            @click="Finish"
            icon="fas fa-check"
            color="green"
            label="Finish and Exit"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import { db } from 'src/firebase.js'
import { date } from 'quasar'
import Vue from 'vue'
import lodash from 'lodash'
import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)
import VueSignaturePad from 'vue-signature-pad'
Vue.use(VueSignaturePad)
export default {
  data () {
    return {
      lodash,
      date,
      currentStep: '',
      wiSkiller: [],
      skiller: []
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('skiller', db.firestore().collection('wiSkillers').doc(user.uid))
        this.$binding('wiSkiller', db.firestore().collection('wiSkillers').doc(user.uid).collection('Booking').doc(this.$route.params.id))
      } else {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    undo () {
      this.$refs.signaturePad.undoSignature()
    },
    Finish () {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      if (isEmpty) {
        this.$q.notify({
          type: 'negative',
          message: 'Add your signature Please!'
        })
      } else {
        this.$q.dialog({
          title: 'Confirm',
          message: 'Are you sure this transaction is completed?',
          ok: {
            label: 'OK'
          },
          cancel: {
            color: 'negative',
            label: 'Cancel'
          }
        }).then(() => {
          db.firestore().collection('wiSkillers').doc(this.skiller.uid).collection('Booking').doc(this.$route.params.id).set({
            status: 'Completed'
          }, { merge: true }).then(() => {
            db.storage().ref().child(this.skiller.uid + '/' + 'OnSchedule' + '/' + this.$route.params.id).putString(data, 'data_url').then(function (snapshot) {
              console.log('Uploaded a data_url string!')
            })
          }).catch(error => {
            console.error('Error updating document: ', error)
          })

          db.firestore().collection('wiRequesters').doc(this.wiSkiller.wiRequesterUID).collection('Booking').doc(this.wiSkiller.requestID).set({
            status: 'Completed'
          }, { merge: true }).then(() => {
            this.$router.push('/booking')
          }).catch(error => {
            console.error('Error updating document: ', error)
          })
        }).catch(() => {
        })
      }
    },
    Arrived () {
      db.firestore().collection('wiSkillers').doc(this.skiller.uid).collection('Booking').doc(this.$route.params.id).set({
        steps: 'WorkDone'
      }, { merge: true }).then(() => {

      }).catch(error => {
        console.error('Error updating document: ', error)
      })

      db.firestore().collection('wiRequesters').doc(this.wiSkiller.wiRequesterUID).collection('Booking').doc(this.wiSkiller.requestID).set({
        steps: 'WorkDone'
      }, { merge: true }).then(() => {

      }).catch(error => {
        console.error('Error updating document: ', error)
      })
    },
    WorkDone () {
      db.firestore().collection('wiSkillers').doc(this.skiller.uid).collection('Booking').doc(this.$route.params.id).set({
        steps: 'Signature'
      }, { merge: true }).then(() => {

      }).catch(error => {
        console.error('Error updating document: ', error)
      })
      db.firestore().collection('wiRequesters').doc(this.wiSkiller.wiRequesterUID).collection('Booking').doc(this.wiSkiller.requestID).set({
        steps: 'Review'
      }, { merge: true }).then(() => {

      }).catch(error => {
        console.error('Error updating document: ', error)
      })
    }
  }
}
</script>

<style>

</style>
