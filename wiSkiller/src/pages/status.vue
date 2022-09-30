<template>
  <q-page padding>
     <q-card v-if="wiSkiller.Request">
      <q-card-title>
        <img style="height: 80px; width: 80px" :src="wiSkiller.Request.photoURL" class="avatar"/>
        <div class="ellipsis">{{wiSkiller.Request.displayName}}</div>
        <!-- <q-rating slot="subtitle" v-model="stars" :max="5" /> -->
      </q-card-title>
      <q-card-main>
        <!-- <pre> {{wiSkiller}} </pre> -->
        <p><span class="text-faded">Service: </span> {{wiSkiller.Request.Service}}</p>
        <p><span class="text-faded" v-if="wiSkiller.Request.Area"></span> {{wiSkiller.Request.Area}}</p>
        <p>Cost: {{wiSkiller.Request.Cost + lodash.sumBy(lodash.filter(wiSkiller.Request.addons, ['model', true]), 'total') | currency('')}} PHP</p>
        <p><span class="text-faded">Time: </span> {{wiSkiller.Request.Duration}}</p>
        <p><span class="text-faded">wiSkiller: </span> {{wiSkiller.Request.Candidate}}</p>
        <!-- <p class="text-faded">
          Small plates, salads & sandwiches in an intimate setting.
        </p> -->
        <q-list highlight v-if="lodash.filter(wiSkiller.Request.addons, ['model', true]).length !== 0">
            <q-list-header>{{wiSkiller.Request.sqms? 'Add-ons': 'Selected Furniture'}}</q-list-header>
            <q-item v-for="(a, i) in lodash.filter(wiSkiller.Request.addons, ['model', true])" :key="i">
              <q-item-main>
                <!-- <pre>{{a}}</pre> -->
                <q-item-tile label>Name: {{a.name}}</q-item-tile>
                <q-item-tile label>Cost: {{a.cost | currency('')}} Php</q-item-tile>
                <!-- <q-item-tile label>Duration: {{a.duration}}</q-item-tile>
                <q-item-tile label>wiSkiller: {{a.wiSkiller}}</q-item-tile> -->
                <q-item-tile label>Quantity: {{a.quantity}}</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
      </q-card-main>
      <!-- <q-card-main  v-if="wiSkiller.Request">
        <p>{{wiSkiller.Request.service}}</p>
        <p class="text-faded"><span class="text-bold">Area: </span>{{wiSkiller.Request.sqms}}</p>
        <p class="text-faded"><span class="text-bold">Cost: </span>{{wiSkiller.Request.cost}} PHP</p>
        <p class="text-faded"><span class="text-bold">TIme: </span>{{wiSkiller.Request.hour}}</p>
        <p class="text-faded"><span class="text-bold">Candidate: </span>{{wiSkiller.Request.skiller}}</p>
        <q-card-separator /> <br>
        <p>Your Status</p>
        <p>Arrived</p>
        <p class="text-faded">{{wiSkiller.arrived ? 'Yes': 'No'}}</p>
        <p>Work Done</p>
        <p class="text-faded">{{wiSkiller.workDone ? 'Yes': 'No'}}</p>
      </q-card-main> -->
    </q-card>

    <!-- <q-stepper ref="stepper" vertical v-model="currentStep">
      <q-step :default="currentStep === 'Arrived'" title="Arrived" name="Arrived">
        <blockquote>
          Meet your wiSkiller now and start your service. And click Next
        </blockquote>
      </q-step>

      <q-step :default="currentStep === 'WorkDone'" title="Work Done" name="WorkDone">
        <blockquote>
        All is done? Click Next and Rate your service now
        </blockquote>
      </q-step>

      <q-step :default="currentStep === 'Review'" title="Review" name="Review">
        Review
        <q-stepper-navigation>
          <q-btn
            @click="Finish"
            icon="fas fa-check"
            color="green"
            label="Finish and Exit"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper> -->
   <span style="display:none" v-if="wiSkiller.Request"> {{ currentStep = wiSkiller.Request.status }} </span>
    <q-stepper no-header-navigation ref="stepper" vertical v-model="currentStep">
      <q-step active-icon="fas fa-car" :default="currentStep === 'Arrived'" title="ARRIVED" name="Arrived">
        <blockquote>
          Click when you're at wiRequester location.
        </blockquote>
        <q-stepper-navigation>
          <q-btn
            color="green"
            @click="Arrived"
            label="Next"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step active-icon="fas fa-thumbs-up" :default="currentStep === 'WorkDone'" title="WORK DONE" name="WorkDone">
        <blockquote>
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

      <q-step active-icon="fas fa-signature" :default="currentStep === 'Signature'" title="SIGNATURE" name="Signature">
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
            label="Done and Exit"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
import lodash from 'lodash'
Vue.use(Vue2Filters)
import { db } from 'src/firebase.js'
import VueSignaturePad from 'vue-signature-pad'
Vue.use(VueSignaturePad)
export default {
  data () {
    return {
      lodash,
      currentStep: '',
      ratings: 5,
      comments: '',
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
  },
  methods: {
    undo () {
      this.$refs.signaturePad.undoSignature()
    },
    Arrived () {
      db.firestore().collection('wiRequesters').doc(this.wiSkiller.Request.wiRequesterUID).set({
        Request: {
          status: 'WorkDone'
        }
      }, { merge: true }).then(() => {

      }).catch(error => {
        console.error('Error updating document: ', error)
      })

      db.firestore().collection('wiSkillers').doc(this.wiSkiller.uid).set({
        Request: {
          status: 'WorkDone'
        }
      }, { merge: true }).then(() => {
      }).catch(error => {
        console.error('Error updating document: ', error)
      })
    },
    WorkDone () {
      db.firestore().collection('wiRequesters').doc(this.wiSkiller.Request.wiRequesterUID).set({
        Request: {
          status: 'Review'
        }
      }, { merge: true }).then(() => {

      }).catch(error => {
        console.error('Error updating document: ', error)
      })

      db.firestore().collection('wiSkillers').doc(this.wiSkiller.uid).set({
        Request: {
          status: 'Signature'
        }
      }, { merge: true }).then(() => {
      }).catch(error => {
        console.error('Error updating document: ', error)
      })
    },
    Finish () {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      if (isEmpty) {
        this.$q.notify({
          type: 'negative',
          message: 'Add your signature Please!'
        })
      } else {
        db.firestore().collection('wiSkillers').doc(this.wiSkiller.uid).collection('History').add({
          displayName: this.wiSkiller.Request.displayName,
          photoURL: this.wiSkiller.Request.photoURL,
          service: this.wiSkiller.Request.Service,
          area: this.wiSkiller.Request.Area,
          cost: this.wiSkiller.Request.Cost,
          duration: this.wiSkiller.Request.Duration,
          candidate: this.wiSkiller.Request.Candidate,
          type: this.wiSkiller.Request.Type,
          timestamp: Date.now()
        }).then(response => {
          console.log(isEmpty)
          db.storage().ref().child(this.wiSkiller.uid + '/' + 'Realtime' + '/' + response.id).putString(data, 'data_url').then(function (snapshot) {
            console.log('Uploaded a data_url string!')
          })

          db.firestore().collection('wiSkillers').doc(this.wiSkiller.uid).update({
            Request: {},
            realtimeBooking: false
          }).then(() => {
            this.$router.push('/')
            this.$q.notify({
              message: 'This is service is closed',
              timeout: 2000,
              type: 'positive',
              icon: 'done'
            })
          }).catch(error => {
            console.error('Error updating document: ', error)
          })
        }).catch(error => {
          console.error('Error updating document: ', error)
        })
      }
    }
  }
}
</script>

<style>
.q-item-avatar, .q-item-avatar img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
</style>
