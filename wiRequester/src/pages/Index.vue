<template>
  <q-page padding>
    <q-list separator>
      <q-collapsible sparse indent icon="fas fa-home" label="Home Cleaning">
        <q-collapsible sparse indent v-for="(hc, hci) in HomeCleaning" :key="hci" :label="hc['.key']">

        <!-- <q-collapsible v-if="hc['Bare Unit deep cleaning']" label="Bare Unit deep cleaning"> -->
          <q-card v-if="hc['.key'] === 'Special Furniture Cleaning'" class="q-mr-md">
            <q-card-title>
              <q-btn slot="right" label="info" no-caps color="negative" rounded>
                <q-popover class="bg-purple-2">
                  <q-list style="width: 300px">
                    <q-item>
                      <!-- <q-item-side icon="check" color="positive" /> -->
                      <q-item-main label="This Special Cleaning includes Deep cleaning with Dry vacuuming, Steam cleaning and Shampooing with materials and solutions from selected partner" />
                    </q-item>
                  </q-list>
                </q-popover>
              </q-btn>
            </q-card-title>
            <q-card-main>
              <!-- <pre>{{hc}}</pre> -->
              <span v-for="(item, index) in hc.items" :key="index">
                <p>- {{item}}</p>
              </span>
              <p>wiSkiller: {{hc.wiSkiller}}</p>
              <p class="text-faded">Duration: {{hc.duration}}</p>
              <span class="text-purple"><q-icon name="arrow_right" size="36px" /> Go to wiSkiller Profile to select your furniture</span>
            </q-card-main>
            <q-card-actions>
              <q-btn no-caps @click="SelectwiSkiller(hc, '', 'Home Cleaning', 'Special Furniture Cleaning')" class="full-width" icon="fas fa-hand-pointer" color="purple" label="Choose wiSkillers & Book" />
            </q-card-actions>
          </q-card>
        <!-- </q-collapsible> -->

        <q-collapsible sparse v-if="hc['Office']" label="Office">
          <q-card>
            <q-card-title>
              <q-btn slot="right" label="info" no-caps color="negative" rounded>
                <q-popover class="bg-purple-2">
                  <q-list style="width: 300px">
                    <q-item dense v-for="(o, index) in Office" :key="index">
                      <q-item-side icon="check" color="positive" />
                      <q-item-main :label="o" />
                    </q-item>
                  </q-list>
                </q-popover>
              </q-btn>
            </q-card-title>
            <q-card-main>
              <p>wiSkiller: {{hc['Office'].wiSkiller}}</p>
              <p class="text-faded">Duration: {{hc['Office'].duration}}</p>
            </q-card-main>
            <q-card-actions>
              <q-btn no-caps @click="SelectwiSkiller(hc['Office'], hc['.key'], 'Home Cleaning', 'Office')" class="full-width" icon="fas fa-hand-pointer" color="purple" label="Choose wiSkillers & Book" />
            </q-card-actions>
          </q-card>
        </q-collapsible>
          <q-collapsible sparse v-if="hc['Basic Cleaning']" label="Basic Cleaning">
            <q-card>
              <q-card-title>
                <q-btn slot="right" label="info" no-caps color="negative" rounded>
                  <q-popover class="bg-purple-2">
                    <q-list style="width: 300px">
                      <q-item dense v-for="(b, index) in BasicCleaning" :key="index">
                        <q-item-side icon="check" color="positive" />
                        <q-item-main :label="b" />
                      </q-item>
                    </q-list>
                  </q-popover>
                </q-btn>
              </q-card-title>
              <q-card-main>
                <p>wiSKiller: {{hc['Basic Cleaning'].wiSkiller}}</p>
                <p class="text-faded">Duration: {{hc['Basic Cleaning'].duration}}</p>
              </q-card-main>
              <q-card-actions>
                <q-btn no-caps @click="SelectwiSkiller(hc['Basic Cleaning'], hc['.key'], 'Home Cleaning', 'Basic Cleaning')" class="full-width" icon="fas fa-hand-pointer" color="purple" label="Choose wiSkillers & Book" />
              </q-card-actions>
            </q-card>
          </q-collapsible>
          <q-collapsible sparse v-if="hc['Bare Unit deep cleaning']" label="Bare Unit deep cleaning">
            <q-card>
              <q-card-title>
                <q-btn slot="right" label="info" no-caps color="negative" rounded>
                  <q-popover class="bg-purple-2">
                    <q-list style="width: 300px">
                      <q-item dense v-for="(b, index) in Bare" :key="index">
                        <q-item-side icon="check" color="positive" />
                        <q-item-main :label="b" />
                      </q-item>
                    </q-list>
                  </q-popover>
                </q-btn>
              </q-card-title>
              <q-card-main>
                <p>wiSKiller: {{hc['Bare Unit deep cleaning'].wiSkiller}}</p>
                <p class="text-faded">Duration: {{hc['Bare Unit deep cleaning'].duration}}</p>
              </q-card-main>
              <q-card-actions>
                <q-btn no-caps @click="SelectwiSkiller(hc['Bare Unit deep cleaning'], hc['.key'], 'Home Cleaning', 'Bare Unit deep cleaning')" class="full-width" icon="fas fa-hand-pointer" color="purple" label="Choose wiSkillers & Book" />
              </q-card-actions>
            </q-card>
          </q-collapsible>
          <q-collapsible sparse v-if="hc['Furnished Unit deep cleaning']" label="Furnished Unit deep cleaning">
            <q-card>
              <q-card-title>
                <q-btn slot="right" label="info" no-caps color="negative" rounded>
                  <q-popover class="bg-purple-2">
                    <q-list style="width: 300px">
                      <q-item dense v-for="(f, index) in Furnish" :key="index">
                        <q-item-side icon="check" color="positive" />
                        <q-item-main :label="f" />
                      </q-item>
                    </q-list>
                  </q-popover>
                </q-btn>
              </q-card-title>
              <q-card-main>
                <p>wiSkiller: {{hc['Furnished Unit deep cleaning'].wiSkiller}}</p>
                <p class="text-faded">Duration: {{hc['Furnished Unit deep cleaning'].duration}}</p>
              </q-card-main>
              <q-card-actions>
                <q-btn no-caps @click="SelectwiSkiller(hc['Furnished Unit deep cleaning'], hc['.key'], 'Home Cleaning', 'Furnished Unit deep cleaning')" class="full-width" icon="fas fa-hand-pointer" color="purple" label="Choose wiSkillers & Book" />
                </q-card-actions>
            </q-card>
          </q-collapsible>
          <q-collapsible sparse v-if="hc['Move in / Move out deep cleaning']" label="Move in / Move out deep cleaning">
            <q-card>
              <q-card-title>
                <q-btn slot="right" label="info" no-caps color="negative" rounded>
                  <q-popover class="bg-purple-2">
                    <q-list style="width: 300px">
                      <q-item dense v-for="(c, index) in Construction" :key="index">
                        <q-item-side icon="check" color="positive" />
                        <q-item-main :label="c" />
                      </q-item>
                    </q-list>
                  </q-popover>
                </q-btn>
              </q-card-title>
              <q-card-main>
                <p>wiSkiller: {{hc['Move in / Move out deep cleaning'].wiSkiller}}</p>
                <p class="text-faded">Duration: {{hc['Move in / Move out deep cleaning'].duration}}</p>
              </q-card-main>
              <q-card-actions>
                <q-btn no-caps @click="SelectwiSkiller(hc['Move in / Move out deep cleaning'], hc['.key'], 'Home Cleaning', 'Move in / Move out deep cleaning')" class="full-width" icon="fas fa-hand-pointer" color="purple" label="Choose wiSkillers & Book" />
                </q-card-actions>
            </q-card>
          </q-collapsible>
          <q-collapsible sparse v-if="hc['Post construction deep cleaning']" label="Post construction deep cleaning">
            <q-card>
              <q-card-title>
                <q-btn slot="right" label="info" no-caps color="negative" rounded>
                  <q-popover class="bg-purple-2">
                    <q-list style="width: 300px">
                      <q-item dense v-for="(q, index) in Quick" :key="index">
                        <q-item-side icon="check" color="positive" />
                        <q-item-main :label="q" />
                      </q-item>
                    </q-list>
                  </q-popover>
                </q-btn>
              </q-card-title>
              <q-card-main>
                <p>wiSkiller: {{hc['Post construction deep cleaning'].wiSkiller}}</p>
                <p class="text-faded">Duration: {{hc['Post construction deep cleaning'].duration}}</p>
              </q-card-main>
              <q-card-actions>
                <q-btn no-caps @click="SelectwiSkiller(hc['Post construction deep cleaning'], hc['.key'], 'Home Cleaning', 'Post construction deep cleaning')" class="full-width" icon="fas fa-hand-pointer" color="purple" label="Choose wiSkillers & Book" />
                </q-card-actions>
            </q-card>
          </q-collapsible>
        </q-collapsible>
      </q-collapsible>

      <q-collapsible sparse icon="spa" indent label="Massage - Spa">
        <q-collapsible sparse v-for="(m, mi) in Massage" :key="mi" :label="m['.key']">
            <q-card>
              <q-card-title>
              </q-card-title>
              <q-card-main>
                <p>wiSkiller: {{m.wiSkiller}}</p>
                <p class="text-faded">Duration: {{m.duration}}</p>
              </q-card-main>
              <q-card-actions>
                <q-btn @click="SelectwiSkiller(m, '', 'Massage', m['.key'])" no-caps class="full-width" icon="fas fa-hand-pointer" color="purple" label="Choose wiSkillers & Book" />              </q-card-actions>
            </q-card>
        </q-collapsible>
      </q-collapsible>
      <q-collapsible sparse icon="business" indent label="Aircon Cleaning">
      </q-collapsible>
      <q-collapsible sparse icon="fas fa-utensils" indent label="Food Delivery">
      </q-collapsible>
      <q-collapsible sparse icon="fas fa-credit-card" indent label="Bills Payment">
      </q-collapsible>
    </q-list>

    <!-- <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    <q-list separator>
      <q-collapsible icon="fas fa-home" sparse indent label="Home Cleaning">
        <q-collapsible v-for="(h, hi) in Housekeeping" :key="hi" :label="'Area: '+ h['.key']">
          <q-collapsible v-if="h.Basic" label="Basic Cleaning">
            <q-card>
              <q-card-title>
                <q-btn class="q-py-xs q-px-sm" size="md" slot="right" label="info" no-caps rounded color="red">
                  <q-tooltip class="bg-purple" anchor="top right" self="bottom left" :offset="[10, 10]">
                    <div class="layout-padding">
                    Basic cleaning checklist <br><br>
                    - wiSkiller brings Tools <br>
                    - Floors and general surface areas (swept, mopped and disinfected) <br>
                    - Furniture (dusted) <br>
                    - Mirrors cleaned <br>
                    - Toilet and bath (washed) <br>
                    - Wastedbaskets (emptied/washed/sanitized/refined)
                    </div>
                  </q-tooltip>
                </q-btn>
              </q-card-title>
              <q-card-main>
                {{h.Basic.skiller}}<br>
                Duration: {{h.Basic.hour}}
              </q-card-main>
              <q-card-separator />
              <q-card-actions>
                <q-btn @click="SelectwiSkiller(h.Basic, h['.key'], 'Housekeeping', 'Basic Cleaning')" class="full-width" icon="fas fa-hand-pointer" color="purple" size="md" no-caps label="Choose wiSkillers & Book" />
              </q-card-actions>
            </q-card>
          </q-collapsible>
          <q-collapsible v-if="h.Deep" label="Deep Cleaning">
            <q-card>
              <q-card-title>
                <q-btn class="q-py-xs q-px-sm" size="md" slot="right" label="info" no-caps rounded color="red">
                  <q-tooltip class="bg-purple" anchor="top right" self="bottom left" :offset="[10, 10]">
                    <div class="layout-padding">
                      - All elements of basic cleaning <br>
                      - Baseboards <br>
                      - Beds making <br>
                      - Blinds and shutters <br>
                      - Cabinet <br>
                      - Carpets <br>
                      - Cobwebs removal <br>
                      - Couch/sofa, mattress <br>
                      - Doorsknobs <br>
                      - Countertops <br>
                      - Lamp and lampshades <br>
                      - Moldings and woodwork <br>
                      - Stairs <br>
                      - Stove-top and backsplashes <br>
                      - Stovetop and drip pans <br>
                    </div>
                  </q-tooltip>
                </q-btn>
              </q-card-title>
              <q-card-main>
                {{h.Deep.skiller}}<br>
                Duration: {{h.Deep.hour}}
              </q-card-main>
              <q-card-separator />
              <q-card-actions>
                <q-btn @click="SelectwiSkiller(h.Deep, h['.key'], 'Housekeeping', 'Deep Cleaning')" class="full-width" icon="fas fa-hand-pointer" color="purple" size="md" no-caps label="Choose wiSkillers & Book" />
              </q-card-actions>
            </q-card>
          </q-collapsible>
          <q-collapsible v-if="h['Move in / Move out']" label="Move in / Move out Cleaning">
            <q-card>
              <q-card-title>
                <q-btn class="q-py-xs q-px-sm" size="md" slot="right" label="info" no-caps rounded color="red">
                  <q-tooltip class="bg-purple" anchor="top right" self="bottom left" :offset="[10, 10]">
                    <div class="layout-padding">
                    Basic cleaning checklist <br><br>
                    - wiSkiller brings Tools <br>
                    - Floors and general surface areas (swept, mopped and disinfected) <br>
                    - Furniture (dusted) <br>
                    - Mirrors cleaned <br>
                    - Toilet and bath (washed) <br>
                    - Wastedbaskets (emptied/washed/sanitized/refined)
                    </div>
                  </q-tooltip>
                </q-btn>
              </q-card-title>
              <q-card-main>
                {{h['Move in / Move out'].skiller}} <br>
                Duration: {{h['Move in / Move out'].hour}}
              </q-card-main>
              <q-card-separator />
              <q-card-actions>
                <q-btn @click="SelectwiSkiller(h.Basic, h['.key'], 'Housekeeping', 'Move in / Move out Cleaning')" class="full-width" icon="fas fa-hand-pointer" color="purple" size="md" no-caps label="Choose wiSkillers & Book" />
              </q-card-actions>
            </q-card>
          </q-collapsible>
        </q-collapsible>
      </q-collapsible>

      <q-collapsible icon="spa" sparse indent label="Massage - Spa">
        <q-collapsible  v-for="(m, mi) in Massage" :key="mi" :label="m['.key']">
          <q-card>
            <q-card-main>
              {{m.skiller}} <br>
              {{m.hour}}
            </q-card-main>
            <q-card-separator />
            <q-card-actions>
              <q-btn class="full-width" @click="$router.push('/view_wiSkillers')" icon="fas fa-hand-pointer" color="purple" size="md" no-caps label="Choose wiSkillers & Book" />
            </q-card-actions>
          </q-card>
        </q-collapsible>
      </q-collapsible>
      <q-collapsible icon="business" sparse indent label="Aircon Cleaning">
      </q-collapsible>

      <q-collapsible icon="fas fa-utensils" sparse indent label="Food Delivery">
      </q-collapsible>
      <q-collapsible icon="fas fa-credit-card" sparse indent label="Bills Payment">
      </q-collapsible>
    </q-list> -->
  </q-page>
</template>

<style>
</style>

<script>
import { db } from 'src/firebase.js'
export default {
  name: 'PageIndex',
  data () {
    return {
      wiRequester: null,
      // Housekeeping: [],
      HomeCleaning: [],
      Massage: [],
      BasicCleaning: [
        'CAUTION:',
        'You provide Tools and Solutions to the Cleaner (wiSkiller)',
        'wiSkiller will perform cleaning task for you'
      ],
      Office: [
        'CAUTION:',
        'You provide Tools and Solutions to the Cleaner (wiSkiller)',
        'Clean windows, baseboards..',
        'Dust ceilings, walls and carpets',
        'Clean cabinets',
        'Clean floors'
      ],
      Bare: [
        'Thorough cleaning of the unit',
        'Clean walls',
        'Dust ceilings',
        'Clean trim, baseboards, window frames, and doorframes',
        'Dust handrails, mantels, and other various woodwork',
        'Clean sides and tops of doors',
        'Remove any paint, mud, and debris from hinges',
        'Clean built in interiors (shelves, cabinets, etc)',
        'Clean light fixtures and bulbs',
        'Clean electrical switches and outlets',
        'Clean inside closets, inside cabinets, and on top of shelves',
        'Clean balcony, windows',
        'Clean kitchen',
        'Clean toilet / bathroom',
        'All sanitized with Signature solutions and treatment from selected Partner'
      ],
      Furnish: [
        'Dust picture frames, knickknacks, ceiling fans, lamps, furniture, woodwork, shelves and baseboards',
        'Clean from ceiling to walls and mirrors',
        'Clean carpets or any other upholstered materials',
        'Wash all floors and dry wood floors',
        'Empty and clean ashtrays and wastebaskets',
        'Clean windows',
        'If you want to change your bed sheets, just leave it by the bed and all with be done for you',
        'Cabinets can be cleaned with supervision of owner',
        'Clean Kitchen, Toilet, Laundry area.. (if any)',
        'All with Special Signature Cleaning Solutions and Treatment from selected Partner'
      ],
      Construction: [
        'Clean walls',
        'Dust ceilings and ceiling fixtures',
        'Clean trim, baseboards, window frames, and doorframes',
        'Dust handrails, mantels, and other various woodwork',
        'Clean sides and tops of doors',
        'Remove any paint, mud, and debris from hinges',
        'Clean built in interiors (shelves, cabinets)',
        'Vacuum carpet',
        'Clean floors (may or may not include buffing, waxing, sealing)',
        'Clean windows and remove any stickers',
        'Clean light fixtures and bulbs',
        'Clean electrical switches and outlets',
        'Clean inside closets, cabinets and on top of shelves',
        'Remove drawers and clean underneath',
        'Clean blinds/shutters',
        'Remove and dispose of all trash',
        'Remove and dispose of any protective plastic film',
        'Clean Kitchen, Toilet, Laundry area and Pantry (if any)',
        'All with Special Signature Cleaning Solutions and Treatment from selected Partner'
      ],
      Quick: [
        'CAUTION',
        'You provide Tools and Solutions to the Cleaner (wiSkiller)',
        'Clean windows, baseboards',
        'Dust ceilings, walls and carpets',
        'Clean cabinets',
        'Clean floors'
      ]
    }
  },
  methods: {
    SelectwiSkiller (a, b, c, d) {
      let services = {
        data: a,
        sqms: b,
        service: c,
        type: d
      }
      console.log(services)
      this.$store.commit('example/serviceState', services)
      this.$router.push('/view_WiSkillers')
    }
  },
  mounted () {
    this.$binding('Massage', db.firestore().collection('Massage').orderBy('number'))
    // this.$binding('Housekeeping', db.firestore().collection('Housekeeping').orderBy('number'))
    this.$binding('HomeCleaning', db.firestore().collection('HomeCleaning').orderBy('number'))
  }
}
</script>
