var app = angular.module('distilled', ['ngRoute'])

.run(function () {

    const KEY = "95f8caa772cdd7b4f5b11be4db0dcb60"
})

.config(function ($routeProvider) {

    $routeProvider
        .when('/beer', {
            templateUrl: 'app/js/components/beer/beer.html',
            controller: 'BeerController'
        })
        .otherwise('/beer');

})