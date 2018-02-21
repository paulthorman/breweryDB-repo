describe('BeerController', function () {

    var scope, ctrl, sampleBeers;

    beforeEach(module('distilled'));
    beforeEach(inject (function ($rootScope, $controller) {

        scope= $rootScope.$new();
        ctrl = $controller('BeerController', {
            '$scope': scope
        });

        sampleBeers = [{
            name: "Beer 1",
            breweries: [
                {name: "brewery 1"}
            ]
        }, {
            name: "Beer 2",
            breweries: [
                {name: "brewery 2"}
            ]
        }, {
            name: "Beer 3",
            breweries: [
                {name: "brewery 3"}
            ]
        }];

    }));

    it('checks that a beer object from the sampleBeer is returned', function () {

        scope.originalFifty = sampleBeers;

        scope.getRandomBeer();

        expect(scope.detailBeer).toBeDefined();

        var beerInArray = false;

        for(var i=0; i<sampleBeers.length; i++) {
            if(sampleBeers[i].name === scope.detailBeer.name) {
                return beerInArray = true;
            }
        }

        expect(beerInArray).toBe(true);
    });

    it('checks that a set random number returns the expected beer from the list', function () {

        //Store the original
        var originalMathRandom = Math.random();

        scope.originalFifty = sampleBeers;

        Math.random = function () {
            return 0.5;
        };

        scope.getRandomBeer();

        expect(scope.detailBeer.name).toEqual("Beer 2");

        //Restore Math.random() for future testing
        Math.random = originalMathRandom;
    })
});

