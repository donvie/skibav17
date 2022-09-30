<template>
  <q-page>
    <q-modal v-model="addFurniture" minimized :content-css="{minWidth: '90vw', minHeight: '90vh'}">
      <q-modal-layout>
        <q-toolbar color="purple" slot="header">
          <q-btn
            flat
            dense
            round
            size="md"
            v-close-overlay
            icon="fas fa-arrow-left"
          />
          <q-toolbar-title>
            Select All That Applies
          </q-toolbar-title>
        </q-toolbar>

        <q-toolbar slot="footer" color="white">
          <q-toolbar-title class="text-purple">
            Total: {{lodash.sumBy(lodash.filter(SpecialFurniture, ['model', true]), 'total') | currency('')}} PHP
          </q-toolbar-title>
            <q-btn
              :disable="lodash.filter(SpecialFurniture, ['model', true]).length === 0"
              color="purple"
              size="md"
              label="OK"
              @click="addFurniture = false"
            />
          <!-- <q-btn color="purple" label="Add" /> -->
        </q-toolbar>

        <div class="layout-padding">
          <!-- <pre> {{lodash.filter(SpecialFurniture, ['model', true])}} </pre> -->
          <q-list link>
            <q-item v-for="(sf, sfi) in SpecialFurniture" :key="sfi" tag="label">
              <span style="display: none;">{{sf.total = sf.cost * sf.quantity}}</span>
              <q-item-side>
                <q-checkbox color="purple" v-model="sf.model" />
              </q-item-side>
            <q-item-main>
              <q-item-tile label>
                <!-- <span v-if="sfi >= 4">Name:</span> -->
                {{sf.name}}
              </q-item-tile>
              <q-item-tile sublabel>Cost: {{sf.cost * sf.quantity | currency('')}} PHP</q-item-tile>
              <!-- <q-item-tile sublabel>Duration: {{sf.duration}}</q-item-tile>
              <q-item-tile sublabel>wiSkiller: {{sf.wiSkiller}}</q-item-tile> -->
            </q-item-main>
              <q-item-side right>
                <div class="row gutter-xs">
                  <div class="col-12 text-center">
                    <b>Qty: {{sf.quantity}}</b>
                  </div>
                  <div class="col-6 text-center">
                    <q-btn size="sm" @click="sf.quantity++" color="primary" round dense icon="add"/>
                  </div>
                  <div class="col-6 text-center">
                    <q-btn size="sm" @click="sf.quantity--" color="negative" round dense icon="remove"/>
                  </div>
                </div>
                <!-- <q-knob
                  size="80px"
                  color="purple"
                  v-model="sf.quantity"
                  :min="min"
                  :max="max"
                >
                <center><span style="font-size: 8px;">
                  <span style="font-size: 12px;"><b>{{sf.quantity}}</b><br></span>Increase <br> Qty. here</span></center>
                </q-knob> -->
              </q-item-side>
            </q-item>
          </q-list>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-modal minimized v-model="BookToday" :content-css="{minWidth: '80%'}">
      <q-modal-layout>
        <q-toolbar slot="header" color="purple">
          <q-toolbar-title>
            Confirmation
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-card flat>
            <q-item>
              <q-item-main>
                <b class="text-red">Sure you want this service done Today?</b> <br><br><br>
                <p>Service : {{serviceData.service}}</p>
                <p>Type: {{serviceData.type}}</p>
                <p>{{serviceData.sqms}}</p>
                <p>Cost: {{serviceData.data.cost + lodash.sumBy(lodash.filter(SpecialFurniture, ['model', true]), 'total') | currency('')}} PHP</p>
                <p>Duration: {{serviceData.data.duration}}</p>
                <p>wiSkiller: {{serviceData.data.wiSkiller}}</p>
              </q-item-main>
            </q-item>
            <q-list highlight v-if="lodash.filter(SpecialFurniture, ['model', true]).length !== 0">
              <q-list-header>{{serviceData.sqms? 'Add-ons': 'Your Selected Furniture'}}</q-list-header>
              <q-item v-for="(a, i) in lodash.filter(SpecialFurniture, ['model', true])" :key="i">
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
            <q-card-actions class="justify-end">
            <q-btn
              color="red"
              label="Cancel"
              v-close-overlay
              no-caps
            />
            <q-btn
              no-caps
              v-if="wiSkiller"
              color="green"
              :disable="wiSkiller.hasBook"
              @click="BookNowConfirm"
              label="Confirm"
              v-close-overlay
            />
            </q-card-actions>
          </q-card>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal minimized v-model="BookSchedule" :content-css="{minWidth: '90%'}">
      <q-modal-layout>
        <q-toolbar slot="header" color="purple">
          <q-toolbar-title>
            Confirmation
          </q-toolbar-title>
        </q-toolbar>

        <div class="layout-padding">
          <q-card flat>
            <q-item>
              <q-item-main>
                <p>Service : {{serviceData.service}}</p>
                <p>Type: {{serviceData.type}}</p>
                <p>{{serviceData.sqms}}</p>
                <p>Cost: {{serviceData.data.cost + lodash.sumBy(lodash.filter(SpecialFurniture, ['model', true]), 'total') | currency('')}} PHP</p>
                <p>Duration: {{serviceData.data.duration}}</p>
                <p>wiSkiller: {{serviceData.data.wiSkiller}}</p>
                <q-list highlight v-if="lodash.filter(SpecialFurniture, ['model', true]).length !== 0">
                  <q-list-header>{{serviceData.sqms? 'Add-ons': 'Your Selected Furniture'}}</q-list-header>
                  <q-item v-for="(a, i) in lodash.filter(SpecialFurniture, ['model', true])" :key="i">
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
                <q-datetime :before="[{icon: 'update', handler () {}}]" icon="edit" color="purple" float-label="Date" format="MMM DD, YYYY" class="no-margin" v-model="model1" type="date" />
                <q-datetime :before="[{icon: 'access_time', handler () {}}]" float-label="Time" format="HH : mm a" color="purple" class="no-margin" v-model="model2" type="time" />
                <q-input float-label="Provide exact work address:" v-model="workAddress" type="text" :before="[{icon: 'home', handler () {}}]" />
              </q-item-main>
            </q-item>

            <q-card-actions class="justify-end">
              <q-btn
                color="red"
                label="Cancel"
                v-close-overlay
                no-caps
              />
              <q-btn
                no-caps
                @click="ClickBookSchedule"
                color="green"
                label="Schedule"
                v-close-overlay
              />
            </q-card-actions>
          </q-card>

        </div>
      </q-modal-layout>
    </q-modal>

    <q-card>
      <q-card-media>
        <div style="height: 160px">
          <l-map ref="map" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :icon="WirequesterIcon" :lat-lng="marker"></l-marker>
            <l-marker :icon="WiskillerIcon" v-if="skillerData.longlat" :lat-lng="[skillerData.longlat._lat, skillerData.longlat._long]"></l-marker>
          </l-map>
        </div>
      </q-card-media>

      <q-card-title>
        <img style="height: 80px; width: 80px" :src="skillerData.photoURL" class="avatar"/>
        <!-- <div slot="right" style="margin-top: 10px" class="row items-center">
          <q-chip tag small color="negative">Add-on?</q-chip>
        </div> -->
        <div class="ellipsis">{{skillerData.displayName}} <span style="font-size: 16px" class="text-faded">Age: {{skillerData.age}}</span></div>
        <q-rating slot="subtitle" disable v-model="stars" :max="5" />
      </q-card-title>
      <q-card-main>
        <!-- <pre>{{serviceData.data}} </pre> -->
        <p>Skills: {{serviceData.service}}</p>
        <!-- {{lodash.sumBy(lodash.filter(SpecialFurniture, ['model', true]), 'total') | currency('')}} -->
        <p>Cost: {{serviceData.data.cost + lodash.sumBy(lodash.filter(SpecialFurniture, ['model', true]), 'total') | currency('')}} PHP</p>
        <p class="text-faded">
          Location: Makati City
        </p>
        <p class="text-faded">
          Credentials: TESDA
        </p>
        <p class="text-faded">
          Our Signature Service:
        </p>
        <p class="text-faded">
          Company Name: BusyBee
        </p>
        <!-- <pre>{{serviceData.service}}</pre> -->
        <q-chip v-if="serviceData.type !== 'Office' && serviceData.service !== 'Massage'" @click.native="addFurniture = true" tag color="negative">{{serviceData.sqms? 'Add-on Furniture?': 'Select Furniture'}}</q-chip>
      </q-card-main>
      <q-card-separator />
      <q-card-actions align="center">
        <q-btn
          v-if="wiRequester && skillerData.type !== 'OnSchedule'"
          no-caps
          :disable="wiSkiller.hasBook || wiSkiller.realtimeBooking"
          :loading="wiRequester.hasBook"
          size="md"
          label="Book Now"
          class="full-width"
          icon="fas fa-hand-pointer"
          @click="BookToday = true"
          color="purple"
        >
         <span @click="BookNowCancel" slot="loading">
          <q-spinner-hourglass class="on-left" />
            CANCEL
        </span>
        </q-btn>
        <q-btn
          flat
          v-if="wiRequester && skillerData.type === 'OnSchedule'"
          no-caps
          :disable="wiRequester.hasBook"
          @click="BookSchedule = true"
          size="md"
          icon="fas fa-calendar-alt"
          label="Schedule your Service now"
          class="full-width q-mt-xs bg-pink"
          color="white"
        />

      </q-card-actions>
    </q-card>

    <q-list>
      <q-list-header>Reviews</q-list-header>
      <q-item v-for="(r, index) in Reviews" :key="index">
        <q-item-side :avatar="r.photoURL" />
        <q-item-main :label="r.displayName" :sublabel="r.comments" />
        <q-item-side right>
          <q-item-tile stamp>
            <vue-moments-ago prefix="" suffix="ago" :date="r.timestamp"></vue-moments-ago>
          </q-item-tile>
          <span class="text-amber">
            <q-item-tile icon="star" v-for="n in r.ratings" :key="n" />
          </span>
        </q-item-side>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import Vue from 'vue'
import { date } from 'quasar'
require('leaflet/dist/leaflet.css')
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import L from 'leaflet'
import Wirequester from 'src/assets/wiRequester-pin.png'
import Wiskiller from 'src/assets/wiSkiller-pin.png'
import { db, firestore } from 'src/firebase.js'
import VueMomentsAgo from 'vue-moments-ago'
import Vue2Filters from 'vue2-filters'
import lodash from 'lodash'
let WirequesterIcon = L.icon({
  iconUrl: Wirequester,
  iconSize: [48, 48]
})

let WiskillerIcon = L.icon({
  iconUrl: Wiskiller,
  iconSize: [48, 48]
})
Vue.use(Vue2Filters)
export default {
  name: 'example',
  components: {
    VueMomentsAgo,
    LMap,
    LTileLayer,
    LMarker
  },
  data () {
    return {
      min: 1,
      max: 100,
      quantity: 0,
      lodash,
      SpecialFurniture: [
        {
          name: 'Single mattress',
          cost: 900,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Double mattress',
          cost: 1400,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Queen mattress',
          cost: 1600,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'King mattress',
          cost: 1900,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Carpet',
          cost: 0,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: '1 seater sofa',
          cost: 1500,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: '2 seater sofa ',
          cost: 2000,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: '3 seater sofa',
          cost: 2500,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Dining chair',
          cost: 350,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Small pillow',
          cost: 50,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Medium pillow',
          cost: 70,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Electric fan',
          cost: 0,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Refrigerator',
          cost: 0,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Microwave',
          cost: 0,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        },
        {
          name: 'Washing machine',
          cost: 0,
          // duration: '2 hours',
          // wiSkiller: 1,
          model: false,
          quantity: 1,
          total: 0
        }
      ],
      list1: false,
      list2: true,
      list3: true,
      addFurniture: false,
      date,
      workAddress: '',
      count: 0,
      setTime: null,
      wiRequester: null,
      clikBook: false,
      model1: null,
      model2: null,
      BookToday: false,
      BookSchedule: false,
      stars: 5,
      wiSkiller: null,
      wiSkillers: null,
      WirequesterIcon,
      WiskillerIcon,
      zoom: 13,
      center: L.latLng(47.413220, -1.219482),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.413220, -1.219482),
      Reviews: []
    //   date1: Date.now(),
    //   date2: Date.now(),
    //   opened: false,
    //   sum: 0,
    //   Reviews: [],
    //   customDialogModel: false,
    //   name: '',
    //   RequestTimeout: '',
    //   wiRequester: [],
    //   loading: false,
    //   stars: 5,
    //   opened: false,
    //   Latitude: 0,
    //   Longitude: 0,
    //   zoom: 14,
    //   url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    //   attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      this.$binding('wiSkiller', db.firestore().collection('wiSkillers').doc(this.skillerData.uid))
      this.$binding('wiRequester', db.firestore().collection('wiRequesters').doc(user.uid))
      if (user) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            this.marker = L.latLng(position.coords.latitude, position.coords.longitude)
            this.center = L.latLng(position.coords.latitude, position.coords.longitude)
            db.firestore().collection('wiRequesters').doc(user.uid).update({longlat: new firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
          })
        }
      } else {
        this.$router.push('/login')
      }
    })
    this.$binding('Reviews', db.firestore().collection('wiSkillers').doc(this.skillerData.uid).collection('Reviews').orderBy('timestamp', 'desc'))
  },
  watch: {
    wiRequester (wiRequester) {
      if (wiRequester.realtimeBooking === true) {
        this.$router.push('/transaction')
      }
      if (wiRequester.hasBook === false) {
        clearTimeout(this.setTime)
      }
      if (wiRequester.declined === true) {
        db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).update({
          declined: false
        }).then(() => {
          this.$router.push('/view_WiSkillers')
          this.$q.notify({
            type: 'info',
            message: 'Please Select wiSkiller anew.',
            timeout: 3000
          })
        }).catch(error => {
          console.error('Error updating document: ', error)
        })
      }
    }
  },
  methods: {
    ClickBookSchedule () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure to schedule your job on this Date & Time? Cancellation is not allowed',
        ok: {
          label: 'OK',
          color: 'green'
        },
        cancel: {
          color: 'primary',
          label: 'Back'
        }
      }).then(() => {
        // console.log(db.firestore().collection('wiSkillers').doc(this.skillerData.uid).collection('Booking'))
        let skiller = db.firestore().collection('wiSkillers').doc(this.skillerData.uid).collection('Booking')
        skiller.add({
          addons: lodash.filter(this.SpecialFurniture, ['model', true]),
          wiRequesterUID: this.wiRequester.uid,
          displayName: this.wiRequester.displayName,
          photoURL: this.wiRequester.photoURL,
          Service: this.serviceData.service,
          Type: this.serviceData.type,
          Area: this.serviceData.sqms,
          Cost: this.serviceData.data.cost,
          Duration: this.serviceData.data.duration,
          Candidate: this.serviceData.data.wiSkiller,
          date: this.model1,
          time: this.model2,
          workAddress: this.workAddress,
          timeStamp: date.formatDate(Date.now(), 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
          status: 'Pending',
          read: false
        }).then(data1 => {
          let requester = db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).collection('Booking')
          requester.add({
            addons: lodash.filter(this.SpecialFurniture, ['model', true]),
            requestID: data1.id,
            wiSkillerUID: this.skillerData.uid,
            displayName: this.skillerData.displayName,
            photoURL: this.skillerData.photoURL,
            Service: this.serviceData.service,
            Type: this.serviceData.type,
            Area: this.serviceData.sqms,
            Cost: this.serviceData.data.cost,
            Duration: this.serviceData.data.duration,
            Candidate: this.serviceData.data.wiSkiller,
            date: this.model1,
            time: this.model2,
            workAddress: this.workAddress,
            timeStamp: date.formatDate(Date.now(), 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
            read: false,
            status: 'Pending'
          }).then(data => {
            let skiller = db.firestore().collection('wiSkillers').doc(this.skillerData.uid).collection('Booking').doc(data1.id)
            skiller.update({
              requestID: data.id
            })
            this.$router.push('/booking')
            // this.$q.notify('Request submitted!')
            this.$q.notify({
              type: 'positive',
              message: 'Request submitted!',
              timeout: 3000
            })
          })
        })
      }).catch(() => {
      })
    },
    BookNowCancel () {
      clearTimeout(this.setTime)
      db.firestore().collection('wiSkillers').doc(this.skillerData.uid).update({
        hasBook: false,
        Request: {}
      }).then(() => {
        // Book false
        db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).update({
          hasBook: false
        }).then(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Cancelled',
            timeout: 800
          })
        }).catch(error => {
          console.error('Error updating document: ', error)
        })
      }).catch(error => {
        console.error('Error updating document: ', error)
      })
    },
    BookNowConfirm () {
      console.log(lodash.filter(this.SpecialFurniture, ['model', true]))

      db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).update({
        hasBook: true
      }).then(() => {
      }).catch(error => {
        console.error('Error updating document: ', error)
      })

      db.firestore().collection('wiSkillers').doc(this.skillerData.uid).update({
        hasBook: true,
        Request: {
          addons: lodash.filter(this.SpecialFurniture, ['model', true]),
          wiRequesterUID: this.wiRequester.uid,
          displayName: this.wiRequester.displayName,
          photoURL: this.wiRequester.photoURL,
          Service: this.serviceData.service,
          Type: this.serviceData.type,
          Area: this.serviceData.sqms,
          Cost: this.serviceData.data.cost,
          Duration: this.serviceData.data.duration,
          Candidate: this.serviceData.data.wiSkiller
        }
      }).then(() => {
      }).catch(error => {
        console.error('Error updating document: ', error)
      })

      this.setTime = setTimeout(() => {
        this.count += 1
        db.firestore().collection('wiSkillers').doc(this.skillerData.uid).update({
          hasBook: false,
          Request: {}
        }).then(() => {
          db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).update({
            hasBook: false
          }).then(() => {
            if (this.count === 2) {
              this.$q.notify({
                type: 'info',
                message: 'Please select wiSkiller anew.',
                timeout: 3000
              })
              this.$router.push('/view_WiSkillers')
            } else {
              this.$q.notify({
                type: 'info',
                message: 'wiSkiller not responding yet. Please try again!',
                timeout: 3000
              })
            }
          }).catch(error => {
            console.error('Error updating document: ', error)
          })
        }).catch(error => {
          console.error('Error updating document: ', error)
        })
      }, 60000)
    }
  },
  computed: {
    skillerData () {
      return this.$store.state.example.skillerData
    },
    serviceData () {
      return this.$store.state.example.serviceData
    }
  }
}
</script>
<style>
  /* .leaflet-control-attribution {
    display: none
  }
  .q-option-inner {
    display: none
  }
  .q-layout-footer {
    box-shadow: 0px 0px 0px 0px;
  }
  .q-item-side  .q-item-avatar, .q-item-avatar img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
} */
</style>
