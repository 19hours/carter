import { defineStore } from "pinia";

export interface route {
  distance: number
}

export const useDirectionStore = defineStore("directions", {
  state: () => {
    return { route: [] as route[] };
  },
  actions: {
    getRoute(data : []){
      console.log(data)
      this.route = data
    }

  },
});
