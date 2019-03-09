<template>
    <div class='drawing_board'>
         <!-- LEFT TOOL PANEL -->
         <ElementExplorer class="side_panel"/>        
         <Canvas/>        
    </div>

</template>


<script>

  import Canvas from '../components/Canvas.vue'
  import ElementExplorer from '../components/ElementExplorer.vue'

  export default {    
    methods:{
        
    },
    data: function(){
        return{
            n_ports_in:  1,
            n_ports_out :1,            
        }
    },
    components: {
      Canvas,
      ElementExplorer
    },
  }
</script>

<style>
.drawing_board{
    display: grid;
    height: 100%;
    width: 100%;

    grid-template-columns: 30% 1fr;
    overflow-y: hidden;
}

.canvas{
    grid-row: 2;
}

.side_panel{
    grid-row: 1;    
    height: 100%;
}

</style>