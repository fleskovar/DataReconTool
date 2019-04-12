<template>
    <div class='data_table_div'>
    
    <v-btn color="green" dark v-on:click='dialog_add = true'>Add Column</v-btn>
    <v-btn color="red" dark v-on:click='dialog_delete = true'>Delete Column</v-btn>
    <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
        hide-actions
    >

    <template v-slot:headers="props">
      <tr>
        <th>
         Index
        </th>
        <th
          v-for="header in props.headers"
          :key="header.text"
          class="text-sm-left"
        >          
          {{ header.text }}
        </th>
      </tr>
    </template>
    
    <template v-slot:items="props">
       <td>
        <v-checkbox
          primary
          hide-details
        ></v-checkbox>
      </td>
      
      <template v-for="(name, index) in header_names">
        <td class="text-xs-right" v-bind:key="index">
          <v-edit-dialog
            :return-value.sync="props.item[name]"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item[name] }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item[name]"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>          
        </td>
      </template>
    </template>
      
    </v-data-table>   

    <!--Delete column dialog-->
    <v-dialog v-model="dialog_delete" persistent max-width="300px">
      <v-card flat>
        <v-card-title>
          Delete Table Column
        </v-card-title>
        
        <v-card-text class="delete-dialog-card"> 
          <v-select
          :items="header_names"
          item-value="text"
          label="Column"
          single-line
          bottom
          menu-props="auto, overflowY"
          attach=".delete-dialog-card"
          v-model="delete_column_name"
          ></v-select>               
          <v-layout justify-end>
            <v-btn color="red" dark v-on:click="DeleteColumn">Delete</v-btn>
          </v-layout>
        </v-card-text>

        <v-card-actions>
          <v-btn color="blue" flat v-on:click="dialog_delete=false" dark>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Add column dialog-->
    <v-dialog v-model="dialog_add" persistent max-width="300px">
      <v-card flat>
        <v-card-title>
          Add Table Column
        </v-card-title>
        
        <v-card-text> 

          <v-text-field
            label="Column name" 
            v-model="add_column_name"           
          ></v-text-field>
                      
          <v-layout justify-end>
            <v-btn color="green" dark v-on:click="AddColumn"> Add</v-btn>
          </v-layout>
        </v-card-text>

        <v-card-actions>
          <v-btn color="blue" flat v-on:click="dialog_add=false" dark>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</div>
</template>

<script>

  export default {       
    data: function(){
        return {
          dialog_delete: false,
          dialog_add: false,
          delete_column_name: '',
          add_column_name: '',                   
          items: [{A:10.0, B:20.0, C:30.0}]
        }  
    },
    computed:
    {
      header_names: function(){
        return this.$store.state.data_input_column_names;
      },
      headers: function(){
        return this.$store.state.data_input_columns;
      }

    },
    components: {      
    },

    methods:{
      DeleteColumn: function(){
        this.$store.dispatch('RemoveColumnInput', this.delete_column_name);
        this.dialog_delete=false
      },

      AddColumn: function(){
        this.$store.dispatch('AddColumnInput', this.add_column_name);
        this.dialog_add=false
      }
    }
  }
</script>

<style>

</style>