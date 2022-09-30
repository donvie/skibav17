<template>
  <q-page>
    <!-- <pre>{{wiSkiller}}</pre> -->
    <q-card v-if="wiRequester">
      <q-card-title>
        <img style="height: 80px; width: 80px" :src="wiRequester.photoURL" class="avatar"/>
        <div class="ellipsis">{{wiRequester.displayName}}</div>
        <!-- <q-rating slot="subtitle" v-model="stars" :max="5" /> -->
      </q-card-title>
      <q-card-main>
        <p><span class="text-faded">Service: </span> {{wiRequester.Service}}</p>
        <p><span class="text-faded">Type: </span> {{wiRequester.Type}}</p>
        <p><span class="text-faded" v-if="wiRequester.Area">Area: </span> {{wiRequester.Area}}</p>
        <!-- <p><span class="text-faded">Cost: </span> {{wiRequester.Cost}} PHP</p> -->
        <!-- <pre> {{wiRequester}} </pre> -->
        <p>Cost: {{wiRequester.Cost + lodash.sumBy(lodash.filter(wiRequester.addons, ['model', true]), 'total') | currency('')}} PHP</p>
        <p><span class="text-faded">Time: </span> {{wiRequester.Duration}}</p>
        <p><span class="text-faded">wiSkiller: </span> {{wiRequester.Candidate}}</p>
        <p><span class="text-faded">Work Address: </span> {{wiRequester.workAddress}}</p>
        <p><span class="text-faded">Date: </span> {{date.formatDate(wiRequester.date, 'MMM DD, YYYY')}}</p>
        <p><span class="text-faded">Time: </span> {{date.formatDate(wiRequester.time, 'HH : mm a')}}</p>
        <q-list highlight v-if="lodash.filter(wiRequester.addons, ['model', true]).length !== 0">
          <q-list-header>{{wiRequester.sqms? 'Add-ons': 'Your Selected Furniture'}}</q-list-header>
          <q-item v-for="(a, i) in lodash.filter(wiRequester.addons, ['model', true])" :key="i">
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
   <span style="display:none" v-if="wiRequester"> {{ currentStep = wiRequester.steps }} </span>
    <q-stepper no-header-navigation ref="stepper" vertical v-model="currentStep">
      <q-step class="uppercase" :default="currentStep === 'Arrived'" title="Arrived" name="Arrived">
        <blockquote class="capitalize">
          wiSkiller arrived
        </blockquote>
      </q-step>

      <q-step class="uppercase" :default="currentStep === 'WorkDone'" title="Work Done" name="WorkDone">
        <blockquote class="capitalize">
          Your work is done
        </blockquote>
      </q-step>

      <q-step class="uppercase" :default="currentStep === 'Review'" title="Rate Me Now" subtitle="Ratings and Comments" name="Review">
        <q-rating v-model="ratings" :max="5" size="36px" icon="star" />
        <br>
        <q-input
          class="capitalize"
          v-model="comments"
          type="textarea"
          float-label="Write your comments"
          :max-height="10"
          rows="3"
        />
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
    <div class="row justify-end">
      <q-btn @click="Cancelled" label="Cancel" size="xs" color="red" class="q-ma-sm" />
    </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import lodash from 'lodash'
import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)
import { db } from 'src/firebase.js'
import { date } from 'quasar'
export default {
  data () {
    return {
      lodash,
      date,
      currentStep: '',
      ratings: 5,
      comments: '',
      wiRequester: [],
      requester: []
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('requester', db.firestore().collection('wiRequesters').doc(user.uid))
        this.$binding('wiRequester', db.firestore().collection('wiRequesters').doc(user.uid).collection('Booking').doc(this.$route.params.id))
      } else {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    Arrived () {
      db.firestore().collection('wiRequesters').doc(this.requester.uid).collection('Booking').doc(this.wiRequester.requestID).set({
        steps: 'WorkDone'
      }, { merge: true }).then(() => {

      }).catch(error => {
        console.error('Error updating document: ', error)
      })

      // db.firestore().collection('wiSkillers').doc(this.wiSkiller.uid).set({
      //   Request: {
      //     status: 'WorkDone'
      //   }
      // }, { merge: true }).then(() => {
      // }).catch(error => {
      //   console.error('Error updating document: ', error)
      // })
    },
    Cancelled () {
      let requester = db.firestore().collection('wiRequesters').doc(this.requester.uid).collection('Booking').doc(this.wiRequester['.key'])
      requester.update({
        status: 'Cancelled'
      })

      let skiller = db.firestore().collection('wiSkillers').doc(this.wiRequester.wiSkillerUID).collection('Booking').doc(this.wiRequester.requestID)
      skiller.update({
        status: 'Cancelled'
      })
      this.$router.push('/booking')
      this.$q.notify({
        type: 'negative',
        message: 'Your Request has been Succesfully declined!',
        timeout: 800
      })
    },
    WorkDone () {
      db.firestore().collection('wiRequesters').doc(this.requester.uid).collection('Booking').doc(this.wiRequester.requestID).set({
        steps: 'Signature'
      }, { merge: true }).then(() => {

      }).catch(error => {
        console.error('Error updating document: ', error)
      })
    },
    Finish () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure to submit final rating?',
        ok: {
          label: 'OK'
        },
        cancel: {
          color: 'negative',
          label: 'Cancel'
        }
      }).then(() => {
        db.firestore().collection('wiSkillers').doc(this.wiRequester.wiSkillerUID).collection('Reviews').add({
          displayName: this.requester.displayName,
          photoURL: this.requester.photoURL,
          ratings: this.ratings,
          comments: this.comments,
          service: this.wiRequester.Service,
          area: this.wiRequester.Area,
          cost: this.wiRequester.Cost,
          duration: this.wiRequester.Duration,
          candidate: this.wiRequester.Candidate,
          type: this.wiRequester.Type,
          timestamp: date.formatDate(Date.now(), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
        }).then(() => {
          this.$router.push('/booking')
        }).catch(error => {
          console.error('Error updating document: ', error)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style>

</style>
