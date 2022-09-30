<template>
  <q-page>
    <!-- <span v-if="wiSkiller">{{wiSkiller.hasBook}}</span> -->
    <q-modal v-if="wiSkiller" minimized v-model="wiSkiller.hasBook" no-backdrop-dismiss :content-css="{minWidth: '80vw', minHeight: '60vh'}">
      <q-modal-layout>
        <q-toolbar slot="header" color="purple">
          <q-toolbar-title>
            Confirmation
          </q-toolbar-title>
        </q-toolbar>

        <!-- <q-toolbar slot="footer" color="white">
        <q-toolbar-title>
        </q-toolbar-title>
          <q-btn
            size="lg"
            dense
            color="red"
            label="Decline"
            v-close-overlay
            no-caps
            @click="bookDecline"
            class="q-mr-xs q-py-sm q-px-md q-mb-xs"
          />
          <q-btn
            size="lg"
            label="Accept"
            dense
            class="q-py-sm q-px-md q-mb-xs"
            color="green"
            v-close-overlay
            no-caps
            @click="bookAccept"
          />
        </q-toolbar> -->

        <div class="layout-padding" v-if="wiSkiller.Request">
          <q-card flat>
            <q-item>
              <q-item-side :avatar="wiSkiller.Request.photoURL" />
              <q-item-main>
                <q-item-tile label>{{wiSkiller.Request.displayName}}</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item>
              <q-item-main>
                <p>Service : {{wiSkiller.Request.Service}}</p>
                <p>Type: {{wiSkiller.Request.Type}}</p>
                <p v-if="wiSkiller.Request.Area">{{wiSkiller.Request.Area}}</p>
                <p>Cost: {{wiSkiller.Request.Cost + lodash.sumBy(lodash.filter(wiSkiller.Request.addons, ['model', true]), 'total') | currency('')}} PHP </p>
                <p>Hour: {{wiSkiller.Request.Duration}}</p>
                <p>wiSkiller: {{wiSkiller.Request.Candidate}}</p>
              </q-item-main>
            </q-item>
            <!-- {{wiSkiller.Request.addons}} -->
            <q-list v-if="wiSkiller.Request && wiSkiller.Request.addons && wiSkiller.Request.addons.length !== 0" highlight>
              <q-list-header>Add-ons</q-list-header>
              <q-item v-for="(a, i) in wiSkiller.Request.addons" :key="i">
                <q-item-main>
                  <q-item-tile label>Name: {{a.name}}</q-item-tile>
                  <q-item-tile label>Cost: {{a.Cost | currency('')}} Php</q-item-tile>
                  <!-- <q-item-tile label>Duration: {{a.duration}}</q-item-tile>
                  <q-item-tile label>wiSkiller: {{a.wiSkiller}}</q-item-tile> -->
                  <q-item-tile label>Quantity: {{a.quantity}}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
            <!-- <pre> {{wiSkiller.Request.addons}} </pre> -->
            <q-card-actions class="justify-end">
              <q-btn
                color="red"
                label="Decline"
                v-close-overlay
                no-caps
                @click="bookDecline"
              />
              <q-btn
                label="Accept"
                color="green"
                v-close-overlay
                no-caps
                @click="bookAccept"
              />
            </q-card-actions>
          </q-card>
        </div>
      </q-modal-layout>
    </q-modal>
    <l-map ref="map" style="min-height: calc(100vh - 56px);">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    </l-map>

    <!-- <l-map style="min-height: calc(100vh - 56px);" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :icon="WiskillerIcon" :lat-lng="marker"></l-marker>
    </l-map> -->
  </q-page>
</template>

<script>
require('leaflet/dist/leaflet.css')
require('leaflet-routing-machine/dist/leaflet-routing-machine.css')
import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import Wirequester from 'src/assets/wiRequester-pin.png'
import Wiskiller from 'src/assets/wiSkiller-pin.png'
import { db, firestore } from 'src/firebase.js'
import lodash from 'lodash'
Vue.use(Vue2Filters)
let WirequesterIcon = L.icon({
  iconUrl: Wirequester,
  iconSize: [48, 48]
})

let WiskillerIcon = L.icon({
  iconUrl: Wiskiller,
  iconSize: [48, 48]
})

export default {
  name: 'index',
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  data () {
    return {
      lodash,
      wiSkiller: null,
      wiSkillers: null,
      WirequesterIcon,
      WiskillerIcon,
      zoom: 12,
      center: L.latLng(47.413220, -1.219482),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.413220, -1.219482)
    }
  },
  watch: {
    wiSkiller (wiSkiller) {
      if (this.wiSkiller.hasBook === true) {
        cordova.plugins.notification.local.schedule({
          title: 'You have a request',
          text: 'Have a nice day',
          foreground: true
        })
      }
    }
  },
  mounted () {
    console.log(this.wiSkiller)
    let self = this
    let options = { profile: 'mapbox/driving-traffic' }
    let routeControl = L.Routing.control({
      router: L.Routing.mapbox('pk.eyJ1IjoiZG9udmllIiwiYSI6ImNqaTFxaDgxMTBoOTkzcW9heHV1bm54ZmsifQ.pNfXE9J6HLLFjfdg72E_Cg', options),
      waypoints: [null],
      fitSelectedRoutes: 'true',
      z: 15,
      lineOptions: {
        styles: [
          {color: 'white', opacity: 0.9, weight: 9},
          {color: 'purple', opacity: 1, weight: 5}
        ]
      },
      createMarker: function (i, wp, nWps) {
        // console.log(wp)
        if (i === 0) {
          return L.marker(wp.latLng, { icon: self.WiskillerIcon, draggable: false, bounceOnAdd: false }).bindPopup('<h5><b>wiSkiller<b></h5>')
        } else if (i === nWps - 1) {
          return L.marker(wp.latLng, { icon: self.WirequesterIcon, draggable: false, bounceOnAdd: false }).bindPopup('<h5><b>wiRequester<b></h5>')
        }
      }
    }).addTo(this.$refs.map.mapObject)

    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('wiSkiller', db.firestore().collection('wiSkillers').doc(user.uid))
        db.firestore().collection('wiSkillers').doc(user.uid).onSnapshot(doc => {
          this.marker = L.latLng(doc.data().longlat.latitude, doc.data().longlat.longitude)
          this.center = L.latLng(doc.data().longlat.latitude, doc.data().longlat.longitude)
          // console.log(doc.data().Request)
          if (doc.data().Request) {
            if (doc.data().Request && doc.data().realtimeBooking === true) {
              db.firestore().collection('wiRequesters').doc(doc.data().Request.wiRequesterUID).onSnapshot(req => {
                routeControl._container.style.display = 'Block'
                routeControl.getPlan().setWaypoints([this.center, L.latLng(req.data().longlat.latitude, req.data().longlat.longitude)])
              })
            } else {
              routeControl._container.style.display = 'None'
              routeControl.getPlan().setWaypoints([this.center, this.center])
              // this.$refs.map.setView(L.latLng(47.413220, -1.219482), 13)
              // this.$refs.map.mapObject.getCenter()
              // console.log(this.$refs.map.mapObject)
            }
          }
        })

        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(position => {
            db.firestore().collection('wiSkillers').doc(user.uid).update({longlat: new firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
          })
        }
      } else {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    bookDecline () {
      db.firestore().collection('wiRequesters').doc(this.wiSkiller.Request.wiRequesterUID).update({
        hasBook: false,
        declined: true
      }).then(() => {
        db.firestore().collection('wiSkillers').doc(this.wiSkiller.uid).update({
          hasBook: false,
          Request: {}
        }).then(() => {
        }).catch(error => {
          console.error('Error updating document: ', error)
        })
      }).catch(error => {
        console.error('Error updating document: ', error)
      })
    },
    bookAccept () {
      console.log(this.wiSkiller.Request.addons)
      db.firestore().collection('wiRequesters').doc(this.wiSkiller.Request.wiRequesterUID).update({
        hasBook: false,
        declined: false
      }).then(() => {
        db.firestore().collection('wiSkillers').doc(this.wiSkiller.uid).set({
          Request: {
            status: 'Arrived'
          },
          hasBook: false,
          realtimeBooking: true
        }, { merge: true }).then(() => {
        }).catch(error => {
          console.error('Error updating document: ', error)
        })

        db.firestore().collection('wiRequesters').doc(this.wiSkiller.Request.wiRequesterUID).update({
          hasBook: false,
          realtimeBooking: true,
          Request: {
            addons: this.wiSkiller.Request.addons,
            status: 'Arrived',
            wiSkillerUID: this.wiSkiller.uid,
            displayName: this.wiSkiller.displayName,
            photoURL: this.wiSkiller.photoURL,
            Service: this.wiSkiller.Request.Service,
            Type: this.wiSkiller.Request.Type,
            Area: this.wiSkiller.Request.Area,
            Cost: this.wiSkiller.Request.Cost,
            Duration: this.wiSkiller.Request.Duration,
            Candidate: this.wiSkiller.Request.Candidate
          }
        }).then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Booking Accepted',
            timeout: 3000
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
</script>
<style>
/* .leaflet-control-attribution {
  display: none
} */
.q-layout-footer {
  box-shadow: 0px 0px 0px 0px;
}
.q-item-avatar, .q-item-avatar img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
}
/* .q-tabs-bar {
  border: none;
  border-width: 0;
  position: absolute;
  height: 0;
  left: 0;
  right: 0;
}
.q-tab.active .q-tab-icon, .q-tab.active .q-tab-label {
  opacity: 2;
  color: purple
} */
</style>
