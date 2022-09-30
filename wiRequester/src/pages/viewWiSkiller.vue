<template>
  <q-page>
    <!-- <pre>{{drawerState}}</pre> -->
    <!-- <q-toggle v-model="drawerState" /> -->
    <l-map style="min-height: calc(100vh - 104px);" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :icon="WirequesterIcon" :lat-lng="marker"></l-marker>
      <l-marker @click="ViewwiSkiller(skiller)" v-if="skiller.longlat" :icon="WiskillerIcon" v-for="(skiller, i) in wiSkillers" :key="i" :lat-lng="[skiller.longlat._lat, skiller.longlat._long]"></l-marker>
    </l-map>
  </q-page>
</template>

<script>
require('leaflet/dist/leaflet.css')
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import L from 'leaflet'
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
      wiSkillers: [],
      wiRequester: null,
      WirequesterIcon,
      WiskillerIcon,
      zoom: 13,
      center: L.latLng(47.413220, -1.219482),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.413220, -1.219482)
    }
  },
  computed: {
    // drawerState: {
    //   get () {
    //     return this.$store.state.example.serviceData
    //   },
    //   set (val) {
    //     this.$store.commit('example/serviceState', val)
    //   }
    // }
  },
  mounted () {
    // console.log(this.$store.state.examp)
    this.$binding('wiSkillers', db.firestore().collection('wiSkillers'))
    db.auth().onAuthStateChanged(user => {
      if (user) {
        db.firestore().collection('wiRequesters').doc(user.uid).onSnapshot(doc => {
          this.marker = L.latLng(doc.data().longlat.latitude, doc.data().longlat.longitude)
          this.center = L.latLng(doc.data().longlat.latitude, doc.data().longlat.longitude)
        })
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            console.log(position)
            // this.marker = L.latLng(position.coords.latitude, position.coords.longitude)
            // this.center = L.latLng(position.coords.latitude, position.coords.longitude)
            db.firestore().collection('wiRequesters').doc(user.uid).update({longlat: new firestore.GeoPoint(position.coords.latitude, position.coords.longitude)})
          })
        }
      } else {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    ViewwiSkiller (skiller) {
      this.$store.commit('example/skillerProfileState', skiller)
      this.$router.push('/profile')
    }
  }
}
</script>
<style>
.leaflet-control-attribution {
  display: none
}
</style>
