<template>
  <mapbox-map
    class="map"
    mapStyle="mapbox://styles/mapbox/outdoors-v10?optimize=true"
    :zoom="16"
    accessToken="pk.eyJ1IjoiMWhpdW9uaiIsImEiOiJjbDlhcnNha2MwbWRtM3BxdDJ1d2psNTF5In0.3I_UAtOyTVSwLev2yEua8w"
    :center="[location.lng, location.lat]"
    :auto-resize="true"
  >
    <mapbox-geolocate-control />
    <mapbox-navigation-control position="bottom-left" />
    <mapbox-marker
      v-for="data in carparks"
      :lngLat="[data.lat, data.lng]"
      @click="show(data, String(data.lat) + String(data.lng))"
    >
      <template v-slot:icon>
        <div class="carpark-icon" :class="String(data.lat) + String(data.lng) === selected && 'active'">
          {{ data.availableLots }}
        </div>
      </template>
    </mapbox-marker>
  </mapbox-map>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCarparkStore, type Carpark } from "@/stores/Carparks";
import { mapActions, mapState } from "pinia";
import { useMapStore } from "@/stores/Map";
import { useSpotlightStore } from "@/stores/Spotlight";

export default defineComponent({
  computed: {
    ...mapState(useCarparkStore, ["carparks"]),
    ...mapState(useMapStore, ["location"]),
    ...mapState(useSpotlightStore, ["selected"]),
  },
  methods: {
    ...mapActions(useSpotlightStore, ["show"]),
  },
});
</script>

<style scoped>
.carpark-icon {
  height: 2rem;
  width: 2rem;
  border-radius: 4px;
  border: 2px solid #ffffff;
  color: #ffffff;
  font-weight: bold;
  background-color: #000;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: 0.2s all;
}

.active{
  background-color: #4aada3;
}
</style>
