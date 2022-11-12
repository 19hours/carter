import { defineStore } from "pinia";
import type { Carpark } from "./Carparks";
import type { Rental } from "./Rental";

export const useSpotlightStore = defineStore("spotlight", {
  state: () => {
    return {
      data: {} as Carpark | Rental,
      spotlight: false,
      selected: null,
    };
  },
  actions: {
    show(target: Carpark | Rental, markerId) {
      if (this.selected === markerId){
        this.deactivateSpotlight();
      }
      else{
        this.data = target;
        this.selected = markerId;
      }

    },
    activateSpotlight() {
      this.spotlight = true;
    },
    deactivateSpotlight() {
      this.spotlight = false;
      this.data = {};
      this.selected = null;
    },
  },
});
