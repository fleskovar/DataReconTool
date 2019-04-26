<template>

    <div class="pa-4">
        Element inspector
        <br>
        <v-divider/>
        <br>
        <div v-if="selectedElement"> 
            <div :key="selectedElement.id">           
                <v-text-field v-model="selectedElement.value" label="Stream Label"/>
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
                <br>
                <v-divider/>            
                <br>
                <v-text-field v-model="selectedElement.properties[selected_prop].label" label="Property Label" v-on:change='updateComponent()'/>  
                
                <v-radio-group row v-model="selectedElement.properties[selected_prop].type" v-on:change='updateComponent()'>
                    <v-radio label="Measured" value="measured"></v-radio>
                    <v-radio label="Constant" value="constant"></v-radio>
                    <v-radio label="Unknown" value="unknown"></v-radio>
                </v-radio-group>
                               
                <!--<div v-if="selectedElement.properties[0].measured">-->         
                
                <div v-show='selectedElement.properties[selected_prop].type==="measured"'>               
                <v-text-field v-model="selectedElement.properties[selected_prop].data_tag" label="Data Tag"/>
                <v-text-field label="Sigma"/>
                </div>
                <v-text-field v-show='selectedElement.properties[selected_prop].type==="constant"' label="Value"/>
                <!--       
                <v-text-field v-model="selectedElement.properties[selected_prop].units" label="Units"/>  
                <v-divider/>  
                -->   
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
                selected_prop: 0,
            }
        },
        computed:{
            selectedElement: function(){
                return this.$store.state.selected_element;
            },            
        },
        methods:{  
            updateComponent: function(){
                //TODO: Refactor this so that this component is more reactive. 
                //The selected item in the store should not be a reference to the object of the mxgraph model.
                this.$forceUpdate();
            },
            selectProperty: function(index)
            {
                this.selected_prop=index;
                this.$forceUpdate();
            },
            removeProperty: function(index)
            {
                this.selectedElement.properties.splice(index, 1);
                this.$forceUpdate();
            },
            createProperty: function()
            {
                var prop={
					label: 'Property',
					optional: true,
					measured: false,
					data_tag: '',					
					value: 0.0,
					sd: 0.0,
					reconciled_value: 0.0,
					fixed: false					
                };
                this.selectedElement.properties.push(prop);
                this.$forceUpdate();
            },
            checkSelectedPropType: function(prop_type){
                var check = this.selectedElement.properties[this.selected_prop].type === prop_type;
                console.log(check);
                return check
            },               
        }
    }
</script>