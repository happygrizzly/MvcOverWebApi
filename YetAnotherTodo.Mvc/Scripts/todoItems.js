﻿(function () {
    function readCookie(name) {
        var nameEq = name + '=';
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];

            //Remove leading spaces
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }

            if (cookie.indexOf(nameEq) === 0) {
                return cookie.substring(nameEq.length, cookie.length);
            }
        }

        return null;
    }

    function TodoItem() {
        var self = this;

        self.id = '';
        self.description = ko.observable('');
        self.done = ko.observable(false);
        self.userId = '';
    }

    function ViewModel() {
        var self = this;

        //Auth
        self.presence = readCookie('presence');

        //ViewState
        self.showListView = ko.observable(true);
        self.showAddItem = ko.observable(true);

        //Data
        self.items = ko.observableArray([]);
        self.newItem = ko.observable(new TodoItem());

        //Functions
        self.load = function () {
            $.ajax(apiSettings.baseUrl + '/api/TodoItem', {
                dataType: 'json',
                //headers: {
                //    'Authorization': 'Bearer ' + self.presence
                //}
                xhrFields: {
                    withCredentials: true
                }
            }).done(function (data) {
                self.items.removeAll();

                for (var i = 0; i < data.length; i++) {
                    var item = new TodoItem();
                    item.id = data[i].Id;
                    item.description(data[i].Description);
                    item.done(data[i].Done);
                    item.userId = data[i].User.Id;

                    self.items.push(item);
                }
            });
        };

        self.addNewItem = function () {
            $.ajax(apiSettings.baseUrl + '/api/TodoItem', {
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + self.presence
                },
                data: {
                    description: self.newItem().description()
                }
            })
            .done(function () {
                self.load();
                self.newItem(new TodoItem());
            });
        };
    }

    var vm = new ViewModel();
    ko.applyBindings(vm);

    vm.load();
})(ko);