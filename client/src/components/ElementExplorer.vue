<template>

    <div class="pa-4" style="overflow-y:scroll">
        Element inspector
        <br>
        <v-divider/>
        <div v-if="selectedElement"> 
            <div :key="selectedElement.id">           
                <v-text-field v-model="selectedElement.label" label="Stream Label"/>
                <v-divider/>
                Stream Properties
                <v-btn small fab flat compact v-on:click="createProperty"><font-awesome-icon icon="plus" /></v-btn>
                <v-btn small fab 
                    flat compact :disabled="!selectedElement.properties[selected_prop].optional"
                    v-on:click="removeProperty(selected_prop)"
                    >
                    <font-awesome-icon icon="trash" />
                </v-btn>
                
                <v-list style="width: 100%; height: 150px; overflow-y: scroll">
                    <template v-for="(prop, index) in selectedElement.properties">
                        <v-list-tile :key="index" v-ripple v-on:click="selectProperty(index)">
                            <v-list-tile-content>
                                <v-list-tile-title v-text="prop.label"></v-list-tile-title>                            
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
                
                <v-divider/>            
                
                <v-text-field v-model="selectedElement.properties[selected_prop].label" label="Property Label"/>  
                
                <v-layout align-center row>                
                        <v-checkbox v-model="selectedElement.properties[selected_prop].measured" label="Measured"/>
                        <!--<div v-if="selectedElement.properties[0].measured">-->
                        <div>
                            <v-text-field v-model="selectedElement.properties[selected_prop].data_tag" label="Data Tag"/>  
                        </div>                
                </v-layout>       
                <v-text-field v-model="selectedElement.properties[selected_prop].units" label="Units"/>  
                <v-divider/>     
            </div>
        </div>    
        <div v-if="selectedElement==null">
            No element selected
        </div>
    </div> 

</template>

<script>

    export default {
        data: function(){
            return{
                element: null,
                element_type: null,
                selected_prop: 0
            }
        },
        computed:{
            selectedElement: function(){
                return this.$store.state.selected_element;
            }
        },
        methods:{  
            selectProperty: function(index)
            {
                this.selected_prop=index;
            },
            removeProperty: function(index)
            {
                this.selectedElement.properties.splice(index, 1);
            },
            createProperty: function()
            {
                var prop={
					label: 'Property',
					optional: true,
					measured: false,
					data_tag: '',
					units: '',
					value: 0.0,
					sd: 0.0,
					reconciled_value: 0.0,
					fixed: false					
                };
                this.selectedElement.properties.push(prop);
            }      
        }

    }

</script>