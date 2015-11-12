(function () {
    'use strict';
    var mysql = require('mysql');

    // Creates MySql database connection
    var connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "civimaster_xhddi"
    });

    angular.module('app')
        .service('contactService', ['$q', contactService]);

    function contactService($q) {
        return {
            getcontacts: getContacts,
            getById: getContactById,
            getByName: getContactByName,
            create: createContact,
            destroy: deleteContact,
            update: updateContact
        };

        function getContacts() {
            var deferred = $q.defer();
            var query = "SELECT * FROM civicrm_contact";
            connection.query(query, function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function getContactById(id) {
            var deferred = $q.defer();
            var query = "SELECT * FROM civicrm_contact WHERE id = ?";
            connection.query(query, [id], function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function getContactByName(name) {
            var deferred = $q.defer();
            var query = "SELECT * FROM civicrm_contact WHERE display_name LIKE  '" + name + "%'";
            connection.query(query, [name], function (err, rows) {
                if (err) deferred.reject(err);

                deferred.resolve(rows);
            });
            return deferred.promise;
        }

        function createContact(contact) {
            var deferred = $q.defer();
            var query = "INSERT INTO civicrm_contact SET ?";
            connection.query(query, contact, function (err, res)
                if (err) deferred.reject(err);
                deferred.resolve(res.insertId);
            });
            return deferred.promise;
        }

        function deleteContact(id) {
            var deferred = $q.defer();
            var query = "DELETE FROM civicrm_contact WHERE id = ?";
            connection.query(query, [id], function (err, res) {
                if (err) deferred.reject(err);
                deferred.resolve(res.affectedRows);
            });
            return deferred.promise;
        }

        function updateContact(contact) {
            var deferred = $q.defer();
            var query = "UPDATE civicrm_contact SET name = ? WHERE id = ?";
            connection.query(query, [contact.name, contact.contact_id], function (err, res) {
                if (err) deferred.reject(err);
                deferred.resolve(res);
            });
            return deferred.promise;
        }
    }
})();
