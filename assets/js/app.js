angular.module('lego', [])

.controller('mainCtrl', function($scope) {
	var apiKey = '85sxht8kfrf85keus8du5z8u';
	var url = 'http://api.walmartlabs.com/v1/search?apiKey=85sxht8kfrf85keus8du5z8u&query=ipod&categoryId=3944';

	var themes = {
		"Birthday": ["Standard", "Pokemon", "Dora"],
		"College": ["Toga", "Blacklight", "Glow"],
		"Life Event": ["Bachelor", "Wedding", "Baby Shower", "Graduation", "Retirement"],
		"Holiday": ["New Year", "Fourth of July", "Halloween"],
		"Game Day": ["Basketball", "Hockey", "Baseball", "Football", "Soccer"]
	}

	$scope.partyType = null;
	$scope.partyTheme = null;

	$scope.items = []; 
	$scope.cart = [];
	$scope.removed = [];
	$scope.totalCost = 0;
	$scope.wTotalCost = 0;

	var searchIds = [];
	var searchParam = 0;

	$.getJSON("data/whatever.json", function(data){
		console.log(data);
		$scope.items = data.items;
		$scope.$apply();
	});

	// $.ajax({
	//   url: url,
	//   dataType: "jsonp",
	//   success: function (data) {
	//   	console.log(data);
	//     $scope.items = data.items;
	//     $scope.$apply();
	//   }
	// });

	$scope.addToCart = function(idx) {
		$scope.cart.push($scope.items[idx]);
		$scope.items.splice(idx, 1);
		updateCost();
	}

	$scope.removeFromCart = function(idx) {
		$scope.removed.push($scope.cart[idx]);
		$scope.cart.splice(idx, 1);
		updateCost();
	}

	$scope.removeFromList = function(idx) {
		$scope.removed.push($scope.items[idx]);
		$scope.items.splice(idx,1);
	}

	function updateCost() {
		console.log("updating cost");
		$scope.totalCost = $scope.cart.reduce(function(pv, cv) {
			if(cv.msrp != null) return pv + cv.msrp;
			else return pv + cv.salePrice}, 0);
		$scope.wTotalCost = $scope.cart.reduce(function(pv, cv) {
			if(cv.salePrice != null) return pv + cv.salePrice;
			else return pv + 0}, 0);
		console.log($scope.totalCost);
	}

	$scope.updateSearchParam = function() {
		$scope.cart.forEach(function(e) {searchIds.push(e.itemId)});
		searchParam = searchIds.join(",");
		console.log(searchParam);
	}
});