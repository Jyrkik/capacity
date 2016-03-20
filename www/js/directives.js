angular.module('app').directive('lineChart', ['d3', function(d3) {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            height: '@',
            width: '@'
        },
        template: '<svg ng-attr-height="{{ height }}" ng-attr-width="{{ width }}"></svg>',
        link: link
    };

    function link(scope, element) {
        var svg = element.find('svg'),
            chart;

        var update = function() {

            d3.select(svg[0])
                .datum([scope.data])
                .call(chart);

            d3.selectAll('.nv-group circle').each(function( ){
                d3.select(d3.select(this).node().parentNode).append('text')
                    .datum( d3.select(this).data() )
                    .text("text")
                    .attr('x',d3.select(this).attr('cx'))
                    .attr('y',d3.select(this).attr('cy'))
                    .style('pointer-events','none')
            });

        };

        var formatDate = function(d) {
            var day = d.getDate();
            var monthIndex = d.getMonth() + 1;
            return day + '-' + monthIndex;
        };

        scope.$watch(function() { return scope.data; }, function() {
            if (chart) {
                update();
            }
        });

        scope.$on('chartinit', update);

        nv.addGraph(function() {

            chart = nv.models.discreteBarChart()
                .x(function(d) { return formatDate(d.x) })
                .y(function(d) { return Math.ceil(d.y) })
                .showValues(true)
                .color(function (d, i) {
                    var colors = ['#38A9DB', '#E8B72C', '#B97823', '#BA2375'];
                    return colors[d.category];
                })
                .forceY([64,1000]);

            chart.yAxis.tickFormat(d3.format(',f'));
            chart.valueFormat(d3.format('d'));

            chart.legend.margin({top: 0, right: 0, bottom: 0, left: 0});
            chart.margin({top: 5, right: 0, bottom: 15, left: 0});

            nv.utils.windowResize(function() {
                chart.update()
            });

            scope.$emit('chartinit');

            return chart;
        });
    }
}]);