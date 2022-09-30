<template>
  <q-layout view="hHr LpR lFf">
    <q-layout-header>
      <q-toolbar color="purple">
        <q-btn icon="fas fa-arrow-left" @click="$router.push('/booking')" flat />
        <q-toolbar-title>
          {{wiSkiller.displayName}}
        </q-toolbar-title>
      </q-toolbar>

    </q-layout-header>

    <q-layout-footer style="box-shadow: none;">
      <q-field style="bottom: 0px">
        <div class="mensaje-box" style="padding: 5px 5px 5px 5px">
          <div class="input-text">
            <q-input hide-underline @focus="ScrollTop" :max-height="50" rows="1" color="purple" placeholder="Enter your message" :min-rows="1" type="textarea" v-model.trim="message" />
          </div>
          <q-icon size="2.1em" color="purple" name="send" @click.native="onSubmit"/>
        </div>
      </q-field>
    </q-layout-footer>

    <q-page-container>
      <q-page padding style="height: 80vh; overflow-y: scroll" ref="messageDiv" v-chat-scroll>
        <!-- <q-chat-message
          label='Sunday, 19th'
        /> -->
        <q-chat-message
          v-for="msg in messages"
          size="5"
          :stamp="date.formatDate(msg.stamp, 'MMM D HH:mm A')"
          :bg-color="msg.uid === wiRequester.uid? 'purple-5':'primary'"
          text-color="white"
          :key="msg['.key']"
          :name="msg.name"
          :avatar="msg.avatar"
          :sent="msg.uid === wiRequester.uid"
          :text="msg.text"
        />

        <!-- <q-field class="fixed-bottom" style="bottom: 0px">
          <div class="mensaje-box" style="padding: 5px 5px 5px 5px">
            <div class="input-text">
              <q-input hide-underline  :max-height="50" rows="1" color="purple" placeholder="Enter your message" :min-rows="1" type="textarea" v-model.trim="message" />
            </div>
            <q-icon size="2.1em" color="purple" name="send" @click.native="onSubmit"/>
          </div>
        </q-field> -->
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script>
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)
import { db, firestore } from 'src/firebase.js'
import { date } from 'quasar'
export default {
  data () {
    return {
      date,
      message: '',
      wiRequester: [],
      wiSkiller: [],
      messages: [],
      messages1: []
    }
  },
  mounted () {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        this.$binding('messages1', db.firestore().collection('wiRequesters').doc(user.uid).collection(user.uid + this.$route.params.id).orderBy('stamp', 'desc').limit(1))
        this.$binding('wiRequester', db.firestore().collection('wiRequesters').doc(user.uid))
        this.$binding('wiSkiller', db.firestore().collection('wiSkillers').doc(this.$route.params.id))
        this.$binding('messages', db.firestore().collection('wiRequesters').doc(user.uid).collection(user.uid + this.$route.params.id).orderBy('stamp', 'asc'))
      } else {
        this.$router.push('/login')
      }
    })
  },
  watch: {
    messages1 (messages1) {
      if (messages1[0]) {
        if (date.getDateDiff(Date.now(), messages1[0].stamp, 'seconds') < 6) {
          if (messages1[0].uid !== this.wiRequester.uid) {
            cordova.plugins.notification.local.schedule({
              title: 'Message',
              text: messages1[0].text[messages1[0].text.length - 1],
              foreground: true
            })
            setTimeout(() => {
              this.$refs.messageDiv.$el.scroll({
                top: this.$refs.messageDiv.$el.scrollHeight,
                behavior: 'instant'
              })
            }, 100)
          }
        }
      }
    }
  },
  methods: {
    ScrollTop () {
      setTimeout(() => {
        this.$refs.messageDiv.$el.scroll({
          top: this.$refs.messageDiv.$el.scrollHeight,
          behavior: 'instant'
        })
      }, 100)
    },
    onSubmit () {
      db.firestore().collection('wiSkillers').doc(this.$route.params.id).collection(this.$route.params.id + this.wiRequester.uid).orderBy('stamp', 'desc').limit(1).get().then((querySnapshot1) => {
        if (querySnapshot1.empty === true) {
          let msg = {
            name: this.wiRequester.displayName,
            text: [this.message],
            avatar: this.wiRequester.photoURL,
            stamp: Date.now(),
            uid: this.wiRequester.uid
          }
          db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).collection(this.wiRequester.uid + this.$route.params.id).add(msg).then(() => {
            db.firestore().collection('wiSkillers').doc(this.$route.params.id).collection(this.$route.params.id + this.wiRequester.uid).add(msg).then(() => {
            }).catch(error => {
              console.error('Error updating document: ', error)
            })
          }).catch(error => {
            console.error('Error updating document: ', error)
          })
          this.message = ''
        }
        querySnapshot1.forEach((doc1) => {
          db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).collection(this.wiRequester.uid + this.$route.params.id).orderBy('stamp', 'desc').limit(1).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.data().uid !== this.wiRequester.uid) {
                let msg = {
                  name: this.wiRequester.displayName,
                  text: [this.message],
                  avatar: this.wiRequester.photoURL,
                  stamp: Date.now(),
                  uid: this.wiRequester.uid
                }
                db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).collection(this.wiRequester.uid + this.$route.params.id).add(msg).then(() => {
                  db.firestore().collection('wiSkillers').doc(this.$route.params.id).collection(this.$route.params.id + this.wiRequester.uid).add(msg).then(() => {
                  }).catch(error => {
                    console.error('Error updating document: ', error)
                  })
                }).catch(error => {
                  console.error('Error updating document: ', error)
                })
                // this.$binding('messages', db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).collection(this.wiRequester.uid + this.$route.params.id).orderBy('stamp', 'asc'))
                this.message = ''
              } else {
                if (date.getDateDiff(Date.now(), doc.data().stamp, 'seconds') < 10000) {
                  db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).collection(doc.ref.parent.id).doc(doc.ref.id).update({
                    text: firestore.FieldValue.arrayUnion(this.message),
                    stamp: Date.now()
                  })
                  if (doc1.data().uid === this.wiRequester.uid) {
                    db.firestore().collection('wiSkillers').doc(this.$route.params.id).collection(doc1.ref.parent.id).doc(doc1.ref.id).update({
                      text: firestore.FieldValue.arrayUnion(this.message),
                      stamp: Date.now()
                    })
                  }
                  setTimeout(() => {
                    this.$refs.messageDiv.$el.scroll({
                      top: this.$refs.messageDiv.$el.scrollHeight,
                      behavior: 'instant'
                    })
                  }, 100)
                  this.message = ''
                } else {
                  let msg = {
                    name: this.wiRequester.displayName,
                    text: [this.message],
                    avatar: this.wiRequester.photoURL,
                    stamp: Date.now(),
                    uid: this.wiRequester.uid
                  }
                  db.firestore().collection('wiRequesters').doc(this.wiRequester.uid).collection(this.wiRequester.uid + this.$route.params.id).add(msg).then(() => {
                    db.firestore().collection('wiSkillers').doc(this.$route.params.id).collection(this.$route.params.id + this.wiRequester.uid).add(msg).then(() => {
                    }).catch(error => {
                      console.error('Error updating document: ', error)
                    })
                  }).catch(error => {
                    console.error('Error updating document: ', error)
                  })
                  this.message = ''
                }
              }
            })
          })
        })
      })
    }
  }
}
</script>

<style>
  ::-webkit-scrollbar {
    display: none;
  }
  .mensaje-box {
    display: flex;
    background: white;
  }
  .mensaje-box .input-text {
    border: 1px solid lightgray;
    padding: 5px;
    border-radius: 15px;
    flex-grow: 2;
  }
</style>
