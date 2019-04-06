<template>
    <div class='data_table_div'>
      
    <v-btn>Import</v-btn>
    <v-btn>Export</v-btn>
    <v-btn v-on:click='AddHeader'>Add Column</v-btn>
    <v-btn v-on:click='dialog_delete = true'>Delete Column</v-btn>
    <v-data-table
        :headers="headers"
        :items="desserts"
        class="elevation-1"
    >
    <!--
    <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.calories }}</td>
        <td class="text-xs-right">{{ props.item.fat }}</td>
        <td class="text-xs-right">{{ props.item.carbs }}</td>
        <td class="text-xs-right">{{ props.item.protein }}</td>
        <td class="text-xs-right">{{ props.item.iron }}</td>
      </template>
      -->
    </v-data-table>   

    <!--FIX DROPDOWN ESCAPING CARD-->
    <v-dialog v-model="dialog_delete" persistent max-width="300px">
      <v-card flat>
        <v-card-title>
          Delete Table Column
        </v-card-title>
        
        <v-card-text class="delete-dialog-card"> 
          <v-select
          :items="this.$store.state.input_columns"
          item-value="text"
          label="Column"
          single-line
          bottom
          menu-props="auto, overflowY"
          attach=".delete-dialog-card"
          ></v-select>               
          <v-layout justify-end>
            <v-btn color="red" dark>Delete</v-btn>
          </v-layout>
        </v-card-text>

        <v-card-actions>
          <v-btn color="blue" flat v-on:click="dialog_delete=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>

<script>

  export default {    
    methods:{
        
    },
    data: function(){
        return {
          dialog_delete: false,
          headers: [
              {
              text: 'Dessert (100g serving)',
              align: 'left',
              sortable: false,
              value: 'name'
              },
              { text: 'Calories', value: 'calories' },
              { text: 'Fat (g)', value: 'fat' },
              { text: 'Carbs (g)', value: 'carbs' },
              { text: 'Protein (g)', value: 'protein' },
              { text: 'Iron (%)', value: 'iron' }
          ],
          desserts: [
              {
              name: 'Frozen Yogurt',
              calories: 159,
              fat: 6.0,
              carbs: 24,
              protein: 4.0,
              iron: '1%'
              }
          ]
        }  
    },
    components: {      
    },

    methods:{
      BuildHeaders: function(){
        var header_names = this.$store.state.input_columns;
        this.headers = [];
        for(var i=0; i<header_names.length; i++){
          this.headers.push({
            text: header_names[i],
            name: header_names[i],
            sortable: false
          });
        }
      },

      AddHeader: function(){
        this.$store.state.input_columns.push('Z');
        this.BuildHeaders();
      }
    }
  }
</script>

<style>

</style>