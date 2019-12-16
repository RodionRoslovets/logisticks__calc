import './scss/new.scss'
window.addEventListener('DOMContentLoaded', () => {
    let calcBtn = document.querySelector('.calc-button'),
        from = document.querySelector('#from'),
        to = document.querySelector('#to'),
        tableBody = document.querySelector('.logistic-table__body'),
        resultContainer = document.querySelector('.result'),
        resultDist = document.querySelector('.logistic-data__dist'),
        prices = {
            one: 25,
            two: 28,
            three: 33,
            four: 41,
            five: 50
        };

    ymaps.ready(pre);

    function pre(){
        let suggestView1 = new ymaps.SuggestView('from'),
            suggestView2 = new ymaps.SuggestView('to');
    }

    calcBtn.addEventListener('click', () => {
        let mapContainer = document.querySelector('#map');
        tableBody.innerHTML = '';
        mapContainer.innerHTML = '';

        ymaps.ready(init);

        function init() {
            let routePanelControl = new ymaps.control.RoutePanel({
                options: {
                    visible: false
                }
            });

            let map = new ymaps.Map('map', {
                center: [57.37, 39.51],
                zoom: 7
            });

            map.controls.add(routePanelControl);

            routePanelControl.routePanel.state.set({
                from: from.value,
                fromEnabled: false,
                to: to.value,
                toEnabled: false
            });

            routePanelControl.routePanel.options.set({
                types: {
                    auto: true
                }
            });

            routePanelControl.routePanel.getRouteAsync().then(function (route) {
                route.model.setParams({
                    results: 1
                }, true);

                route.model.events.add('requestsuccess', function () {
                    var activeRoute = route.getActiveRoute();
                    var length;
                    if (activeRoute) {
                        // Получим протяженность маршрута.
                        length = Math.round(route.getActiveRoute().properties.get("distance").value / 1000);
                    }

                    function createRow() {
                        let row = document.createElement('tr');

                        row.classList.add('logistic-table__body__row');
                        tableBody.appendChild(row);

                        for (let key in prices) {
                            let cell = document.createElement('td');

                            cell.classList.add('logistic-table__body__cell')

                            cell.innerHTML = length * prices[key] + ' руб';

                            row.appendChild(cell);

                        }
                    }
                    createRow();

                    resultDist.innerHTML = `Протяженность маршрута ${length} км`;
                });

            }).then(function () {
                map.controls.remove('trafficControl');
                map.controls.remove('searchControl');
                map.controls.remove('typeSelector');
                map.controls.remove('geolocationControl');

                resultContainer.classList.add('result__visible');


            });

        }
    });
});