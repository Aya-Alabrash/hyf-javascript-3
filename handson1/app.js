'use strict';

{
    const API = {
        endpoints: {
            laureate: 'http://api.nobelprize.org/v1/laureate.json?',
            prize: 'http://api.nobelprize.org/v1/prize.json?'
        },
        queries: [
            {
                description: 'All female laureates',
                endpoint: 'laureate',
                queryString: 'gender=female'
            }
        ]
    };

    //cb(error,data);
    function fetchJSON(url, cb) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    cb(null, xhr.response);
                }
                else {
                    cb(new Error(xhr.statusText));
                }
            }
        };
        xhr.send();
    }
    const url = API.endpoints.laureate + API.queries[0].queryString;
    function renderLaureates(laureates) {
        const root = document.getElementById('root');

        const listContainer = document.createElement('div');
        listContainer.id = 'List-Container';

        laureates.forEach(laureate => {
            const listItem = createAndAppend('div', root);
            //const listItem = document.createElement('div');
            listItem.setAttribute('class', 'List-Item');
            //listContainer.appendChild(listItem);

            const table = createAndAppend('table', listItem);
            // const table = document.createElement('table');
            // listItem.appendChild(table);

            const tbody = createAndAppend('tbody', table);
            const tr = createAndAppend('tr', tbody);
            const td1 = createAndAppend('td', tr);
            td1.setAttribute('class', 'label');
            const td2 = createAndAppend('td', tr);
            td1.innerHTML = 'Name:';
            td2.innerHTML = laureate.firstname + ' ' + laureate.surname;
        });
    }

    function createAndAppend(tagName, parent) {
        const elem = document.createElement(tagName);
        parent.appendChild(elem);
        return elem;
    }

    function callback(error, data) {
        if (error !== null) {
            console.error(error.message);
        }
        else {
            renderLaureates(data.laureates);
        }
    }


    fetchJSON(url, callback);
}

