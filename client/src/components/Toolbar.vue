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
        <v-menu offset-y v-for="(t_opt, index) in toolbarOptions" :key="index" app>            
            <v-btn slot="activator" flat small>
                {{t_opt.name}}
            </v-btn>            
            <v-list>
                <v-list-tile
                    v-for="(item, sub_index) in t_opt.options"
                    :key="sub_index"                
                >
                    <v-list-tile v-on:click="$emit(item.toLowerCase())"> {{item}} </v-list-tile>
                </v-list-tile>
            </v-list>            
        </v-menu>
      </v-toolbar>
    </div>
</template>

<script>
  export default {    
    props: ['toolbarOptions'],
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