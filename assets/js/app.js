angular.module('lego', [])

.controller('mainCtrl', function($scope) {
	var apiKey = '85sxht8kfrf85keus8du5z8u';
	var base = 'http://api.walmartlabs.com/v1/search?apiKey=85sxht8kfrf85keus8du5z8u&query=';
	var checkOutUrl = 'http://api.walmartlabs.com/v1/items?&apiKey=' + apiKey + '&ids=';
	var keywords = [
		"plate", "banner", "candle", "balloon",
		"party", "napkins", "snack", "drink"
	]

	$scope.themes = {
		"Birthday": ["Birthday", "Pokemon", "Dora", "Batman"],
		"College": ["College", "Toga", "Blacklight", "Glow"],
		"Life Event": ["Bachelor", "Wedding", "Baby Shower", "Graduation", "Retirement"],
		"Holiday": ["New Year", "Fourth of July", "Halloween", "Christmas"],
		"Game Day": ["Basketball", "Hockey", "Baseball", "Football", "Soccer"]
	}

	$scope.process = 0;

	$scope.party = {};

	$scope.items = []; 
	$scope.cart = [];
	recommended = [];
	$scope.totalCost = 0;
	$scope.wTotalCost = 0;

	var searchIds = [];
	var searchParam = 0;

	// $.getJSON("data/whatever.json", function(data){
	// 	console.log(data);
	// 	$scope.items = data.items;
	// 	$scope.$apply();
	// });

	$scope.apiCalls = function() {
		var urls = [];
		var index = 0;
		keywords.forEach(function(word){
			urls.push(base + $scope.party.theme + ' ' + word + '&numItems=4');
		});
		urls.forEach(function(e, i){
			setTimeout(function() {
				$.ajax({
		  			url: e,
		  			dataType: "jsonp",
		  			success: function (data) {
	  					console.log(data);
  						if(!data.items) return;

  						var minPrice = 10000000;
						data.items.forEach(function(e, idx) {
  							if(e.salePrice != null) {	
								if(e.salePrice < minPrice) {
									index = idx;
									minPrice = e.salePrice;
								}
							}
						});
						recommended = recommended.concat(data.items[index]);
		    			$scope.items = $scope.items.concat(data.items);
		    			$scope.$apply();
		  			}
		  		});
			}, i * 200);
		});
	}

	$scope.addToCart = function(idx) {
		if (!inCart($scope.items[idx])) {
			$scope.cart.push($scope.items[idx]);
			$scope.items.splice(idx, 1);
			updateCost();
		}
	}

	$scope.removeFromCart = function(idx) {
		if (!inItems($scope.cart[idx])) {
			$scope.items.push($scope.cart[idx]);
		}
		$scope.cart.splice(idx, 1);
		updateCost();
	}

	$scope.removeFromList = function(idx) {
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

	$scope.checkOut = function() {
		var productIds = [];
		$scope.cart.forEach(function(e) {productIds.push(e.itemId)});
		productIds = productIds.join(",");
		console.log(productIds);

		$.ajax({
			url: (checkOutUrl + productIds),
			dataType: "jsonp",
			success: function (data) {
				console.log(data);
			}
		});
	}

	$scope.resetParty = function() {
		$scope.party = {};
		$scope.process = 1;
		$scope.items = [];
		$scope.cart = [];
		recommended = [];
		updateCost();
	}

	function inCart(e) {
		return $.grep($scope.cart, function(el){ return el.itemId == e.itemId; }).length > 0;
	}

	function inItems(e) {
		return $.grep($scope.items, function(el){ return el.itemId == e.itemId; }).length > 0;
	}

	function removeItem(item) {
		$scope.items.forEach(function(e, i) {
			if (e.itemId == item.itemId) {
				$scope.items.splice(i, 1);
				return;
			}
		});
	}

	$scope.addRec = function() {
		recommended.forEach(function(e) {
			if (!inCart(e)) {
				$scope.cart.push(e)
				removeItem(e);
			}
		});
		updateCost();
	}
});