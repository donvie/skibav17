<template>
  <q-page>
    <q-modal minimized v-model="ViewDeclinedModal" :content-css="{minWidth: '90vw'}">
      <q-modal-layout>
        <q-toolbar slot="header" color="red">
          <q-btn
            size="lg"
            flat
            round
            dense
            v-close-overlay
            icon="close"
          />
          <q-toolbar-title>
            This Request has been Declined
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-card flat>
            <q-item>
              <q-item-side :avatar="data.photoURL" />
              <q-item-main>
                <q-item-tile label>{{data.displayName}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <p class="q-mb-md">Service: {{data.Service}}</p>
                <p class="q-mb-md">Type: {{data.Type}}</p>
                <p class="q-mb-md" v-if="data.Area">{{data.Area}}</p>
                <p>Cost: {{data.Cost + lodash.sumBy(lodash.filter(data.addons, ['model', true]), 'total') | currency('')}} PHP </p>
                <p class="q-mb-md">Duration: {{data.Duration}}</p>
                <p class="q-mb-sm">wiSkiller: {{data.Candidate}}</p>
                <p class="q-mb-md">Work Address: {{data.workAddress}}</p>
                <p class="q-mb-md">Date: {{date.formatDate(data.date, 'MMM DD, YYYY')}}</p>
                <p class="q-mb-md">Time: {{date.formatDate(data.time, 'HH : mm a')}}</p>
              </q-item-main>
            </q-item>
            <q-list highlight v-if="lodash.filter(data.addons, ['model', true]).length !== 0">
              <q-list-header>{{data.sqms? 'Add-ons': 'Your Selected Furniture'}}</q-list-header>
              <q-item v-for="(a, i) in lodash.filter(data.addons, ['model', true])" :key="i">
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
          </q-card>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-modal minimized v-model="ViewCancelledModal" :content-css="{minWidth: '90vw'}">
      <q-modal-layout>
        <q-toolbar slot="header" color="red">
          <q-btn
            size="lg"
            flat
            round
            dense
            v-close-overlay
            icon="close"
          />
          <q-toolbar-title>
            This Request has been Cancelled
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-card flat>
            <q-item>
              <q-item-side :avatar="data.photoURL" />
              <q-item-main>
                <q-item-tile label>{{data.displayName}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <p class="q-mb-md">Service: {{data.Service}}</p>
                <p class="q-mb-md">Type: {{data.Type}}</p>
                <p class="q-mb-md" v-if="data.Area">{{data.Area}}</p>
                <p>Cost: {{data.Cost + lodash.sumBy(lodash.filter(data.addons, ['model', true]), 'total') | currency('')}} PHP </p>
                <p class="q-mb-md">Duration: {{data.Duration}}</p>
                <p class="q-mb-sm">wiSkiller: {{data.Candidate}}</p>
                <p class="q-mb-md">Work Address: {{data.workAddress}}</p>
                <p class="q-mb-md">Date: {{date.formatDate(data.date, 'MMM DD, YYYY')}}</p>
                <p class="q-mb-md">Time: {{date.formatDate(data.time, 'HH : mm a')}}</p>
              </q-item-main>
            </q-item>
            <q-list highlight v-if="lodash.filter(data.addons, ['model', true]).length !== 0">
              <q-list-header>{{data.sqms? 'Add-ons': 'Your Selected Furniture'}}</q-list-header>
              <q-item v-for="(a, i) in lodash.filter(data.addons, ['model', true])" :key="i">
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
          </q-card>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-modal minimized v-model="ViewCompletedModal" :content-css="{minWidth: '90vw'}">
      <q-modal-layout>
        <q-toolbar slot="header" color="green">
          <q-btn
            size="lg"
            flat
            round
            dense
            v-close-overlay
            icon="close"
          />
          <q-toolbar-title>
            This job is done!
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-card flat>
            <q-item>
              <q-item-side :avatar="data.photoURL" />
              <q-item-main>
                <q-item-tile label>{{data.displayName}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <p class="q-mb-md">Service: {{data.Service}}</p>
                <p class="q-mb-md">Type: {{data.Type}}</p>
                <p class="q-mb-md" v-if="data.Area">{{data.Area}}</p>
                <p>Cost: {{data.Cost + lodash.sumBy(lodash.filter(data.addons, ['model', true]), 'total') | currency('')}} PHP </p>
                <p class="q-mb-md">Duration: {{data.Duration}}</p>
                <p class="q-mb-sm">wiSkiller: {{data.Candidate}}</p>
                <p class="q-mb-md">Work Address: {{data.workAddress}}</p>
                <p class="q-mb-md">Date: {{date.formatDate(data.date, 'MMM DD, YYYY')}}</p>
                <p class="q-mb-md">Time: {{date.formatDate(data.time, 'HH : mm a')}}</p>
              </q-item-main>
            </q-item>
            <q-list highlight v-if="lodash.filter(data.addons, ['model', true]).length !== 0">
              <q-list-header>{{data.sqms? 'Add-ons': 'Your Selected Furniture'}}</q-list-header>
              <q-item v-for="(a, i) in lodash.filter(data.addons, ['model', true])" :key="i">
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
          </q-card>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-modal minimized v-model="open" :content-css="{minWidth: '90vw'}">
      <q-modal-layout>
        <q-toolbar slot="header" color="purple-6">
          <q-btn
            size="lg"
            flat
            round
            dense
            v-close-overlay
            icon="close"
          />
          <q-toolbar-title>
          </q-toolbar-title>
          <q-btn label="Cancel Request" @click="CancelRequest" v-close-overlay color="red" no-caps />
        </q-toolbar>

        <div class="layout-padding">
          <q-card flat>
            <q-item>
              <q-item-side :avatar="data.photoURL" />
              <q-item-main>
                <q-item-tile label>{{data.displayName}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <p class="q-mb-md">Service: {{data.Service}}</p>
                <p class="q-mb-md">Type: {{data.Type}}</p>
                <p class="q-mb-md" v-if="data.Area">{{data.Area}}</p>
                <!-- <p class="q-mb-md">Cost: {{data.Cost}} PHP</p> -->
                <p>Cost: {{data.Cost + lodash.sumBy(lodash.filter(data.addons, ['model', true]), 'total') | currency('')}} PHP </p>
                <p class="q-mb-md">Duration: {{data.Duration}}</p>
                <p class="q-mb-sm">wiSkiller: {{data.Candidate}}</p>
                <p class="q-mb-md">Work Address: {{data.workAddress}}</p>
                <p class="q-mb-md">Date: {{date.formatDate(data.date, 'MMM DD, YYYY')}}</p>
                <p class="q-mb-md">Time: {{date.formatDate(data.time, 'HH : mm a')}}</p>
              </q-item-main>
            </q-item>
            <q-list highlight v-if="lodash.filter(data.addons, ['model', true]).length !== 0">
              <q-list-header>{{data.sqms? 'Add-ons': 'Your Selected Furniture'}}</q-list-header>
              <q-item v-for="(a, i) in lodash.filter(data.addons, ['model', true])" :key="i">
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
          </q-card>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-tabs animated swipeable inverted two-lines color="purple">
      <!-- Tabs - notice slot="title" -->
      <q-tab class="capitalize text-weight-medium" default slot="title" name="tab-1" label="Request Submitted" />
      <q-tab class="capitalize text-weight-medium" slot="title" name="tab-2" label="Accepted" />
      <q-tab class="capitalize text-weight-medium" slot="title" name="tab-4" label="Declined" />
      <q-tab class="capitalize text-weight-medium" slot="title" name="tab-5" label="Cancelled" />
      <q-tab class="capitalize text-weight-medium" slot="title" name="tab-3" label="Completed" />
      <!-- Targets -->
      <q-tab-pane name="tab-1">
        <q-list separator sparse>
          <q-item v-if="pending.length === 0" class="text-center">
            <q-item-main label="No data" />
          </q-item>
          <q-item v-else v-for="(b, index) in pending" :key="index">
            <q-item-side :letter="b.displayName.charAt(0)"  inverted color="pink" />
            <q-item-main>
              <q-item-tile label>{{b.displayName}}</q-item-tile>
              <q-item-tile sublabel>
                <vue-moments-ago prefix="" suffix="ago" :date="b.timeStamp"></vue-moments-ago>
              </q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-chip @click.native="ViewBook(b)" square color="primary" class="shadow-2 q-mr-xs">View</q-chip>
              <!-- <q-chip @click.native="Accept(b)" square color="red" class="shadow-2 q-mr-xs">Cancel</q-chip> -->
            </q-item-side>
          </q-item>
        </q-list>
      </q-tab-pane>
      <q-tab-pane name="tab-2">
        <q-list separator sparse>
          <q-item v-if="accepted.length === 0" class="text-center">
            <q-item-main label="No data" />
          </q-item>
          <q-item v-else v-for="(b, index) in accepted" :key="index">
            <q-item-side :letter="b.displayName.charAt(0)"  inverted color="pink" />
            <q-item-main>
              <q-item-tile label>{{b.displayName}}</q-item-tile>
              <q-item-tile sublabel>
                <vue-moments-ago prefix="" suffix="ago" :date="b.timeStamp"></vue-moments-ago>
              </q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-chip @click="$router.push('/onschedule/'+b['.key'])" square color="primary" class="shadow-2">View</q-chip>
              <q-chip square color="primary" @click="$router.push('/chat/'+b.wiSkillerUID)" class="shadow-2 q-ml-xs">Chat</q-chip>
              <!-- <q-chip square color="red" class="shadow-2 q-ml-xs">Cancel</q-chip> -->
              <!-- <q-chip v-if="b.status === 'Accepted'" square color="green" class="shadow-2">{{b.status}}</q-chip> -->
            </q-item-side>
          </q-item>
        </q-list>
      </q-tab-pane>
      <q-tab-pane name="tab-3">
        <q-list separator sparse>
          <q-item v-if="completed.length === 0" class="text-center">
            <q-item-main label="No data" />
          </q-item>
          <q-item v-else v-for="(b, index) in completed" :key="index">
            <q-item-side :letter="b.displayName.charAt(0)"  inverted color="pink" />
            <q-item-main>
              <q-item-tile label>{{b.displayName}}</q-item-tile>
              <q-item-tile sublabel>
                <vue-moments-ago prefix="" suffix="ago" :date="b.timeStamp"></vue-moments-ago>
              </q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-chip @click.native="ViewCompleted(b)" square color="primary" class="shadow-2">View</q-chip>
              <!-- <q-chip v-if="b.status === 'Accepted'" square color="green" class="shadow-2">{{b.status}}</q-chip> -->
            </q-item-side>
          </q-item>
        </q-list>
      </q-tab-pane>
      <q-tab-pane name="tab-4">
        <q-list separator sparse>
          <q-item v-if="declined.length === 0" class="text-center">
            <q-item-main label="No data" />
          </q-item>
          <q-item v-else v-for="(b, index) in declined" :key="index">
            <q-item-side :letter="b.displayName.charAt(0)"  inverted color="pink" />
            <q-item-main>
              <q-item-tile label>{{b.displayName}}</q-item-tile>
              <q-item-tile sublabel>
                <vue-moments-ago prefix="" suffix="ago" :date="b.timeStamp"></vue-moments-ago>
              </q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-chip @click.native="ViewDeclined(b)" square color="yellow" class="shadow-2">View</q-chip>
            </q-item-side>
          </q-item>
        </q-list>
      </q-tab-pane>
      <q-tab-pane name="tab-5">
        <q-list separator sparse>
          <q-item v-if="declined.length === 0" class="text-center">
            <q-item-main label="No data" />
          </q-item>
          <q-item v-else v-for="(b, index) in cancelled" :key="index">
            <q-item-side :letter="b.displayName.charAt(0)"  inverted color="pink" />
            <q-item-main>
              <q-item-tile label>{{b.displayName}}</q-item-tile>
              <q-item-tile sublabel>
                <vue-moments-ago prefix="" suffix="ago" :date="b.timeStamp"></vue-moments-ago>
              </q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-chip @click.native="ViewCancelled(b)" square color="yellow" class="shadow-2">View</q-chip>
            </q-item-side>
          </q-item>
        </q-list>
      </q-tab-pane>
    </q-tabs>
  </q-page>
</template>

<script>
import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)
import { date } from 'quasar'
import lodash from 'lodash'
import { db } from 'src/firebase.js'
import VueMomentsAgo from 'vue-moments-ago'
export default {
  components: {
    VueMomentsAgo
  },
  data () {
    return {
      lodash,
      date,
      data: '',
      open: false,
      ViewCompletedModal: false,
      ViewCancelledModal: false,
      ViewDeclinedModal: false,
      wiRequester: [],
      Booking: [],
      pending: [],
      accepted: [],
      completed: [],
      declined: [],
      cancelled: []
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('wiRequester', db.firestore().collection('wiRequesters').doc(user.uid))
        this.$binding('Booking', db.firestore().collection('wiRequesters').doc(user.uid).collection('Booking').orderBy('timeStamp', 'desc'))
        this.$binding('pending', db.firestore().collection('wiRequesters').doc(user.uid).collection('Booking').where('status', '==', 'Pending').orderBy('timeStamp', 'desc'))
        this.$binding('accepted', db.firestore().collection('wiRequesters').doc(user.uid).collection('Booking').where('status', '==', 'Accepted').orderBy('timeStamp', 'desc'))
        this.$binding('completed', db.firestore().collection('wiRequesters').doc(user.uid).collection('Booking').where('status', '==', 'Completed').orderBy('timeStamp', 'desc'))
        this.$binding('declined', db.firestore().collection('wiRequesters').doc(user.uid).collection('Booking').where('status', '==', 'Declined').orderBy('timeStamp', 'desc'))
        this.$binding('cancelled', db.firestore().collection('wiRequesters').doc(user.uid).collection('Booking').where('status', '==', 'Cancelled').orderBy('timeStamp', 'desc'))
      } else {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    ViewBook (b) {
      this.data = b
      this.open = true
    },
    ViewCompleted (b) {
      this.data = b
      this.ViewCompletedModal = true
    },
    ViewCancelled (b) {
      this.data = b
      this.ViewCancelledModal = true
    },
    ViewDeclined (b) {
      this.data = b
      this.ViewDeclinedModal = true
    },
    CancelRequest () {
      console.log(this.data)
      db.firestore().collection('wiSkillers').doc(this.data.wiSkillerUID).collection('Booking').doc(this.data.requestID).delete().then(() => {
        console.log('Document successfully deleted!')
      }).catch(error => {
        console.error('Error removing document: ', error)
      })

      db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).collection('Booking').doc(this.data['.key']).delete().then(() => {
        this.$q.notify({
          type: 'negative',
          message: 'Your Request has been Succesfully cancelled!',
          timeout: 800
        })
      }).catch(error => {
        console.error('Error removing document: ', error)
      })
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
