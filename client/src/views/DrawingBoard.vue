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
    mounted () {
      if(this.$store.state.canvas != null)
        this.$store.state.canvas.drawCanvas('canvas');
    },
 
  }
</script>

<style>
.drawing_board{
  display: grid;     
  grid-template-columns: 30% minmax(0, 1fr);     
  min-height: 0;
}

.canvas{
  grid-row: 2;
}

.side_panel{
  grid-row: 1;
  min-height: 0;
  overflow-y: scroll;
}

</style>