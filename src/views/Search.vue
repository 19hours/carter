<template>

  <mapbox-map class="map" mapStyle="mapbox://styles/mapbox/outdoors-v10?optimize=true" :zoom="12"
    accessToken="pk.eyJ1IjoiMWhpdW9uaiIsImEiOiJjbDlhcnNha2MwbWRtM3BxdDJ1d2psNTF5In0.3I_UAtOyTVSwLev2yEua8w"
    :center="[103.852119, 1.296568]" :auto-resize="true">
    <mapbox-navigation-control position="bottom-left" />


  </mapbox-map>
</template>
  
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