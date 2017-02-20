/**
 * app.js
 */
angular.module('app', ['ui.router', 'ngStorage', 'ui.grid'])

// app config
	.config(function ($stateProvider, $urlRouterProvider) {
		
		
		// route to home if no route is reached
		$urlRouterProvider.otherwise('/home');
		
		$stateProvider
		
		// home route
			.state('home', {
				url: '/home',
				templateUrl: './views/home.html',
				controller: 'StateController as stateCtrl'
			})
			
			// about route
			.state('about', {
				url: '/about',
				templateUrl: 'views/about.html'
			})
			
			// contact route
			.state('contact', {
				url: '/contact',
				templateUrl: 'views/contact.html'
			});
	})
	
	.run(function ($localstorage) {
		// if states object already exists in local storage do not set it again
		if ($localstorage.getObject('states') == null) {
			// set the initial array of states
			$localstorage.setObject('states', [
				{state: "North Carolina", capital: "Raleigh"},
				{state: "California", capital: "Sacramento"},
				{state: "South Carolina", capital: "Columbia"},
				{state: "Virginia", capital: "Richmond"},
				{state: "Texas", capital: "Austin"},
				{state: "Florida", capital: "Tallahassee"},
				{state: "New York", capital: "Albany"},
				{state: "Maryland", capital: "Annapolis"},
				{state: "West Virginia", capital: "Charleston"},
				{state: "Ney Jersey", capital: "Trenton"}
			]);
		}
	})
	
	.controller('StateController', ['$scope', '$localstorage', 'StateService',
		function ($scope, $localstorage, StateService) {
			
			// grab the states array from local storage
			this.states = $localstorage.getObject('states');
			
			// variables hide form
			this.changeShow = false;
			this.addShow = false;
			
			// define options of ui-grid
			this.statesOptions = {
				data: this.states,
				multiSelect: false,
				columnDefs: [
					{field: 'state', displayName: 'State'},
					{field: 'capital', displayName: 'Capital'}
				]
			};
			
			this.updateInput = function (state) {
				// get index of the state and capital of the dropdown
				stateIndex = this.states.findIndex(function (s) {
					if (s.state == state) {
						return s;
					}
				});
				
				// remember the current state we are editing
				$localstorage.setObject('editCurrentStateIndex', stateIndex);
				
				// prefill the change state form with the values
				this.changeShow = true;
				this.changeModel = {};
				this.changeModel.state = this.states[stateIndex].state;
				this.changeModel.capital = this.states[stateIndex].capital;
				
			};
			
			this.changeState = function (state, action) {
				
				var haveMatched = true, stateIndex;
				
				switch (action) {
					case "add":
						
						// call the add state function
						this.states = StateService.addState(this.states, state);
						
						this.addShow = false;
						this.addModel = {};
						break;
					
					case "delete":
						
						if (state !== undefined) {
							// find the index of the state obj to modify
							stateIndex = this.states.findIndex(function (s) {
								if (s.state == state) {
									return s;
								}
							});
							
							// remember the current state we are editing
							$localstorage.setObject('editCurrentStateIndex', stateIndex);
							
							// call the remove state function
							this.states = StateService.removeState(this.states, state);
							this.selectedState = undefined;
							this.changeShow = false;
						}
						
						break;
					
					case "submit":
						
						// call the change state function
						this.states = StateService.changeState(this.states, state);
						
						this.changeShow = false;
						break;
					
					default:
						
						haveMatched = false;
						break;
						
						// boolean to see if case has not been hit then do not set the object again
						if (haveMatched) {
							$localstorage.setObject('states', this.states);
						}
				}
			};
		}])
	
	//service to handle modifying states
	.factory("StateService", function ($localstorage) {
		return {
			addState: function (states, state) {
				states.unshift(state);
				
				// set the state array in local storage
				$localstorage.setObject('states', states);
				return states;
			},
			removeState: function (states, state) {
				states.splice($localstorage.getObject('editCurrentStateIndex'), 1);
				
				// set the state array in local storage
				$localstorage.setObject('states', states);
				return states;
			},
			changeState: function (states, state) {
				
				// replace the editted state with the new fields
				states.splice($localstorage.getObject('editCurrentStateIndex'), 1, state);
				
				// set the state array in local storage
				$localstorage.setObject('states', states);
				return states;
			}
		};
	})
	
	// service to handle localstorage
	.factory('$localstorage', ['$window', function ($window) {
		return {
			setObject: function (key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getObject: function (key) {
				return JSON.parse($window.localStorage[key] || null);
			}
		}
	}])
	
	// directive to watch for window resize
	.directive('resize', ['$window', function ($window) {
		
		function link(scope, element, attrs) {
			
			// grab the initial with and height
			scope.width = $window.innerWidth;
			scope.height = $window.innerHeight;
			
			// display the dimensions to the user
			element.text("width: " + scope.width + " | height: " + scope.height);
			
			// bind the resize action from the user
			angular.element($window).bind('resize', function () {
				
				// update the dimensions and display new values to the user as
				// the screen resizes
				scope.width = $window.innerWidth;
				scope.height = $window.innerHeight;
				
				element.text("width: " + scope.width + " | height: " + scope.height);
				
				scope.$digest();
			});
		}
		
		return {
			link: link
		};
	}]);