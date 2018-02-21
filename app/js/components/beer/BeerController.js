var app = angular.module('distilled');

app.controller('BeerController', ['$scope', 'BeerService', '$http', function ($scope, BeerService, $http) {

    var randomBeerIndex = null;

    //Clear the array of other beers made by a given brewery
    var clearOthersByBrewery = function () {
        $scope.othersByBrewery = [];
    };

    //Get a random beer from the 50 stored on the scope on the initial app load
    //note: Could use BreweryDB api to get random beer on app load but this leads to a slower api call without a meaningful benefit
    $scope.getRandomBeer = function () {
        clearOthersByBrewery();

        var beersSize = $scope.originalFifty.length;

        //Although the default array size expected is 50 - get a random number based on the size of this array in case the API has sent an unexpected size
        var randomNumber = Math.floor((Math.random() * beersSize));

        //If the random number is the same as the previous random number call the function again
        if(randomBeerIndex === randomNumber) {
            $scope.getRandomBeer();
        } else {
            randomBeerIndex = randomNumber;
            $scope.detailBeer = $scope.originalFifty[randomNumber];

            //If the brewery details exist for this beer object, store the name on the scope
            if($scope.detailBeer.breweries[0]) {
                $scope.currentBrewery = $scope.detailBeer.breweries[0].name;
            }
        }

    };

    //Get the 50 beers promise and when it resolves, store the beers on the scope
    BeerService.fiftyBeersFuture.then(function(fiftyBeers){
        //Store the original 50 beers to revert back to if needed
        $scope.originalFifty = fiftyBeers;
        $scope.beers = $scope.originalFifty;
        $scope.getRandomBeer();
    });

    $scope.clearSearch = function () {
        $scope.searchQuery = "";
        $scope.beers = $scope.originalFifty;
        $scope.clearButton = false;
    };

    $scope.searchBeers = function () {

        //Do nothing if the search field is empty
        if(!$scope.searchQuery) {
            return null;
        }

        $http.get('api/search?q='+$scope.searchQuery+'&type=beer&withBreweries=Y&key=79067aa92ce6aa05dbb647cf5df7da92').then(function (data) {
            if(data.data.data) {
                $scope.query = "";
                $scope.failedQuery = "";
                $scope.beers = data.data.data;
                $scope.breweries = [];
            } else {
                $scope.beers = [];
                $scope.breweries = [];
                $scope.failedQuery = $scope.searchQuery;
            }
            $scope.clearButton = true;
        }, function (err) {
            //To be replaced by error view in future iterations
            alert("Error contacting BreweryDB API, please try again later");
        });
    };

    $scope.searchBreweries = function () {
        //Do nothing if the search field is empty
        if(!$scope.searchQuery) {
            return null;
        }

        $http.get('api/search?q='+$scope.searchQuery+'&type=brewery&key=79067aa92ce6aa05dbb647cf5df7da92').then(function (data) {
            if(data.data.data) {
                $scope.query = "";
                $scope.failedQuery = "";
                $scope.beers = [];
                $scope.breweries = data.data.data;
            } else {
                $scope.beers = [];
                $scope.breweries = [];
                $scope.failedQuery = $scope.searchQuery;
            }
            $scope.clearButton = true;
        }, function (err) {
            //To be replaced by error view in future iterations
            alert("Error contacting BreweryDB API, please try again later");
        });
    }

    $scope.searchBreweryBeers = function (breweryName) {
        $scope.searchQuery = breweryName;
        $scope.searchBeers();
    };

    $scope.showDetails = function (index) {
        clearOthersByBrewery();
        $scope.detailBeer = $scope.beers[index];
        $scope.currentBrewery = $scope.detailBeer.breweries[0].name;
    };

    $scope.showOtherBeerDetails = function (index) {
        $scope.detailBeer = $scope.othersByBrewery[index];
    };

    $scope.showOtherBeer = function (breweryId) {
        $http.get('api/brewery/'+breweryId+'/beers?p=1&withBreweries=Y&key=79067aa92ce6aa05dbb647cf5df7da92').then(function (response) {
            $scope.othersByBrewery = response.data.data;
        }, function (err) {
            //To be replaced by error view in future iterations
            alert("Error contacting BreweryDB API, please try again later");
        })
    };

}]);