# Track a Ticket Widget
Embeddable 311 service request lookup widget. This tool uses a flexible approach to embedding javascript.

## Simple Installation
Add the `<script src="trackaticket.js"></script>` tag inside the container you'd like to load the widget into, with the `data-css-url` attribute pointing to the CSS file. For example:
```html
<!-- Dependencies (if they're not already loaded) -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
<script src="bootstrap-button-2.3.2.js"></script>

<div>
    <script data-css-url="//cityofphiladelphia.github.io/trackaticket/trackaticket.css" src="//cityofphiladelphia.github.io/trackaticket/trackaticket.js"></script>
</div>
```
You can use the files directly from the repo or download them locally.

## Advanced Installation

### Specify the Container
Instead of putting the `<script>` tag inside the desired container, you can put it anywhere in the document and set the `data-container` attribute to the jQuery selector of the desired container. For example:
```html
<div id="tracker"></div>

<script data-container="#tracker" data-css-url="trackaticket.css" src="trackaticket.js"></script>
```
**Note:** the `<script>` tag must be *after* the container element in the document. Typical best practice suggests putting `<script>` tags just before the closing `</body>` tag.

### Use your own Templates
The application uses mustache.js-style templates for the markup. Optionally, you can override the default templates by putting any of the following `<script>` tags in your document.

#### Search Template
```html
<script data-template="search" type="text/template">
    <div class="trackaticket">
        <input type="text">
        <button type="button">Search</button>
        <div class="result"></div>
    </div>
</script>
```

#### Result Template
```html
<script data-template="result" type="text/template">
    <dl>
        <dt>ID</dt>
        <dd>{{ service_request_id }}</dd>
        <dt>Type</td>
        <dd>{{ service_name }}</dd>
        <dt>Department</dt>
        <dd>{{ agency_responsible }}</dd>
        <dt>Address</dt>
        <dd>{{ address }}
        <dt>Status</dt>
        <dd>{{ status }}
        <dt>Resolution</dt>
        <dd></dd>
    </dl>
</script>
```

#### Error Template
```html
<script data-template="error" type="text/template">
    <span class="error">Ticket #<b>{{ ticketId }}</b> was not found!</span>
</script>
```

**Note:** these template `<script>` tags must be included *before* the `<script src="trackaticket.js">` tag

### Use your own Styles
The `data-css-url` attribute is optional. You can leave it off and include your own `<link>` or `<style>` tag in the document referencing elements inside the `<div class="trackaticket">` (or whatever you may have overridden in the templates).

### Multiple Widgets
You can embed the widget multiple times, into different containers, using the methods described above. For example:
```html
<div id="tracker1"></div>
<div id="tracker2"></div>

<script data-container="#tracker1" src="trackaticket.js"></script>
<script data-container="#tracker2" src="trackaticket.js"></script>
```
You'll have to use the same templates, but you can override the styles by qualifying the parent container. For example:

```css
#tracker1 .trackaticket { background: red; }
#tracker2 .trackaticket { background: blue; }
```