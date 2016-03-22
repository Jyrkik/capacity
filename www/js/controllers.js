angular.module('app', ['onsen','ngStorage','ng-persist']);

angular.module('app').controller('AppController', function ($scope, $window, $persist) {

    //API
    $scope.calculateCapacity = calculateCapacity;
    $scope.storeCapacity = storeCapacity;
    $scope.showDialog = showDialog;

    init();

    function init(){
        $persist.get('capacity', 'CAPACITY_STORAGE', '{"key": "Kapacitet", "values": []}').then(function (value) {
            storage_object = angular.fromJson(value);
            storage_object.values.forEach(function(entry, index, theArray){
                theArray[index] = {x: new Date(entry.x), y: entry.y, category: getCapacityClass(entry.y)}
            });

            $scope.capacityStorage = storage_object;
        });

        $scope.capacityModel = {
            nutritionQuality: 4,
            relationshipQuality: 4,
            exerciseQuality: 4,
            challengeAmount: 4,
            restAmount: 4,
            relaxAmount: 4
        };

        $scope.dailyCapacitySaved = false;
    }

    var totalCapacity = 64;

    document.addEventListener('ons-carousel:postchange', function(event){
        document.querySelectorAll('.indicators')[event.lastActiveIndex].style.color = 'white';
        document.querySelectorAll('.indicators')[event.activeIndex].style.color = 'red';

        var togglerPrev = document.querySelector('.toggler-prev');
        var togglerNext = document.querySelector('.toggler-next');

        if (event.activeIndex === 6) {
            togglerPrev.style.display = 'block';
            togglerNext.style.display = 'none';

        } else if (event.activeIndex === 0) {
            togglerNext.style.display = 'block';
            togglerPrev.style.display = 'none';

        } else {
            togglerNext.style.display = 'block';
            togglerPrev.style.display = 'block';
        }
    });

    ons.ready(function() {
        ons.createDialog('partials/dialog.html', {parentScope: $scope}).then(function(dialog) {
            $scope.dialog = dialog;
        });

    });

    function getCapacityClass(totalCapacity) {
        if (totalCapacity >= 513){
            return 3;
        } else if (totalCapacity >= 346){
            return 2;
        } else if (totalCapacity >= 126){
            return 1;
        } else {
            return 0;
        }
    }

    function calculateCapacity() {
        totalCapacity =
            ((Number($scope.capacityModel.nutritionQuality) + Number($scope.capacityModel.relationshipQuality)) / 2) *
            ((Number($scope.capacityModel.exerciseQuality) + Number($scope.capacityModel.challengeAmount)) / 2) *
            ((Number($scope.capacityModel.restAmount) + Number($scope.capacityModel.relaxAmount)) / 2);

        var category = getCapacityClass(totalCapacity)
        if (category == 3){
            $scope.capacity = "active";
        } else if (category == 2){
            $scope.capacity = "feeling";
        } else if (category == 1){
            $scope.capacity = "logical";
        } else {
            $scope.capacity = "physical";
        }

    }

    function storeCapacity() {

        var today = new Date();
        if ($scope.capacityStorage.values.length > 0){
            $scope.capacityStorage.values.forEach(function(value){
                value.x  = new Date(value.x - 24*1000*60*60);
            });
        }

        if ($scope.capacityStorage.values.length >= 12){
            $scope.capacityStorage.values.shift();
        }

        $scope.capacityStorage.values.push({x: today, y: totalCapacity, category: getCapacityClass(totalCapacity)});
        $persist.set('capacity', 'CAPACITY_STORAGE', angular.toJson($scope.capacityStorage)).then(function () {
            console.log("capacity stored");
            $scope.dailyCapacitySaved = true;
        });

    }

    function showDialog(title, description){
        $scope.dialogTitle = title;
        $scope.dialogDescription = description;
        $scope.dialog.show();
    }

});

angular.module('app').factory('d3', function() {
    return d3;
});