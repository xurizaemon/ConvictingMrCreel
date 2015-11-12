(function () {
    'use strict';
    angular.module('app')
        .controller('contactController', ['contactService', '$q', '$mdDialog', contactController]);

    function contactController(contactService, $q, $mdDialog) {
        var self = this;

        self.selected = null;
        self.contacts = [];
        self.selectedIndex = 0;
        self.filterText = null;
        self.selectContact = selectContact;
        self.deleteContact = deleteContact;
        self.saveContact = saveContact;
        self.createContact = createContact;
        self.filter = filterContact;

        // Load initial data
        getAllContacts();

        //----------------------
        // Internal functions
        //----------------------

        function selectContact(contact, index) {
            self.selected = angular.isNumber(contact) ? self.contacts[contact] : contact;
            self.selectedIndex = angular.isNumber(contact) ? contact: index;
        }

        function deleteContact($event) {
            var confirm = $mdDialog.confirm()
                                   .title('Are you sure?')
                                   .content('Are you sure want to delete this contact?')
                                   .ok('Yes')
                                   .cancel('No')
                                   .targetEvent($event);


            $mdDialog.show(confirm).then(function () {
                contactService.destroy(self.selected.id).then(function (affectedRows) {
                    self.contacts.splice(self.selectedIndex, 1);
                });
            }, function () { });
        }

        function saveContact($event) {
            if (self.selected != null && self.selected.id != null) {
                contactService.update(self.selected).then(function (affectedRows) {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Updated Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
            else {
                //self.selected.id = new Date().getSeconds();
                contactService.create(self.selected).then(function (affectedRows) {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Added Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
        }

        function createContact() {
            self.selected = {};
            self.selectedIndex = null;
        }

        function getAllContacts() {
            contactService.getcontacts().then(function (contacts) {
                self.contacts = [].concat(contacts);
                self.selected = contacts[0];
            });
        }

        function filterContact() {
            if (self.filterText == null || self.filterText == "") {
                getAllcontacts();
            }
            else {
                contactService.getByName(self.filterText).then(function (contacts) {
                    self.contacts = [].concat(contacts);
                    self.selected = contacts[0];
                });
            }
        }
    }

})();
