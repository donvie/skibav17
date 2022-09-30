<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="purple"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          v-if="$route.name !== 'Profile' && $route.name !== 'Available wiSkillers' && $route.name !== 'Book On-Schedule' && $route.name !== 'Profile On-Schedule'"
          size="lg"
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="fas fa-bars" />
        </q-btn>

        <q-btn
          v-if="$route.name === 'Profile'"
          size="lg"
          flat
          dense
          round
          @click="$router.push('/view_WiSkillers')"
          aria-label="Menu"
        >
          <q-icon name="fas fa-arrow-left" />
        </q-btn>

        <q-btn
          v-if="$route.name === 'Profile On-Schedule'"
          size="lg"
          flat
          dense
          round
          @click="$router.push('/booking')"
          aria-label="Menu"
        >
          <q-icon name="fas fa-arrow-left" />
        </q-btn>

        <q-btn
          v-if="$route.name === 'Available wiSkillers' || $route.name === 'Book On-Schedule'"
          size="lg"
          flat
          dense
          round
          @click="$router.push('/')"
          aria-label="Menu"
        >
          <q-icon name="fas fa-arrow-left" />
        </q-btn>

        <q-toolbar-title class="text-weight-bolder">
          <!-- Services -->
          {{this.$route.name}}
          <!-- <div slot="subtitle">Running on Quasar v{{ $q.version }}</div> -->
        </q-toolbar-title>

        <q-btn
          v-if="wiRequester && wiRequester.realtimeBooking === true && this.$route.name !== 'Transaction' && this.$route.name !== 'Status' && this.$route.name !== 'Chat'"
          no-caps
          icon="fas fa-arrow-right"
          size="lg"
          flat
          @click="$router.push('/transaction')"
        />
      </q-toolbar>
      <q-tabs inverted color="dark" v-if="$route.name === 'Available wiSkillers' || $route.name === 'Book On-Schedule'">
        <q-route-tab class="capitalize text-weight-bold" slot="title" icon="view_quilt" to="/view_WiSkillers" replace hide="icon" label="Book Now" />
        <q-route-tab class="capitalize text-weight-bold" slot="title" icon="view_day" to="/viewOnschedule" replace hide="icon" label="Book On-Schedule" />
      </q-tabs>
    </q-layout-header>

    <q-layout-footer v-if="wiRequester && wiRequester.realtimeBooking === true && this.$route.name === 'Transaction' || this.$route.name === 'Status' || this.$route.name === 'Chat'">
      <q-tabs class="tabstabs" color="purple">
        <q-route-tab slot="title" icon="map" to="/transaction" replace label="Map" />
        <q-route-tab slot="title" icon="info" to="/status" replace label="Profile & Status" />
        <q-route-tab v-if="wiRequester && wiRequester.Request" slot="title" icon="message" :to='"/chat/"+wiRequester.Request.wiSkillerUID' replace label="Message" />
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
          <img style="height:80px; width:80px;" v-if="wiRequester" :src="wiRequester.photoURL" class="avatar">
          <br>
          <br>
          <span v-if="wiRequester" style="font-size: 18px" class="text-white text-weight-medium">
            {{wiRequester.displayName}}
          </span>
        </q-list-header>
        <br>
        <q-item to="/" exact >
          <q-item-side icon="fas fa-list-ul"/>
          <q-item-main class="text-weight-bolder capitalize" label="Services" />
        </q-item>
        <q-item to="/booking">
          <q-item-side icon="fas fa-calendar-check" />
          <q-item-main class="text-weight-bolder capitalize" label="Your Booked Services" />
        </q-item>
        <q-item to="/history">
          <q-item-side icon="fas fa-history"/>
          <q-item-main class="text-weight-bolder capitalize" label="History" />
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
      wiRequester: null,
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('wiRequester', db.firestore().collection('wiRequesters').doc(user.uid))
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
</style>
