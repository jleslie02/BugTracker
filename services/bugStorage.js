var myApp = angular.module('bugtracker');

	myApp.factory('bugstorage', function ($http, $injector) {
		'use strict';
		// Detect if an API backend is present. If so, return the API module, else
		// hand off the localStorage adapter
		return $injector.get('localStorage');
	})
	.factory('localStorage', function ($q) {
		'use strict';

		var STORAGE_ID = 'bug-tracker';
		var TOTAL_NUMBER_OF_BUGS = "totalNumberOfBugs";

		var store = {
			bugs: [],

			totalNumber:0,

			_getFromLocalStorage: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			_getBugsFromLocalStorage: function () {
				return (localStorage.getItem(TOTAL_NUMBER_OF_BUGS)!== null?localStorage.getItem(TOTAL_NUMBER_OF_BUGS):0);
				
			},

			_saveToLocalStorage: function (bugs, total) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(bugs));
				localStorage.setItem(TOTAL_NUMBER_OF_BUGS, total);
			},

			clearAll: function () {
				var deferred = $q.defer();
				store._saveToLocalStorage([]);
				deferred.resolve(store.bugs);

				return deferred.promise;
			},

			delete: function (bug) {
				var deferred = $q.defer();

				store.bugs.splice(store.bugs.indexOf(bug), 1);
				store._saveToLocalStorage(store.bugs, store.totalNumber);
				deferred.resolve(store.bugs);

				return deferred.promise;
			},

			get: function () {
				var deferred = $q.defer();

				angular.copy(store._getFromLocalStorage(), store.bugs);
				deferred.resolve(store.bugs);

				return deferred.promise;
			},

			insert: function (bug, total) {
				var deferred = $q.defer();
				store.bugs.push(bug);
				store.totalNumber = total;
				store._saveToLocalStorage(store.bugs, total);

				deferred.resolve(store.bugs);
				return deferred.promise;
			},

			put: function (bug, index) {
				var deferred = $q.defer();

				store.bugs[index] = bug;

				store._saveToLocalStorage(store.bugs, store.totalNumber);
				deferred.resolve(store.bugs);

				return deferred.promise;
			}
		};

		return store;
	});
