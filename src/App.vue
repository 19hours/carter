<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "@/views/Sidebar.vue";
import { useCarparkStore } from "./stores/Carparks";
import { useRentalStore } from "./stores/Rental";
import { mapActions, mapState } from "pinia";
import { useSpotlightStore } from "./stores/Spotlight";

export default defineComponent({
  mounted() {
    if (this.isMobile()) {
      this.sidebar = false;
    } else {
      this.sidebar = true;
    }
  },
  data() {
    return {
      sidebar: true,
    };
  },
  components: {
    Sidebar,
  },
  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) 
      ) {
        return true;
      } else {
        return false;
      }
    },
    refreshData() {
      const carpark = useCarparkStore();
      carpark.get();
      const rentals = useRentalStore();
      rentals.get();
    },
    ...mapActions(useSpotlightStore, ["deactivateSpotlight"]),
  },
  computed: {
    ...mapState(useSpotlightStore, ["data"]),
  },
  watch: {
    data() {
      this.sidebar = true;
    },
  },
});
</script>

<template>
  <div class="app">
    <Transition name="slide-fade">
      <div class="side" v-if="sidebar">
        <div class="logonav">
          <a href="/carter.html"><div class="logo">CARTER</div></a>
        </div>
        <div class="nav">
          <div class="nav-left">
            <RouterLink
              :to="{ name: 'carparks' }"
              class="nav-link"
              router-link-active="nav-link-active"
              @click="deactivateSpotlight"
              >Carparks</RouterLink
            >
            <RouterLink
              :to="{ name: 'rental' }"
              class="nav-link"
              router-link-active="nav-link-active"
              @click="deactivateSpotlight"
              >Rental</RouterLink
            >
            <RouterLink
              :to="{ name: 'search' }"
              class="nav-link"
              router-link-active="nav-link-active"
              @click="deactivateSpotlight"
              >Directions</RouterLink
            >
          </div>
          <div class="nav-right">
            <div class="sidebar-btn refresh-btn" @click="refreshData">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                enable-background="new 0 0 512 512"
                xml:space="preserve"
              >
                <g>
                  <path
                    d="M256,388c-72.597,0-132-59.405-132-132c0-72.601,59.403-132,132-132c36.3,0,69.299,15.4,92.406,39.601L278,234h154V80
      l-51.698,51.702C348.406,99.798,304.406,80,256,80c-96.797,0-176,79.203-176,176s78.094,176,176,176
      c81.045,0,148.287-54.134,169.401-128H378.85C360.105,353.561,311.712,388,256,388z"
                  ></path>
                </g>
              </svg>
            </div>
            <div class="sidebar-btn" @click="toggleSidebar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21.29 4.12L16.7 8.71l1.59 1.59c.63.63.18 1.71-.71 1.71H13c-.55 0-1-.45-1-1v-4.6c0-.89 1.08-1.34 1.71-.71l1.59 1.59l4.59-4.59a.996.996 0 0 1 1.41 0c.38.4.38 1.03-.01 1.42zM4.12 21.29l4.59-4.59l1.59 1.59c.63.63 1.71.18 1.71-.71V13c0-.55-.45-1-1-1h-4.6c-.89 0-1.34 1.08-.71 1.71l1.59 1.59l-4.59 4.59a.996.996 0 0 0 0 1.41c.4.38 1.03.38 1.42-.01z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    </Transition>
    <Transition>
      <div v-if="!sidebar" class="sidebar-open-btn" @click="toggleSidebar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </Transition>
    <RouterView />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
body {
  max-height: 100vh;
  width: 100%;
}
a:link, a:visited, a:hover, a:active{
  text-decoration:none;
}
.logo{
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color:#fff;
  align-items: center;
  justify-content: center;
  display: flex;
}
.logonav{
  display: block;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  justify-content: space-between;
  background-color: #262626;
}
.side {
  display: flex;
  flex-direction: column;
  width: 400px;
  border-right: 1px solid #f0f0f0;
  height: 100%;
  min-width: 400px;
}
.nav {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  justify-content: space-between;
  align-items: center;
}
.nav-link {
  padding: 0 0.5rem;
  margin: 0 0.5rem;
  text-decoration: none;
  color: rgb(26, 26, 26);
  font-size: 0.9rem;
}
.router-link-active {
  font-weight: bold;
  color: #000000;
}
.app {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: flex-start;
}
.sidebar-btn {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.sidebar-btn:hover {
  cursor: pointer;
}
@media (max-width: 992px) {
  .side {
    width: 100vw;
    min-width: 100vw;
  }
}
.sidebar-open-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 10;
  background-color: #000000;
  color: #fff;
}
.sidebar-open-btn > svg {
  width: 1.2rem;
  height: 1.2rem;
}
.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.25s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.nav-right {
  display: flex;
  align-items: center;
  justify-content: center;
}
.refresh-btn {
  margin-right: 1rem;
}
</style>
