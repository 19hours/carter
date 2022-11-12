<template>

  <mapbox-map class="map" mapStyle="mapbox://styles/mapbox/outdoors-v10?optimize=true" :zoom="12"
    accessToken="pk.eyJ1IjoiMWhpdW9uaiIsImEiOiJjbDlhcnNha2MwbWRtM3BxdDJ1d2psNTF5In0.3I_UAtOyTVSwLev2yEua8w"
    :center="coords" :auto-resize="true">
    <mapbox-navigation-control position="bottom-left" />


  </mapbox-map>

      <div id="title">
      <button @click="playTTS()">speech</button>     
      </div>      
  <div id="instructions">
    <div v-if="!loaded">
      <div class="loader"></div>
    </div>
  </div>
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
      textResponse:'',
      textLoaded: false,
      // geoJsonLayer:{},
      // geoJsonSource:{}

    }
  },
  mounted() {
    if ("geolocation" in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition((position) => {
        var startlat = position.coords.longitude;
        var startlng = position.coords.latitude;
        this.coords = [startlat, startlng]
        this.getRoute()

      });
    }
  },
  methods: {
    ...mapActions(useDirectionStore, ["getRoute"]),


    getRoute() {
      this.loaded = true
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.coords[0]},${this.coords[1]};${this.destination.lat},${this.destination.lng}?steps=true&geometries=geojson&access_token=${this.token}`
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

          const instructions = document.getElementById('instructions');
          const title = document.getElementById('title');
          const steps = data.legs[0].steps;
          

          if (instructions && title) {
            let tripInstructions = '';
            title.innerHTML += `<div 
              style="position: relative; top:0px; color:white;"><h4>
              Trip duration: ${Math.floor(
              data.duration / 60
            )} min 🚘 </h4></div><div style="margin:10px">${tripInstructions}</div>`;

            for (const step in steps) {
              var distance = steps[step].distance
              this.stepsSpeech.push(steps[step].maneuver.instruction)
              tripInstructions += `
                      <div>
                      In ${Math.round(distance)} metres, <br>
                          <b>${steps[step].maneuver.instruction}</b>
                          <hr>
                      </di>`;
            }

            instructions.innerHTML = tripInstructions
            this.getTTS()
          }



        })
    },
    getTTS() {
      var url = "http://api.voicerss.org/"
      // var textContent = 'hello'
      var textContent = this.stepsSpeech[0]
      console.log(this.stepsSpeech[0])
      this.axios.get(url, {
        params: {
          'key': '3324ba20f87d4eb890cda72790b73d8b',
          'src': textContent,
          'hl': 'en-us',
          'c': 'MP3',
          'b64': 'true',
        }
      })
        .then(response => {
          this.textResponse = response.data
          console.log(this.textResponse)
          this.textLoaded = true
        })
        .catch(error => {
          console.log(error.message)
        });
    },
    playTTS(){
      console.log('playtts')
      var audio = new Audio(this.textResponse);
      
      audio.play();
    },
    ...mapActions(useMapStore, ["flyTo"])
  },
  computed: {
    ...mapState(useMapStore, ["destination"]),


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