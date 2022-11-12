import { defineStore } from "pinia";

export interface route {
  distance: number
}

export const useDirectionStore = defineStore("directions", {
  state: () => {
    return {
       route: [] as route[] ,
       toCoords: [],
       fromCoords: [],
       turnbyturn: [],
       ttsAudio: {},
       tripDuration: 0,
      };
  },
  actions: {
    getRoute(data : []){
      this.route = data
    },
    setLocation(coordFrom, coordTo){
      this.fromCoords = coordFrom
      this.toCoords = coordTo
    },
    storeInstructions(instruction){
      this.turnbyturn = instruction
    },
    setTripDur(tripDur){
      this.tripDuration = tripDur
    },
    storeTTS(ttsResponse){
      this.ttsAudio = ttsResponse
    }
  },
});
