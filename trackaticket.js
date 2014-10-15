(function($, _) {
    
    // Use mustache.js style brackets in templates
    _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };
    
    // Set API endpoint
    var endpoint = 'http://api.phila.gov/staging-open311/v2/';
    
    // Default templates
    var defaultTemplates = {
        search: '<div class="trackaticket"><input type="text"><button type="button">Search</button><div class="result"></div></div>',
        result: '<dl><dt>ID</dt><dd>{{ service_request_id }}</dd><dt>Type</td><dd>{{ service_name }}</dd><dt>Department</dt><dd>{{ agency_responsible }}</dd><dt>Address</dt><dd>{{ address }}<dt>Status</dt><dd>{{ status }}<dt>Resolution</dt><dd></dd></dl>',
        error: '<span class="error">Ticket #<b>{{ ticketId }}</b> was not found</span>'
    };
    
    // Compile each of the defaultTemplates but check if it's been overridden in the DOM (via <script data-template="key">) first
    var templates = {};
    $.each(defaultTemplates, function(key, val) {
        templates[key] = _.template( $('script[data-template="' + key + '"]').length ? $('script[data-template="' + key + '"]').html() : val );
    });
    
    // Find the container by looking at the last script tag in the DOM (always this script)
    //  if data-container attribute is specified, use that container; otherwise, use the parent container
    var scriptTag = $('script').last(),
        container = scriptTag.attr('data-container') ? $(scriptTag.attr('data-container')) : scriptTag.parent();
        
    // Load stylesheet if specified via data-css-url attribute
    var cssUrl = scriptTag.attr('data-css-url');
    if(cssUrl) {
        // Make sure it hasn't already been loaded
        if( ! $('link[href="' + cssUrl + '"]').length) {
            scriptTag.after($('<link/>').attr({'href': cssUrl, 'rel': 'stylesheet'}));
        }
    }
    
    // Put the search template into the container
    container.html(templates.search);
    
    // When the search is executed
    $(container).on('click', 'button', function(e) {
        // Get the value of the textbox
        var ticketId = $('input[type="text"]', container).val(),
            button;
        
        // If the textbox has a value
        if(ticketId) {
            // Show loading indicator
            button = $('button', container);
            button.button('loading');
            
            // Query the API
            $.getJSON(endpoint + 'requests/' + ticketId + '.json', function(response) {
                // Turn off the loading indicator
                button.button('reset');
                
                // If there's no response or if there's an error, indicate such
                if(response.length < 1 || response[0].errors) {
                    $('.result', container).html(templates.error({ticketId: ticketId}));
                }
                // Otherwise display the result
                else {
                    $('.result', container).html(templates.result(response[0]));
                }
            });
        }
        // Prevent the normal form submission behavior
        e.preventDefault();
    });
})(window.jQuery, window._);