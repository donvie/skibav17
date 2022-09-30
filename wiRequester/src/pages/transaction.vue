<template>
  <q-page>
    <l-map ref="map" style="min-height: calc(100vh - 56px);">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    </l-map>
  </q-page>
</template>

<script>
require('leaflet/dist/leaflet.css')
require('leaflet-routing-machine/dist/leaflet-routing-machine.css')
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'
import Wirequester from 'src/assets/wiRequester-pin.png'
import Wiskiller from 'src/assets/wiSkiller-pin.png'
import { db, firestore } from 'src/firebase.js'

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
      wiSkiller: null,
      wiSkillers: null,
      WirequesterIcon,
      WiskillerIcon,
      zoom: 13,
      center: L.latLng(47.413220, -1.219482),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.413220, -1.219482)
    }
  },
  mounted () {
    let self = this
    let options = { profile: 'mapbox/driving-traffic' }
    let routeControl = L.Routing.control({
      router: L.Routing.mapbox('pk.eyJ1IjoiZG9udmllIiwiYSI6ImNqaTFxaDgxMTBoOTkzcW9heHV1bm54ZmsifQ.pNfXE9J6HLLFjfdg72E_Cg', options),
      waypoints: [null],
      lineOptions: {
        styles: [
          {color: 'white', opacity: 0.9, weight: 9},
          {color: 'purple', opacity: 1, weight: 5}
        ]
      },
      createMarker: function (i, wp, nWps) {
        if (i === 0) {
          return L.marker(wp.latLng, { icon: self.WirequesterIcon, draggable: false, bounceOnAdd: false }).bindPopup('<h5><b>wiRequester<b></h5>')
        } else if (i === nWps - 1) {
          return L.marker(wp.latLng, { icon: self.WiskillerIcon, draggable: false, bounceOnAdd: false }).bindPopup('<h5><b>wiSkiller<b></h5>')
        }
      }
    }).addTo(this.$refs.map.mapObject)

    routeControl.on('routeselected', function (routes) {
      console.log(routes)
      console.log(routes.route.instructions)
    }, this)

    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('wiRequesters', db.firestore().collection('wiRequesters').doc(user.uid))
        db.firestore().collection('wiRequesters').doc(user.uid).onSnapshot(doc => {
          this.marker = L.latLng(doc.data().longlat.latitude, doc.data().longlat.longitude)
          this.center = L.latLng(doc.data().longlat.latitude, doc.data().longlat.longitude)
          if (doc.data().Request) {
            if (doc.data().Request && doc.data().realtimeBooking === true) {
              db.firestore().collection('wiSkillers').doc(doc.data().Request.wiSkillerUID).onSnapshot(req => {
                routeControl.getPlan().setWaypoints([this.center, L.latLng(req.data().longlat.latitude, req.data().longlat.longitude)])
              })
            }
          }
        })

        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(position => {
            db.firestore().collection('wiRequesters').doc(user.uid).update({longlat: new firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
          })
        }
      } else {
        this.$router.push('/login')
      }
    })
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
.leaflet-bottom.leaflet-right {
  display: none;
}
</style>
