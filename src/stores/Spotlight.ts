import { defineStore } from "pinia";
import type { Carpark } from "./Carparks";
import type { Rental } from "./Rental";

export const useSpotlightStore = defineStore("spotlight", {
  state: () => {
    return {
      data: {} as Carpark | Rental,
      spotlight: false,
    };
  },
  actions: {
    show(target: Carpark | Rental) {
      this.data = target;
    },
    activateSpotlight() {
      this.spotlight = true;
    },
    deactivateSpotlight() {
      this.spotlight = false;
      this.data = {};
    },
  },
});
