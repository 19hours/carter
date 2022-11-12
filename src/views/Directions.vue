<template>

  <mapbox-map class="map" mapStyle="mapbox://styles/mapbox/outdoors-v10?optimize=true" :zoom="12"
    accessToken="pk.eyJ1IjoiMWhpdW9uaiIsImEiOiJjbDlhcnNha2MwbWRtM3BxdDJ1d2psNTF5In0.3I_UAtOyTVSwLev2yEua8w"
    :center="coords" :auto-resize="true">
    <mapbox-navigation-control position="bottom-left" />

  </mapbox-map>

</template>
  
<script lang="ts">

import { useDirectionStore } from "@/stores/directions";
import { useMapStore } from "@/stores/Map";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { MapboxMap } from "vue-mapbox-ts";


export default defineComponent({
  data() {
    return {
      token: 'pk.eyJ1IjoiMWhpdW9uaiIsImEiOiJjbDlhcnNha2MwbWRtM3BxdDJ1d2psNTF5In0.3I_UAtOyTVSwLev2yEua8w',
      coords: [103.852119, 1.296568],
      stepsSpeech: [] as Array<string>,
      loaded: false,
      ttsAudio: "",
      ttsSpeech:{},
      ttsResponse: [],
      ttsLoaded: false,
      tripInstructions: [],
      // geoJsonLayer:{},
      // geoJsonSource:{}

    }
  },
  mounted() {
    if (this.fromCoords.length == 0){
      this.$router.push({ name: "search" })
    }
    this.getRoute()
    
  },
  methods: {
    ...mapActions(useDirectionStore, ["getRoute"]),
    ...mapActions(useDirectionStore, ["storeInstructions"]),
    ...mapActions(useDirectionStore, ["setTripDur"]),
    ...mapActions(useDirectionStore, ["storeTTS"]),
    getRoute() {
      this.loaded = true
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.fromCoords[1]},${this.fromCoords[0]};${this.toCoords[1]},${this.toCoords[0]}?steps=true&geometries=geojson&access_token=${this.token}`
      this.axios.get(url)
        .then((res) => {
          var query = res.data
          var data = query.routes[0];
          // var route = data.geometry.coordinates;

          // this.geoJsonLayer = {
          //   type: "line",
          //   paint: {
          //     'line-color': '#3887be',
          //     'line-width': 5,
          //     'line-opacity': 0.75
          //   }
          // }
          // this.geoJsonSource = {
          //   type: 'geojson',
          //   data: {
          //     id: "thisIsMySource",
          //     type: "FeatureCollection",
          //     features: [
          //       {
          //         type: "Feature",
          //         geometry: {
          //           type: "LineString",
          //           coordinates: route
          //         },
          //         properties: {
          //         }
          //       }
          //     ]
          //   },
          // }


          this.getRoute = data

          const steps = data.legs[0].steps;
          

          let tripInstructions = '';
          this.setTripDur(Math.floor(data.duration / 60))

          for (const step in steps){
            var distance = steps[step].distance
            var roundedDist = Math.round(distance)
            var maneuverInstr = steps[step].maneuver.instruction
            this.ttsSpeech[step] = (`In ${roundedDist} metres, ${maneuverInstr}`)
            this.stepsSpeech.push(steps[step].maneuver.instruction)              
            this.tripInstructions.push([roundedDist, maneuverInstr])
          }
          
          this.storeInstructions(this.tripInstructions)
          for (const key in this.ttsSpeech){
            setTimeout( () => this.getTTS(this.ttsSpeech[key], key), 2000);
          }
          this.ttsLoaded = true
          this.loaded = true
          this.storeTTS(this.ttsResponse)
        })  
    },
    getTTS(textContent, key) {
      var url = "http://api.voicerss.org/"
      this.axios.get(url, {
        params: {
          'key': '36ea24db9bf04d4eb54afe0521194973',
          'src': textContent,
          'hl': 'en-us',
          'c': 'MP3',
          'b64': 'true',
        }
      })
        .then(response => {
          this.ttsResponse[key] = response.data
        })
        .catch(error => {
          console.log(error.message)
        });
    },
    ...mapActions(useMapStore, ["flyTo"])
  },
  computed: {
    ...mapState(useMapStore, ["destination"]),
    ...mapState(useDirectionStore, ["toCoords", "fromCoords", "turnbyturn"]),



  },
  created() {
    
  },
},
);

</script>
  
<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

#instructions {
  position: absolute;
  width: 300px;
  top: 130px;
  bottom: 20%;
  right: 20px;
  padding: 20px;
  background-color: #fff;
  overflow-y: scroll;
  font-family: sans-serif;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  display: flex;
  justify-content: center;
}

#title {
  position: absolute;
  padding: 20px;
  width: 300px;
  height: 60px;
  top: 55px;
  bottom: 20%;
  right: 20px;
  background-color: rgb(50, 65, 162);
  overflow-y: scroll;
  font-family: sans-serif;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
}

.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid rgb(50, 65, 162);
  border-bottom: 16px solid rgb(50, 65, 162);
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  margin-top: 50%;

}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>