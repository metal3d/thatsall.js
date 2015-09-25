# "ThatsAll.js" a tiny JS lib

Because I love "vanilla JS" and I don't like to use JQuery, I decided to make my own mini js library to only have what I need:

- selector (`$(...)` and `$$(...)`)
- array ".each"
- XHR (that lot of people badly call "ajax")
- paste/drop file methods

Maybe I will append others later...

# Methods

All methods should work on:

- Element
- NodeList
- document (if possible)
- window (if possible)

You may use `$()` or `$$()` to select Element and NodeList.

## `$` and `$$`

I **hate** the way that JQuery makes use of "`$()`" to always return collection of a "jquery element". My goal was to alias querySelector() and querySelectorAll() functions.

So:

- `$(E)` return the "E" Element - you may pass a CSS selector or an element
- `$$(E)` return a NodeList of the E selector or element

That's all !

## `.on()`

"`.on()`" is a common alias to attachEvent for Internet Explorer, and addEventListener for other browsers. It changes the event name to be compatible on IE.

To use it:

```javascript
$$(a.toggleable).on("click", function(evt){
    console.log(evt.target)
});
```

That's all !


## `.each()`

ThatsAll.js appends "`.each()`" method on NodeList and Array objects. So, as `$$()` returns a NodeList:

```javascript
$$("div").each(function(el, i){
    console.log("Index: ", i);
    console.log("Element: ", el);
});
```

That's all !

## `.find()`

ThatsAll.js appends "`.find()`" method on Element and returns NodeList:

```javascript
$("#content").find("a").each(function(link){
    console.log("found link", link);
})
```

## XHR class

To make xhttprequests (badly called "ajax" in jQuery...) you can do:

```javascript
var xhr = new XHR({
    url: "...",
    onSuccess: function(){
        // "this" is the standard XHTTPRequest object
        console.log(this.responseText);
    },
    onError: function(err){
        console.error(err)
    },
    method: "GET", // or other HTTP verb
    headers: {
        "Header key": "Header value"
    }
});

xhr.send();
```

## `.enablePaste()`, `.enableDrop()`

To make an Element or NodeList able to get paste or droppable, you may use:

```javascript
$("#drop").enablePaste(function(files){
    console.log("Pasted files", files);
});
$("#drop").enableDrop(function(files){
    console.log("Dropped files", files);
});
```
