<template>
    <div class='drawing_board'>
         <!-- LEFT TOOL PANEL -->
        <div id="left_panel" class="side_panel">
          <div class = "left_panel_menu_1">
              <div>Panel 1<br><br></div>
              <div style="overflow-y: scroll; background-color: white;">
                Tree list
              </div>
          </div>

          <div class = "left_panel_menu_2">
            Panel 2
            <br>
            <v-btn v-on:click="AddNode">New Node</v-btn>
            <v-btn v-on:click="ResizeNode">Resize</v-btn>
            <br>
            Nodes In <input v-model="n_ports_in" id = "n_nodes_in" type="number" name="points" min="1" max="10" step="1" value="1">
            <br>
            Nodes Out <input v-model="n_ports_out" id = "n_nodes_out" type="number" name="points" min="1" max="10" step="1" value="1">
            <br>
            
            <br>            
          </div>

        </div>

        <div id="canvas"></div>
    </div>

</template>


<script>
  export default {    
    methods:{
        ResizeNode: function()
        {
          this.$store.state.canvas.ResizeNode(this.n_ports_in, this.n_ports_out);			
        },
        AddNode: function()
        {
          this.$store.state.canvas.AddNode(this.n_ports_in, this.n_ports_out);
        }
    },
    data: function(){
        return{
            n_ports_in:  1,
            n_ports_out :1,            
        }
    }
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