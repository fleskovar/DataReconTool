<template>

      <div id="app" class = "grid-container">

        <!--TOOLBAR -->
        <div id="header" class="header">          
          <toolbar v-bind:toolbar-options="toolbar_options"
           v-on:save='SaveModel'
           v-on:open='OpenFile'
           app
           />
        </div>

        <router-view class="main"></router-view>
        <input type='file' id='fileInput' v-on:change='OpenModel($event)' hidden>        
                
        <div id="console" class="console"> Asd</div>
    </div> 
</template>

<script>

  import Toolbar from './components/Toolbar.vue'
  
  export default {
    data: () => ({
      
      show_panel: false,
      toolbar_options: [
        {name:'File',
         options: ['Open', 'Save']
        },
        /*
        {name:'Edit',
         options: ['Preferences']
        },
        {name:'Data',
         options: ['Import', 'Edit']
        },
        {name:'Help',
         options: ['Help', 'About']
        }, 
        */       
      ],  
      n_ports_in:  1,
      n_ports_out :1 
    }),

    components: {
      Toolbar
    },
    methods:{
      
      SaveModel: function(){
        var xmlString = this.$store.state.canvas.GetModelXML();
        /*
        mxUtils.post(url, 'xml='+xmlString, function(req)
        {
            // Process server response using req of type mxXmlRequest
        });
        */
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xmlString));
        
        var file_name = this.$store.state.document_name + ".xml";
        
        element.setAttribute('download', file_name);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
      
      OpenFile: function(){
        var file_obj = document.getElementById('fileInput');
        file_obj.click();
      },

      OpenModel: function(ev){        

        const file = ev.target.files[0];
        if (!file) {
          return;
        }
        var reader = new FileReader();
        reader.onload = (e) => {
          var contents = e.target.result;
          // Display file content
          this.$store.state.canvas.LoadModel(contents);
        };
        reader.readAsText(file);
      }      
	  }	

  }
</script>

<style>
body {
    margin: 0;
}

html{
  overflow: hidden;
}

.grid-container {
   display: grid;
   height: 100vh;
   width: 100vw;
   position: absolute;
   grid-template-rows: auto minmax(0, 1fr) 30px;
   
}

.header {
    background-color: #2196F3;
    grid-row: 1;
}

.main {    
    grid-row: 2;       
    height: 100%;
    width: 100%;
    overflow: hidden; 
}


.console{   
    grid-row: 3;
    background-color: #2196F3;
}
</style>
