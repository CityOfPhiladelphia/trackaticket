(function($, _) {
    
    //change template for sharepoint usage
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };
    
    var endpoint = 'http://api.phila.gov/open311/v2/',
        searchTemplate = $('script[data-template="search"]').html(),
        resultTemplate = _.template($('script[data-template="result"]').html()),
        errorTemplate = _.template($('script[data-template="error"]').html());
    
    // Get the container by reverse iterating script tags with data-container attribute
    var container = $('body'); // default container
    $($('script[data-container]').get().reverse()).each(function(key, val) {
        container = $($(val).attr('data-container')).length ? $($(val).attr('data-container')) : container;
    });
    
    // Put the search template into the container
    container.html(searchTemplate);
    
    // When the search is executed
    $(container).on('submit', 'form', function(e) {
        // Get the value of the textbox
        var ticketId = $('.trackaticket input[type="text"]').val();
        
        // If the textbox has a value
        if(ticketId) {
            // Show loading indicator
            var button = $('.trackaticket button');
            button.button('loading');
            
            // Query the API
            $.getJSON(endpoint + 'requests/' + ticketId + '.json', function(response) {
                // Turn off the loading indicator
                button.button('reset');
                
                // If there's no response or if there's an error, indicate such
                if(response.length < 1 || response[0].errors) {
                    $('.trackaticket div').html(errorTemplate({ticketId: ticketId}));
                }
                // Otherwise display the result
                else {
                    $('.trackaticket div').html(resultTemplate(response[0]));
                }
            });
        }
        // Prevent the normal form submission behavior
        e.preventDefault();
    })
})(window.jQuery, window._);