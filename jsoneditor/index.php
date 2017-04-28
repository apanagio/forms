<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Advanced JSON Editor Example</title>
    
    <script src="./jsoneditor.js"></script>
    <!-- Foundation CSS framework (Bootstrap and jQueryUI also supported) -->
    <link rel='stylesheet' href='//cdn.jsdelivr.net/foundation/6.2.4/foundation.min.css'>
    <!-- Font Awesome icons (Bootstrap, Foundation, and jQueryUI also supported) -->
    <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css'>

    <!--<link rel='stylesheet' href='//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css''>-->
                

  </head>
  <body>
    <h1>Advanced JSON Editor Example</h1>
    
    <p>This example demonstrates the following:</p>
    <ul>
      <li>Loading external schemas via ajax (using $ref)</li>
      <li>Setting the editor's value from javascript (try the Restore to Default button)</li>
      <li>Validating the editor's contents (try setting name to an empty string)</li>
      <li>Macro templates (try changing the city or state fields and watch the citystate field update automatically)</li>
      <li>Enabling and disabling editor fields</li>
    </ul>
    
    <button id='submit'>Submit (console.log)</button>
    <button id='restore'>Restore to Default</button>
    <button id='enable_disable'>Disable/Enable Form</button>
    <span id='valid_indicator'></span>
    
    <div class='row'>
      <div id='editor_holder' class='medium-12 columns'></div>
    </div>    
    
    <script>
    /* global JSONEditor */

      // This is the starting value for the editor
      // We will use this to seed the initial editor 
      // and to provide a "Restore to Default" button.
      var starting_value = [
        {
          name: "John Smith",
          age: 35,
          gender: "male",
          location: {
            city: "San Francisco",
            state: "California",
            citystate: ""
          },
          pets: [
            {
              name: "Spot",
              type: "dog",
              fixed: true
            },
            {
              name: "Whiskers",
              type: "cat",
              fixed: false
            }
          ]
        }
      ];
    
      JSONEditor.defaults.options.theme = 'foundation6';
      JSONEditor.defaults.options.iconlib = 'fontawesome4';
//      JSONEditor.defaults.editors.object.options.collapsed = true;
      JSONEditor.defaults.options.disable_edit_json = true;
      JSONEditor.defaults.options.disable_properties = true;
      JSONEditor.defaults.options.disable_array_delete_all_rows = true;
      JSONEditor.defaults.editors.object.options.disable_array_delete = true;
      JSONEditor.defaults.options.disable_array_reorder = true;
      JSONEditor.defaults.options.disable_array_delete_last_row = true;
      JSONEditor.defaults.editors.object.options.disable_edit_json = true;
    //   JSONEditor.defaults.options.object_layout = "grid";

      
     


      // Initialize the editor
      var editor = new JSONEditor(document.getElementById('editor_holder'),{
        // Enable fetching schemas via ajax
        ajax: true,
        
        // The schema for the editor
        schema: {
        //   type: "array",
        //   title: "People",
        //   format: "tabs",
        //   items: {
        //     title: "Person",
        //     headerTemplate: "{{i}} - {{self.name}}",
        //     // oneOf: [
        //     //   {
        //     //     $ref: "basic_person.json",
        //     //     title: "Basic Person"
        //     //   },
        //     //   {
        //     //     $ref: "person.json",
        //     //     title: "Complex Person"
        //     //   },
        //     //   {
        //     //     $ref: "schema.json",
        //     //     title: "ΑΜΘ"
        //     //   }
        //     // ]
            
        //   }
            $ref: "schema.json"

        },
        
        // Seed the form with a starting value
        startval: starting_value,
        
        // Disable additional properties
        no_additional_properties: true,
        
        // Require all properties by default
        required_by_default: true
      });
      
      // Hook up the submit button to log to the console
      document.getElementById('submit').addEventListener('click',function() {
        // Get the value from the editor
        console.log(editor.getValue());
      });
      
      // Hook up the Restore to Default button
      document.getElementById('restore').addEventListener('click',function() {
        editor.setValue(starting_value);
      });
      
      // Hook up the enable/disable button
      document.getElementById('enable_disable').addEventListener('click',function() {
        // Enable form
        if(!editor.isEnabled()) {
          editor.enable();
        }
        // Disable form
        else {
          editor.disable();
        }
      });
      
      // Hook up the validation indicator to update its 
      // status whenever the editor changes
      editor.on('change',function() {
        // Get an array of errors from the validator
        var errors = editor.validate();
        
        var indicator = document.getElementById('valid_indicator');
        
        // Not valid
        if(errors.length) {
          indicator.style.color = 'red';
          indicator.textContent = "not valid";
        }
        // Valid
        else {
          indicator.style.color = 'green';
          indicator.textContent = "valid";
        }
      });
    </script>
  </body>
</html>