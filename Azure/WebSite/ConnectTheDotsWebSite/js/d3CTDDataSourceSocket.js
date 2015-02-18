﻿//  ---------------------------------------------------------------------------------
//  Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.
// 
//  The MIT License (MIT)
// 
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
// 
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
// 
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//  ---------------------------------------------------------------------------------

// events: onEventObject
function d3CTDDataSourceSocket(uri, handlers) {
    var self = this;
    // call base class contructor
    d3DataSourceSocket.call(self, uri, {
        onmessage: function (event) {
            self._onMessage.call(self, event);
        }
    });

    // register handlers
    if (handlers) {
        for (id in handlers) {
            self.addEventListener(id, handlers[id]);
        }
    }
    self._firstMessage = true;
    self._deviceName = 'All';
}

d3CTDDataSourceSocket.prototype = {
    constructor: d3CTDDataSourceSocket,
    _onMessage: function (event) {
        var self = this;
        if (self._firstMessage) {
            var req = {
                MessageType: "LiveDataSelection",
                DeviceName: self._deviceName
            };
            self._firstMessage = false;
            // send request
            self.sendMessage(req);

            // prevent next call
            event.handled = true;
        } else {
            // Parse the JSON package
            try {
                var eventObject = JSON.parse(event.owner.data);
            } catch (e) {
                $('#messages').prepend('<div>Malformed message: ' + event.data + "</div>");
                return;
            }
            // forward message
            self.raiseEvent('onEventObject', eventObject);
        }
    }
};

extendClass(d3CTDDataSourceSocket, d3DataSourceSocket);
