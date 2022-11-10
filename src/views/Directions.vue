<template>
    <mapbox-map class="map" mapStyle="mapbox://styles/mapbox/outdoors-v10?optimize=true" :zoom="12"
      accessToken="pk.eyJ1IjoiMWhpdW9uaiIsImEiOiJjbDlhcnNha2MwbWRtM3BxdDJ1d2psNTF5In0.3I_UAtOyTVSwLev2yEua8w"
      :center="coords" :auto-resize="true">
      <!-- <mapbox-geolocate-control /> -->
      <mapbox-navigation-control position="bottom-left" />
      <MglGeojsonLayer
        sourceId="route"
        :source="source"
        layerId="mylayerID"
        :layer="layer"
      />
    </mapbox-map>
    
    <div id="title">
      <!-- <button @click="goCarparkPage()" class="back-btn">Back to Carpark Map</button> -->
    </div>
    
    <div id="instructions"></div>
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
        source: {},
        layer:{}
  
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
  
      // goCarparkPage() {
      //   this.$router.push({ name: "carparks" });
      // },
      getRoute() {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.coords[0]},${this.coords[1]};${this.destination.lat},${this.destination.lng}?steps=true&geometries=geojson&access_token=${this.token}`
        this.axios.get(url)
          .then((res) => {
            var query = res.data
            var data = query.routes[0];
            var route = data.geometry.coordinates;
            console.log(data)
            
            var geojson = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route
              }
            };
  
            this.source = {
              type: 'geojson',
              data: geojson
            }
  
            this.layer = {
              type: "line",
              paint: {
                  'line-color': '#3887be',
                  'line-width': 5,
                  'line-opacity': 0.75
              }
  
            }
            // console.log(MapboxMap)
            // MapboxMap.map.addLayer({
            //     id: 'route',
            //     type: 'line',
            //     source: {
            //       type: 'geojson',
            //       data: geojson
            //     },
            //     layout: {
            //       'line-join': 'round',
            //       'line-cap': 'round'
            //     },
            //     paint: {
            //       'line-color': '#3887be',
            //       'line-width': 5,
            //       'line-opacity': 0.75
            //     }
            //   });
            
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
                tripInstructions += `
                      <div>
                      In ${Math.round(distance)} metres, <br>
                          <b>${steps[step].maneuver.instruction}</b>
                          <hr>
                      </di>`;
              }
  
              instructions.innerHTML = tripInstructions
            }
  
  
  
          })
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
    top: 80px;
    bottom: 20%;
    right: 20px;
    padding: 20px;
    background-color: #fff;
    overflow-y: scroll;
    font-family: sans-serif;
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  }
  
  #title {
    position: absolute;
    padding: 20px;
    width: 300px;
    height: 80px;
    top: 20px;
    bottom: 20%;
    right: 20px;
    background-color: rgb(50, 65, 162);
    overflow-y: scroll;
    font-family: sans-serif;
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  }
  
  </style>