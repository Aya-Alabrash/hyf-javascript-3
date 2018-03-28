'use strict';
let url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
let secondUrl = {};
let repoName = [];
let repoUrlArr = [];

function createAndAppend(tagName, parent) {
    const element = document.createElement(tagName);
    parent.appendChild(element);
    return element;
}

main();

function main() {
    let root = document.getElementById('root');

    let header = createAndAppend('div', root);
    header.setAttribute('class', 'header');

    let label = createAndAppend('label', header);
    label.setAttribute('class', 'labelClass');
    label.textContent = 'Select a Repository: ';

    let select = createAndAppend('select', header);
    select.setAttribute('id', 'select');

    let container = createAndAppend('div', root);
    container.setAttribute('class', 'container');

    let informationDiv = createAndAppend('div', container);
    informationDiv.setAttribute('class', 'infoDiv');
    let ulInfo = createAndAppend('ul', informationDiv);
    ulInfo.setAttribute('id', 'infoUl');

    let imagesDiv = createAndAppend('div', container);
    imagesDiv.setAttribute('class', 'imgDiv');
    const ulImg = createAndAppend('ul', imagesDiv);
    ulImg.setAttribute('id', 'imgUl');

}

fetchJSON(url, function (error, data) {
    if (error !== null) {
        console.error(error.message);
    } else {
        manipulateSelect(data);
    }
});

function fetchJSON(url, cb) {
    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.responseType = "json";
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            if (req.status < 400) {
                console.log(req.response);
                cb(null, req.response);
            } else {
                cb(new Error(req.statusText));

            }
        }
    }
    req.send();
}

function manipulateSelect(data) {
    for (let key in data) {
        repoName.push(data[key].name);
        repoUrlArr.push(data[key].url);
    }
    let select = document.getElementById('select');
    for (let i = 0; i < repoName.length; i++) {
        let options = createAndAppend('option', select);
        options.innerHTML = repoName[i];
        options.setAttribute('value', repoUrlArr[i]);
    }
    select.addEventListener('change', function (event) {
        getDetails(event.target.value);
        getImg(event.target.value);
    });
}

function getDetails(data) {
    let ulInfo = document.getElementById('infoUl');
    ulInfo.innerHTML = '';
    fetchJSON(data, (error, rep) => {
        if (error !== null) {
            console.error(error.message);
        }
        else {
            console.log(rep);
            // let select = document.getElementById('select');
            // let repo = select.options[select.selectedIndex].value;
            // console.log(repo);

            secondUrl.url = rep.contributors_url;

            let li0 = createAndAppend('li', ulInfo);
            li0.textContent = 'URL: ';
            let a = createAndAppend('a', li0)
            a.innerHTML = rep.html_url;
            a.setAttribute('href', rep.html_url);
            a.setAttribute('id', 'aLi');
            a.setAttribute('target', '_blank');
            let li1 = createAndAppend('li', ulInfo);
            li1.textContent = 'Name : ' + rep.name;
            let li2 = createAndAppend('li', ulInfo);
            li2.textContent = 'Description : ' + rep.description;
            let li3 = createAndAppend('li', ulInfo);
            li3.textContent = 'Forks : ' + rep.forks;
            let li4 = createAndAppend('li', ulInfo);
            li4.textContent = 'Updated : ' + rep.updated_at;

        }
    });

}

function getImg(data) {
    let ulImg = document.getElementById('imgUl');
    ulImg.innerHTML = '';
    fetchJSON(data, (error, rep) => {
        if (error !== null) {
            console.error(error.message);
        }
        else {
            secondUrl.url = rep.contributors_url;
            fetchJSON(secondUrl.url, (error, contributor) => {
                if (error !== null) {
                    console.error(error.message);
                } else {
                    console.log(contributor);

                    for (let key in contributor) {
                        let el = createAndAppend('li', ulImg);
                        el.setAttribute('class', 'element');

                        let contributorImg = createAndAppend('img', el);
                        contributorImg.setAttribute('src', contributor[key].avatar_url);

                        let contributorName = createAndAppend('div', el);
                        contributorName.innerHTML = contributor[key].login;
                        contributorName.setAttribute('id', 'contributorName');

                        let contributorCounter = createAndAppend('div', el);
                        contributorCounter.innerHTML = contributor[key].contributions;
                        contributorCounter.setAttribute('id', 'contributionsCounter');
                    }
                }
            });
        }
    });

}
