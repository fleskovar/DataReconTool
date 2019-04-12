<template>
    <div class="toolbar_div">
      <v-toolbar dense class='pt-0 mt-0' style="font-family: 'Roboto'">
         <v-toolbar-items>          
              <v-text-field v-on:change='SetDocumentName($event)'
              placeholder="Title"
              style="font-family: 'Roboto'"
            ></v-text-field>   

            <v-menu attach=".toolbar_div" >            
                <v-btn slot="activator" flat small> File </v-btn>
                <v-list style="font-family: 'Roboto'"> 
                    <v-list-tile v-on:click="$emit('open')">Open</v-list-tile> 
                    <v-list-tile v-on:click="$emit('save')">Save</v-list-tile>                  
                </v-list>        
            </v-menu> 

            <v-menu attach=".toolbar_div" >            
                <v-btn slot="activator" flat small> Data </v-btn>
                <v-list style="font-family: 'Roboto'"> 
                    <v-list-tile>Import CSV</v-list-tile> 
                    <v-list-tile>Export CSV</v-list-tile>                  
                </v-list>        
            </v-menu>

          </v-toolbar-items>  
      </v-toolbar>      
      
      <v-toolbar dense flat style="font-family: 'Roboto'; z-index: 0" color="grey lighten-1">
        <v-toolbar-items>
          <v-btn to="/draw" flat small> Draw </v-btn>
          <v-btn to="/input-data" flat small> Input Data </v-btn>
          <v-btn flat small to="/constraints-editor" > Constraints </v-btn>
          <v-btn flat small> Results </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <!--<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>-->

    </div>
</template>

<script>
  export default {
    data: function(){
      return{
        document_name: this.$store.state.document_name
      }
    },
    methods:{
      SetDocumentName: function(document_name){
        this.$store.commit('setDocumentName', document_name);
      }
    },
  }
</script>