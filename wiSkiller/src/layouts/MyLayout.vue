<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="purple"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          size="lg"
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="fas fa-bars" />
        </q-btn>

        <q-toolbar-title class="text-weight-bolder">
          <!-- <pre>{{wiSkiller}}</pre> -->
          {{this.$route.name}}
          <!-- <div slot="subtitle">wiSkiller</div> -->
        </q-toolbar-title>
        <q-btn v-if="Booking && Booking.length !== 0" to="/booking" color="light" label="Book">
          <q-chip floating color="red">{{Booking.length}}</q-chip>
        </q-btn>

        <!-- <q-btn
          size="lg"
          flat
          dense
          round
          @click="$router.push('/chat')"
        >
          <q-icon name="message" />
        </q-btn> -->
      </q-toolbar>
    </q-layout-header>
    <!-- v-if="wiSkiller.realtimeBooking === true" -->
    <q-layout-footer v-if="wiSkiller">
      <q-tabs color="purple" v-if="wiSkiller.realtimeBooking === true">
        <q-route-tab slot="title" icon="map" to="/" replace label="Map" />
        <q-route-tab slot="title" icon="info" to="/status" replace label="Profile & Status" />
        <q-route-tab slot="title" icon="message" :to='"/chat/"+wiSkiller.Request.wiRequesterUID' replace label="Message" />
      </q-tabs>
    </q-layout-footer>

    <q-layout-drawer
      overlay
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        style="padding: 0px"
        no-border
        sparse
        link
        inset-delimiter
      >
        <q-list-header style="padding: 20px 0px 15px 0px" class="text-center bg-purple">
          <img style="height:80px; width:80px;" v-if="wiSkiller" :src="wiSkiller.photoURL" class="avatar">
          <br>
          <br>
          <span v-if="wiSkiller" style="font-size: 18px" class="text-white text-weight-medium">
            {{wiSkiller.displayName}}
          </span>
        </q-list-header>
        <br>
        <q-item to="/" exact >
          <q-item-side icon="fas fa-map"/>
          <q-item-main class="text-weight-bolder capitalize" label="Map" />
        </q-item>
        <q-item to="/booking">
          <q-item-side icon="fas fa-calendar-check" />
          <q-item-main class="text-weight-bolder capitalize" label="Booked on-Schedule" />
        </q-item>
        <q-item to="/history">
          <q-item-side icon="fas fa-history"/>
          <q-item-main class="text-weight-bolder capitalize" label="History" />
        </q-item>
        <q-item to="/settings" >
          <q-item-side icon="fas fa-cog"/>
          <q-item-main class="text-weight-bolder capitalize" label="Settings" />
        </q-item>
        <q-item @click.native="logout">
          <q-item-side icon="fas fa-sign-out-alt" />
          <q-item-main class="text-weight-bolder capitalize" label="Logout" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { db } from 'src/firebase.js'
export default {
  name: 'MyLayout',
  data () {
    return {
      Booking: null,
      wiSkiller: null,
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('wiSkiller', db.firestore().collection('wiSkillers').doc(user.uid))
        this.$binding('Booking', db.firestore().collection('wiSkillers').doc(user.uid).collection('Booking').where('read', '==', false))
      } else {
        this.$router.push('/login')
      }
    })
  },
  methods: {
    openURL,
    logout () {
      this.$q.dialog({
        title: 'Logout',
        message: 'Are you sure you want to logout?',
        ok: {
          color: 'purple',
          label: 'Ok'
        },
        cancel: {
          color: 'negative',
          label: 'Cancel'
        }
      }).then(() => {
        db.auth().signOut().then(() => {
          this.$router.push('/login')
          cordova.plugins.backgroundMode.disable()
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
.router-link-active{
  border-right: 3px solid purple;
}
.router-link-active .q-item-side {
  color: purple;
}
.router-link-active .q-item-main {
  color: purple;
}
.leaflet-bottom.leaflet-right {
  display: none;
}
</style>
