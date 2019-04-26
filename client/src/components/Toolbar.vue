<template>
    <div class="toolbar_div">
      <v-toolbar dense class='pt-0 mt-0'>
         <v-toolbar-items>          
              <v-text-field v-on:change='SetDocumentName($event)'
              placeholder="Title"
              
            ></v-text-field>   

            <v-menu>            
                <v-btn slot="activator" flat small> File </v-btn>
                <v-list> 
                    <v-list-tile v-on:click="$emit('open')">Open</v-list-tile> 
                    <v-list-tile v-on:click="$emit('save')">Save</v-list-tile>                  
                </v-list>        
            </v-menu> 

            <v-menu>            
                <v-btn slot="activator" flat small> Data </v-btn>
                <v-list> 
                    <v-list-tile>Import CSV</v-list-tile> 
                    <v-list-tile>Export CSV</v-list-tile>                  
                </v-list>        
            </v-menu>

          </v-toolbar-items>  
      </v-toolbar>      
      
      <v-toolbar dense flat color="grey lighten-1">
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
    sockets: {
        connect: function () {
            console.log('socket connected');
            this.pingServer('');
        },
        pong: function (data) {
            console.log('this method was fired by the socket server.')
        },
        pong2: function (data) {
            console.log('did this again')
        }
    },
    data: function(){
      return{
        document_name: this.$store.state.document_name
      }
    },
    methods:{
      SetDocumentName: function(document_name){
        this.$store.commit('setDocumentName', document_name);
      },
      pingServer: function (data) {
            // $socket is socket.io-client instance
            console.log('pinging');
            this.$socket.emit('ping', data);
        }
    },
  }
</script>