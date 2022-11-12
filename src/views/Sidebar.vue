<template>
  <div class="list">
    <Transition name="slide-fade">
      <div
        v-if="Object.keys(data).length > 0 && spotlight && isCarpark(data)"
        class="spotlight"
      >
        <div class="spotlight-title">
          {{ (data as Carpark).address }}
          <div @click="toggleSpotlight(String((data as Carpark).lat) + String((data as Carpark).lng))">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              class="spotlight-icon"
            >
              <path
                d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>

        <div class="list-row">
          <div class="list-col">
            <div class="spotlight-meta">
              {{
                (data as Carpark).shortTermParking === "No"
                  ? "No parking only"
                  : "Short term parking available"
              }}
            </div>
            <div class="spotlight-meta">{{ (data as Carpark).type }} carpark</div>
            <div class="spotlight-meta">
              Height restriction: {{ (data as Carpark).gantryHeight }}m
            </div>
            <div class="spotlight-meta">
              Carpark Decks: {{ (data as Carpark).carParkDecks }}
            </div>
            <div class="spotlight-meta">System: {{ (data as Carpark).system }}</div>
          </div>
          <div class="list-col-r">
            <div>
              <div class="carpark-lots" :class="(data as Carpark).availableLots == 0 && 'carpark-lots-none'">
                {{ (data as Carpark).availableLots }} / {{ (data as Carpark).totalLots }}
              </div>
              <div class="carpark-indicator">
                <div
                  class="indicator"
                  :class="
                    (data as Carpark).availableLots / (data as Carpark).totalLots >= 0.25
                      ? 'indicator-green'
                      : (data as Carpark).availableLots > 0
                      ? 'indicator-orange'
                      : ''
                  "
                ></div>
                <div
                  class="indicator"
                  :class="
                    (data as Carpark).availableLots / (data as Carpark).totalLots >= 0.5
                      ? 'indicator-green'
                      : ''
                  "
                ></div>
                <div
                  class="indicator"
                  :class="
                    (data as Carpark).availableLots / (data as Carpark).totalLots >= 0.75
                      ? 'indicator-green'
                      : ''
                  "
                ></div>
                <div
                  class="indicator"
                  :class="
                    (data as Carpark).availableLots / (data as Carpark).totalLots >= 0.9
                      ? 'indicator-green'
                      : ''
                  "
                ></div>
              </div>
              <div class="list-meta-r" v-if="(data as Carpark).availableLots != 0">Carpark lots available</div>
              <div class="list-meta-r" v-if="(data as Carpark).availableLots == 0">No carpark lots  </div>
            </div>
          </div>
        </div>
        <table class="rate-table" v-if="(data as Carpark).shortTermParking === 'Yes'">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Rates / 30 minutes</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="carparkRate in getCarparkRates((data as Carpark).address)"
            >
              <td>{{ carparkRate.day }}</td>
              <td>{{ carparkRate.startTime }} - {{ carparkRate.endTime }}</td>
              <td>
                {{
                  carparkRate.rate !== 0.0 ? `$${parseFloat(carparkRate.rate).toFixed(2)}` : "Free"
                }}
              </td>
            </tr>
          </tbody>
        </table>

        <table class="rate-table" v-if="(data as Carpark).shortTermParking === 'No'">
          <thead>
            <tr>
              <th>No parking available</th>
            </tr>
          </thead>
        </table>

        <div class="list-btn-group">
          <div class="list-btn spotlight-directions-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              class="list-btn-icon"
            >
              <path
                d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z"
                fill="currentColor"
              ></path>
            </svg>
            <span class="list-btn-text">Get Directions</span>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="slide-fade">
      <div
        v-if="Object.keys(data).length > 0 && spotlight && !isCarpark(data)"
        class="spotlight"
      >
        <div class="spotlight-title">
          {{ (data as Rental).address }}
          <div @click="toggleSpotlight(String((data as Rental).lat) + String((data as Rental).lng))">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              class="spotlight-icon"
            >
              <path
                d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
        <div class="list-meta list-meta-car spotlight-meta">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            class="list-car-icon"
          >
            <path
              d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85s-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9s-12.8 31.9-32 31.9z"
              fill="currentColor"
            ></path>
          </svg>
          BlueCars: {{ (data as Rental).cars_counter.bluecar }}
        </div>
        <div class="list-meta list-meta-car spotlight-meta">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 640 512"
            class="list-car-icon"
          >
            <path
              d="M544 192h-16L419.22 56.02A64.025 64.025 0 0 0 369.24 32H155.33c-26.17 0-49.7 15.93-59.42 40.23L48 194.26C20.44 201.4 0 226.21 0 256v112c0 8.84 7.16 16 16 16h48c0 53.02 42.98 96 96 96s96-42.98 96-96h128c0 53.02 42.98 96 96 96s96-42.98 96-96h48c8.84 0 16-7.16 16-16v-80c0-53.02-42.98-96-96-96zM160 432c-26.47 0-48-21.53-48-48s21.53-48 48-48s48 21.53 48 48s-21.53 48-48 48zm72-240H116.93l38.4-96H232v96zm48 0V96h89.24l76.8 96H280zm200 240c-26.47 0-48-21.53-48-48s21.53-48 48-48s48 21.53 48 48s-21.53 48-48 48z"
              fill="currentColor"
            ></path>
          </svg>
          Opel Ecorsa: {{ (data as Rental).cars_counter.opel_ecorsa }}
        </div>
        <div class="spotlight-meta">
          Charging slots: {{ (data as Rental).charge_slots }}
        </div>

        <div class="list-btn-group spotlight-btn-group">
          <div class="list-btn spotlight-directions-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              class="list-btn-icon"
            >
              <path
                d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z"
                fill="currentColor"
              ></path>
            </svg>
            <span class="list-btn-text">Get Directions</span>
          </div>
          <div
            class="list-btn spotlight-directions-btn"
            @click="bookRentalCar()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              class="list-btn-icon"
            >
              <path
                d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z"
                fill="currentColor"
              ></path>
            </svg>
            <span class="list-btn-text">Book now</span>
          </div>
        </div>
      </div>
    </Transition>
    <div v-if="$route.name === 'carparks'" v-show="!spotlight">
      <div
        v-for="carpark in carparks"
        class="list-item"
        @click="flyToCarpark(carpark)"
      >
        <div class="list-title">{{ carpark.address }}</div>
        <div class="list-row">
          <div class="list-col">
            <div class="list-meta">
              {{
                (data as Carpark).shortTermParking === "No"
                  ? "No parking only"
                  : "Short term parking available"
              }}
            </div>
            <div class="list-meta">{{ carpark.type }} carpark</div>
            <div class="list-meta">
              Height restriction: {{ carpark.gantryHeight }}m
            </div>
          </div>
          <div class="list-col-r">
            <div>
              <div class="carpark-lots" :class="carpark.availableLots == 0 && 'carpark-lots-none'">
                {{ carpark.availableLots }} / {{ carpark.totalLots }}
              </div>
              <div class="carpark-indicator">
                <div
                  class="indicator"
                  :class="
                    carpark.availableLots / carpark.totalLots >= 0.25
                      ? 'indicator-green'
                      : carpark.availableLots > 0
                      ? 'indicator-orange'
                      : ''
                  "
                ></div>
                <div
                  class="indicator"
                  :class="
                    carpark.availableLots / carpark.totalLots >= 0.5
                      ? 'indicator-green'
                      : ''
                  "
                ></div>
                <div
                  class="indicator"
                  :class="
                    carpark.availableLots / carpark.totalLots >= 0.75
                      ? 'indicator-green'
                      : ''
                  "
                ></div>
                <div
                  class="indicator"
                  :class="
                    carpark.availableLots / carpark.totalLots >= 0.9
                      ? 'indicator-green'
                      : ''
                  "
                ></div>
              </div>
              <div class="list-meta-r" v-if="carpark.availableLots != 0">Carpark lots available</div>
              <div class="list-meta-r" v-if="carpark.availableLots == 0">No carpark lots  </div>
            </div>
          </div>
        </div>
        <div class="list-btn-group">
          <div class="list-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              class="list-btn-icon"
            >
              <path
                d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z"
                fill="currentColor"
              ></path>
            </svg>
            <span class="list-btn-text">Get Directions</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$route.name === 'rental'" v-show="!spotlight">
      <div v-for="car in rentals" class="list-item" @click="flyToCarpark(car)">
        <div class="list-title">{{ car.address }}</div>
        <div class="list-meta list-meta-car">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            class="list-car-icon"
          >
            <path
              d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85s-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9s-12.8 31.9-32 31.9z"
              fill="currentColor"
            ></path>
          </svg>
          BlueCars: {{ car.cars_counter.bluecar }}
        </div>
        <div class="list-meta list-meta-car">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 640 512"
            class="list-car-icon"
          >
            <path
              d="M544 192h-16L419.22 56.02A64.025 64.025 0 0 0 369.24 32H155.33c-26.17 0-49.7 15.93-59.42 40.23L48 194.26C20.44 201.4 0 226.21 0 256v112c0 8.84 7.16 16 16 16h48c0 53.02 42.98 96 96 96s96-42.98 96-96h128c0 53.02 42.98 96 96 96s96-42.98 96-96h48c8.84 0 16-7.16 16-16v-80c0-53.02-42.98-96-96-96zM160 432c-26.47 0-48-21.53-48-48s21.53-48 48-48s48 21.53 48 48s-21.53 48-48 48zm72-240H116.93l38.4-96H232v96zm48 0V96h89.24l76.8 96H280zm200 240c-26.47 0-48-21.53-48-48s21.53-48 48-48s48 21.53 48 48s-21.53 48-48 48z"
              fill="currentColor"
            ></path>
          </svg>
          Opel Ecorsa: {{ car.cars_counter.opel_ecorsa }}
        </div>
        <div class="list-meta">Charging slots: {{ car.charge_slots }}</div>
        <div class="list-btn-group">
          <div class="list-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              class="list-btn-icon"
            >
              <path
                d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z"
                fill="currentColor"
              ></path>
            </svg>
            <span class="list-btn-text">Get Directions</span>
          </div>
          <div class="list-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 448 512"
              class="list-btn-icon"
            >
              <path
                d="M448 80v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48zm-88 16H248.029c-21.313 0-32.08 25.861-16.971 40.971l31.984 31.987L67.515 364.485c-4.686 4.686-4.686 12.284 0 16.971l31.029 31.029c4.687 4.686 12.285 4.686 16.971 0l195.526-195.526l31.988 31.991C358.058 263.977 384 253.425 384 231.979V120c0-13.255-10.745-24-24-24z"
                fill="currentColor"
              ></path>
            </svg>
            <span @click="bookRentalCar()" class="list-btn-text">Book now</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useCarparkStore, type Carpark } from "@/stores/Carparks";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { Icon } from "@vicons/utils";
import { Directions, MoneyBill } from "@vicons/fa";
import { useMapStore } from "@/stores/Map";
import { useRentalStore, type Rental } from "@/stores/Rental";
import { useSpotlightStore } from "@/stores/Spotlight";
import rawCarparks from "@/assets/data/carparks.json";

interface Rate {
  time_range: string;
  rate_cost: number;
  rate_time: number;
}

interface DayRate {
  day: number;
  flat_rate: {
    per_entry_rate: number;
    flat_rate: number;
  };
  rate: Rate[];
}

export default defineComponent({
  components: {
    Icon,
    Directions,
    MoneyBill,
  },
  methods: {
    flyToCarpark(location: Carpark | Rental) {
      const useMap = useMapStore();
      if (this.isCarpark(location)) {
        useMap.flyTo(location.lat, location.lng);
      } else {
        useMap.flyTo(location.lng, location.lat);
      }
      this.show(location);
    },
    bookRentalCar() {
      window.open("https://membership.bluesg.com.sg/account/home/");
    },
    isCarpark(data: Carpark | Rental): data is Carpark {
      return (<Carpark>data).availableLots !== undefined;
    },
    toggleSpotlight(latlng) {
      if (this.spotlight) {
        this.deactivateSpotlight();
      } else {
        this.activateSpotlight(latlng);
      }
    },
    getCarparkRates(address: string) {
      let data = [];
      for (let carpark of rawCarparks) {
        if (address === carpark.address) {
          if (carpark.parking_rate instanceof Array) {
            for (let rate of carpark.parking_rate) {
              let days = rate.day.toString().split("");
              for (let day of days) {
                let dayParsed;
                switch (parseInt(day)) {
                  case 1:
                    dayParsed = "Monday";
                    break;
                  case 2:
                    dayParsed = "Tuesday";
                    break;
                  case 3:
                    dayParsed = "Wednesday";
                    break;
                  case 4:
                    dayParsed = "Thursday";
                    break;
                  case 5:
                    dayParsed = "Friday";
                    break;
                  case 6:
                    dayParsed = "Saturday";
                    break;
                  case 7:
                    dayParsed = "Sunday";
                    break;
                }
                for (let subRate of rate.rate) {
                  let startTime = subRate.time_range.slice(0, 4);
                  let endTime = subRate.time_range.slice(4);
                  data.push({
                    day: dayParsed,
                    startTime,
                    endTime,
                    rate: subRate.rate_cost === -1 ? "Free" : subRate.rate_cost,
                  });
                }
              }
            }
          }
        }
      }
      return data;
    },
    ...mapActions(useSpotlightStore, [
      "show",
      "activateSpotlight",
      "deactivateSpotlight",
    ]),
  },
  computed: {
    day() {
      const d = new Date();
      let day = d.getDay();
      switch (day) {
        case 0:
          return "Sunday";
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Wednesday";
        case 4:
          return "Thursday";
        case 5:
          return "Friday";
        case 6:
          return "Saturday";
      }
    },
    ...mapState(useCarparkStore, ["carparks"]),
    ...mapState(useRentalStore, ["rentals"]),
    ...mapState(useSpotlightStore, ["data", "spotlight"]),
  },
  watch: {
    data: {
      handler(old) {
        if (Object.keys(old).length > 0) {
          this.activateSpotlight(String(old.lat) + String(old.lng));
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      rawCarparks,
      rates: [] as DayRate[] | DayRate,
    };
  },
});
</script>

<style scoped>
.list {
  overflow-y: scroll;
}
.list-item {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
  padding: 1rem 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.list-item:hover {
  background-color: #f0f0f0;
}
.list-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.carpark-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}
.indicator {
  height: 0.4rem;
  width: 1rem;
  background-color: #dddddd;
  border-radius: 6px;
  margin: 0 2px;
}
.indicator-green {
  background-color: green;
}
.indicator-orange {
  background-color: orange;
}
.list-meta {
  font-size: 0.8rem;
  margin: 0.2rem 0;
}
.list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.carpark-lots {
  font-size: 1.2rem;
  font-weight: 400;
  text-align: center;
  color: #5f5f5f;
}

.carpark-lots-none{
  color:#d85050;
  font-weight: 100;
}
.list-btn-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  border-top: 1px solid #e2e2e2;
  z-index: 10;
}
.list-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 0.8rem;
  flex: 25% 0 0;
  text-align: center;
  border-right: 1px solid #e2e2e2;
  height: 56px;
  cursor: pointer;
  color: #3d3d3d;
}
.list-btn:first-child {
  border-left: 1px solid #e2e2e2;
}
.list-btn:hover {
  background-color: black;
  color: #fff;
}
.list-btn-text {
  margin-top: 0.4rem;
}
.list-btn-icon {
  height: 0.9rem;
  width: 0.9rem;
}

.list-car-icon {
  color: rgb(0, 13, 255);
  height: 0.9rem;
  width: 0.9rem;
  margin-right: 0.4rem;
}

.list-col-l {
  float: left;
  width: 70%;
}
.list-col-r {
  float: left;
  width: 30%;
}

.list-meta-car {
  display: flex;
  align-items: center;
}
.list-meta-r {
  color: #5f5f5f;
  text-align: center;
  font-size: 0.6rem;
  margin: 0.2rem 0;
}

.spotlight {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.spotlight-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  background-color: #3d3d3d;
  color: #fff;
  width: 100%;
  padding: 1rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
.spotlight-icon {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.spotlight-meta {
  font-size: 0.8rem;
  margin: 0.2rem 0;
  padding: 0rem 1rem;
}
.spotlight-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0rem 1rem;
  box-sizing: border-box;
}
.spotlight-row > .spotlight-meta {
  padding: 0;
}
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
.rate-table {
  width: calc(100% - 2rem);
  margin-top: 1rem;
  margin: 1rem 1rem;
  box-sizing: border-box;
}

.rate-table th{
  font-weight: 500;
}
.rate-table,
.rate-table th,
.rate-table td {
  border: 1px solid #5f5f5f;
  padding: 0.5rem;
  font-size: 0.8rem;
}
.rate-table th {
  background-color: #4aada3;
  color: #fff;
}
.spotlight-directions-btn {
  flex: 100%;
}
.spotlight-btn-group {
  margin-top: 1rem;
}
</style>
