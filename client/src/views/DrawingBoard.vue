<template>
    <div class='drawing_board'>
         <!-- LEFT TOOL PANEL -->
        <div id="left_panel" class="side_panel">
          <div class = "left_panel_menu_1">
              <div>Panel 1<br><br></div>              
          </div>

          <div class = "left_panel_menu_2">
            Panel 2
            
            <br>
          </div>
        </div> 
          <Canvas/>        
    </div>

</template>


<script>

  import Canvas from '../components/Canvas.vue'

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
      Canvas
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
    background-color: red;
}

</style>