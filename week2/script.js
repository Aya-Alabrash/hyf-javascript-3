'use strict';
const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

function createAndAppend(tagName, parent) {
    const element = document.createElement(tagName);
    parent.appendChild(element);
    return element;
}

function main() {
    const root = document.getElementById('root');

    const header = createAndAppend('div', root);
    header.setAttribute('class', 'header');

    const label = createAndAppend('label', header);
    label.setAttribute('class', 'labelClass');
    label.textContent = 'Select a Repository: ';

    const select = createAndAppend('select', header);
    select.setAttribute('id', 'select');

    const container = createAndAppend('div', root);
    container.setAttribute('class', 'container');

    const errorDiv = createAndAppend('div', container);
    errorDiv.setAttribute('class', 'errorDiv');
    const errorText = createAndAppend('h3', errorDiv);
    errorText.setAttribute('id', 'errorText');

    const informationDiv = createAndAppend('div', container);
    informationDiv.setAttribute('class', 'infoDiv');
    const ulInfo = createAndAppend('ul', informationDiv);
    ulInfo.setAttribute('id', 'infoUl');

    const imagesDiv = createAndAppend('div', container);
    imagesDiv.setAttribute('class', 'imgDiv');
    const ulImg = createAndAppend('ul', imagesDiv);
    ulImg.setAttribute('id', 'imgUl');

    fetchJSON(url)
        .then(data => {
            setupSelect(data);
        })
        .catch(error => renderError(error));
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.responseType = 'json';
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                if (req.status < 400) {
                    resolve(req.response);
                } else {
                    reject(new Error(req.statusText));
                }
            }
        };
        req.send();
    });
}

function renderError(err) {
    const errorText = document.getElementById('errorText');
    errorText.innerHTML = ' Network error :  ' + err.message;
}

function setupSelect(repos) {
    const select = document.getElementById('select');
    repos.forEach((repo, i) => {
        const options = createAndAppend('option', select);
        options.innerHTML = repos[i].name;
        options.setAttribute('value', i);
    });
    select.addEventListener('change', () => {
        getDetails(repos[select.value]);
    });
    getDetails(repos[0]);
}

function getDetails(repo) {
    const ulInfo = document.getElementById('infoUl');
    ulInfo.innerHTML = '';

    const li0 = createAndAppend('li', ulInfo);
    li0.textContent = 'URL: ';
    const a = createAndAppend('a', li0);
    a.innerHTML = repo.html_url;
    a.setAttribute('href', repo.html_url);
    a.setAttribute('id', 'aLi');
    a.setAttribute('target', '_blank');
    const li1 = createAndAppend('li', ulInfo);
    li1.textContent = 'Name : ' + repo.name;
    const li2 = createAndAppend('li', ulInfo);
    li2.textContent = 'Description : ' + repo.description;
    const li3 = createAndAppend('li', ulInfo);
    li3.textContent = 'Forks : ' + repo.forks;
    const li4 = createAndAppend('li', ulInfo);
    li4.textContent = 'Updated : ' + repo.updated_at;

    getContributors(repo.contributors_url);
}

function getContributors(url) {
    const ulImg = document.getElementById('imgUl');
    ulImg.innerHTML = '';
    fetchJSON(url)
        .then(contributors => {
            contributors.forEach((contributor, i) => {
                const el = createAndAppend('li', ulImg);
                el.setAttribute('class', 'element');

                const contributorImg = createAndAppend('img', el);
                contributorImg.setAttribute('src', contributors[i].avatar_url);

                const contributorName = createAndAppend('div', el);
                contributorName.innerHTML = contributors[i].login;
                contributorName.setAttribute('id', 'contributorName');

                const contributorCounter = createAndAppend('div', el);
                contributorCounter.innerHTML = contributors[i].contributions;
                contributorCounter.setAttribute('id', 'contributionsCounter');
            });
        })
        .catch(error => renderError(error));
}
window.onload = main;
