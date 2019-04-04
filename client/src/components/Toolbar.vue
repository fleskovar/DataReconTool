<template>
    <div>
      <v-toolbar dense class='pt-0 mt-0'>
         <v-toolbar-items>          
              <v-text-field v-on:change='SetDocumentName($event)'
              placeholder="Title"
              style="font-family: 'Roboto'"
            ></v-text-field>            
          </v-toolbar-items>  
      </v-toolbar>
      
      
      <v-toolbar dense flat style="font-family: 'Roboto'" color="grey lighten-2">

        <!--
        <v-toolbar-side-icon
          v-if="primaryDrawer.type !== 'permanent'"
          @click.stop="primaryDrawer.model = !primaryDrawer.model"
        ></v-toolbar-side-icon>
        -->      
        <v-menu>            
            <v-btn slot="activator" flat small> File </v-btn>
            <v-list>
                <v-list-tile v-on:click="$emit('open')">Open</v-list-tile> 
                <v-list-tile v-on:click="$emit('save')"> Save</v-list-tile>                  
            </v-list>        
        </v-menu>
        <v-btn to="/draw" flat small> Draw </v-btn>
        <v-btn to="/input-data" flat small> Input Data </v-btn>
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