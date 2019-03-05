<template>

    <div>
        Element inspector
        <br>
        <div v-if="selectedElement">            
            <v-text-field v-model="selectedElement.properties[0].label" label="Label"/>
            <v-checkbox v-model="selectedElement.properties[0].measured" label="Measured"/>

            <div v-if="selectedElement.properties[0].measured">
                <v-text-field v-model="selectedElement.properties[0].data_tag" label="Data Tag"/>  
            </div>
            
            <v-text-field v-model="selectedElement.properties[0].units" label="Units"/>  
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
                element_type: null
            }
        },
        computed:{
            selectedElement: function(){
                return this.$store.state.selected_element;
            }
        },
        methods:{            
        }

    }

</script>