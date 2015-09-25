/** 
 * My own mini framework...
 *
 * Author: Patrice FERLET <metal3d@gmail.com>
 * Licence: BSD
 */

(function(window, Element, NodeList){
    'use strict';

    // Find subelement for a given element
    Element.prototype.find = function(query) {
        return this.querySelectorAll(query);
    };

    // apply eventListener on element
    function addEvent(eventname, callback){

        if (eventname === "ready"){
            eventname = "DOMContentLoaded";
        }

        if (typeof window.addEventListener !== 'undefined') {
            this.addEventListener(eventname, callback);	
        } else {
            this.attachEvent("on"+eventname, callback);
        }
        return this;
    }
    // map "on" method to the whole possible element
    Element.prototype.on = addEvent;
    window.on = addEvent;
    document.on = addEvent;

    // apply callback on each element in the list
    NodeList.prototype.each = function(callback) {
        var i;
        for (i=0; i<this.length; i++) {
            callback(this.item(i));
        }
        return this;
    };

    // apply eventListener on each element in the list
    NodeList.prototype.on = function(eventname, callback) {
        this.each(function(element) {
            element.on(eventname, callback);
        });
        return this;
    };

    // return only one Element for a CSS query
    window.$ = function (query){
        if(query == window || query instanceof Node) return query;
        return document.querySelector(query);
    };

    // return NodeList for a CSS query
    window.$$ = function(query) {
        return document.querySelectorAll(query);
    };


    // return a simple XMLHttpRequest that is compatible with IE, FF or Chrome (Opera, Safari too)
    var httpRequest = function(){
        if (typeof XMLHttpRequest != 'undefined') {
            return new XMLHttpRequest();
        } try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
        return null;
    };

    // A XHttpRequest helper
    function xhr(options) {
        if (options === null) {
            options = {};
        }
        this.onSuccess = options.onSuccess || function(){};
        this.onError = options.onError || function(){};
        this.url = options.url || "";
        this.method = options.method || "GET";
        this.headers = options.headers || null;
        this.xhr = httpRequest();


        var self = this;
        this.send = function(data) {
            self.xhr.open(self.method, self.url, true);

            if (self.headers) {
                for (var i in self.headers) {
                    self.xhr.setRequestHeader(i, self.headers[i]);
                }
            }

            self.xhr.onerror = function(e){
                var onerr = self.onError.bind(self.xhr, e);
                onerr();
            };

            self.xhr.onreadystatechange = function(){
                if (self.xhr.readyState == 4) {
                    if ( self.xhr.status >= 200 && self.xhr.status < 300) {
                        var cb = self.onSuccess.bind(self.xhr);
                        cb();
                        return;
                    }
                }
            };
            self.xhr.send(data);
        };
    }
    window.XHR = xhr;


    var pastable = function(element, callback){
        element.on('paste', function(evt){
            // use event.originalEvent.clipboard for newer chrome versions
            var items = (evt.clipboardData  || evt.originalEvent.clipboardData).items;

            // find pasted image among pasted items
            var blob = null;
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") === 0) {
                    blob = items[i].getAsFile();
                }
            }

            // load image if there is a pasted image
            if (blob !== null) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    var res = evt.target.result; // data url!
                    if (callback) {
                        callback(res);
                    }
                };
                reader.readAsDataURL(blob);
            }
        });
    };

    Element.prototype.enablePaste = function(callback){
        pastable(this, callback);
        return this;
    };

    NodeList.prototype.enablePaste = function(callback) {
        this.each(function(element){
            element.enablePaste(callback);
        });
        return this;
    };


    var dropFile = function(element, callback){
        element.on('dragover', function(evt){
            evt.stopPropagation();
            evt.preventDefault();
        });

        element.on('drop', function(evt){
            evt.stopPropagation();
            evt.preventDefault();
            callback(evt.dataTransfer.files);
        });
    };

    document.enableDropFile = function(){
        dropFile(document, callback);
        return document;
    };

    Element.prototype.enableDropFile = function(callback) {
        dropFile(this, callback);
        return this;
    };

    NodeList.prototype.enableDropFile = function(callback) {
        this.each(function(element){
            element.enableDropFile(callback);
        });
        return this;
    };

})(window, Element, NodeList);
