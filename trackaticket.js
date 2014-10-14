(function($, _) {
    
    // Use mustache.js style brackets in templates
    _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };
    
    // Set endpoint and compile templates from DOM
    var endpoint = 'http://api.phila.gov/staging-open311/v2/',
        searchTemplate = $('script[data-template="search"]').html(),
        resultTemplate = _.template($('script[data-template="result"]').html()),
        errorTemplate = _.template($('script[data-template="error"]').html());
    
    // Find the container by looking at the last script tag in the DOM (always this script)
    //  if data-container attribute is specified, use that container; otherwise, use the parent container
    var scriptTag = $('script').last(),
        container = scriptTag.attr('data-container') ? $(scriptTag.attr('data-container')) : scriptTag.parent();
    
    // Put the search template into the container
    container.html(searchTemplate);
    
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
                    $('.result', container).html(errorTemplate({ticketId: ticketId}));
                }
                // Otherwise display the result
                else {
                    $('.result', container).html(resultTemplate(response[0]));
                }
            });
        }
        // Prevent the normal form submission behavior
        e.preventDefault();
    });
})(window.jQuery, window._);