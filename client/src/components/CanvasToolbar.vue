<template>

    <v-toolbar flat dense class="pa-0 ma-0">
                
        <v-btn small fab v-on:click="AddNode" flat compact><font-awesome-icon icon="plus" /></v-btn>

        <v-divider vertical></v-divider>
        
        <v-btn-toggle v-model="new_node_type" class="transparent">                
            <v-btn flat value='square'> <font-awesome-icon icon="square"/></v-btn>
            <v-btn flat value='mixer'> <font-awesome-icon icon="caret-right"/></v-btn>
            <v-btn flat value='split'> <font-awesome-icon icon="caret-left"/></v-btn>                       
        </v-btn-toggle>  

        <v-divider vertical></v-divider>
        <div>
            <v-text-field hide-details v-model="n_ports_in" type="number" label="Inputs"/>
        </div>               
        <v-divider vertical></v-divider>
        <div>
            <v-text-field hide-details v-model="n_ports_out" type="number" label="Outputs"/>
        </div>

        <v-divider vertical></v-divider>

        <v-btn v-on:click="ResizeNode" flat small class="pa-0 ma-0">Resize</v-btn>
        <v-item-group class="pa-0 ma-0">
            <v-btn fab flat small class="transparent"> <font-awesome-icon icon="search-plus" class="mt-auto"/></v-btn>
            <v-btn fab flat small class="transparent"> <font-awesome-icon icon="search-minus" class="mt-auto"/></v-btn>
        </v-item-group>
        

    </v-toolbar>

</template>

<script>

    export default {
        data: () => ({
            n_ports_in: 1,
            n_ports_out: 1,
            new_node_type: 'square'
        }),
        
        methods:{
            AddNode: function()
            {
                this.$store.dispatch('AddNode', {n_in: this.n_ports_in, n_out: this.n_ports_out});
            },

            ResizeNode: function()
            {
                this.$store.state.canvas.ResizeNode(this.n_ports_in, this.n_ports_out);
            }
        }
    }

</script>