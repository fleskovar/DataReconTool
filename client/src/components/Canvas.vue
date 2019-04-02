<template>

    <div class="canvas-container">
        <CanvasToolbar class="canvas-toolbar"/>
        <div class="canvas" id="canvas"/>
    </div>

</template>


<style>

.canvas-container{
    display: grid;
    grid-template-rows: 50px minmax(0, 1fr);
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.canvas{
    grid-row: 2;
    
}

.canvas-toolbar{
    grid-row: 1;
}

</style>

<script>

import CanvasToolbar from '../components/CanvasToolbar.vue'
  
export default {
  data: () => ({}),

  components: {
    CanvasToolbar
  },
  methods:{    
    

}
}
</script>