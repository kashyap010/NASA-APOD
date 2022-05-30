//UI VARS
let loader = document.querySelector('.loader'),
	container = document.querySelector('.container'),
	containerFavourites = document.querySelector('.container-favourites'),
	loadMoreBtn = document.querySelector('.load-more'),
	showFavouritesBtn = document.querySelector('.favourites'),
	alertMessage = document.querySelector('.alert-message');

//VARS
let favourites = [],
	tempArr = [],
	height = 0;
let favouritesToggle = true;
// const apiKey = 'DEMO_KEY';
const apiKey = '9PfrGchd9Mj7nCQVfvwCh6d6IMtmS2XYkDac4ney';
const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

async function getData(url, count) {
	startLoader();
	const res = await fetch(`${url}&count=${count}`);
	const data = await res.json();
	return data;
}

function startLoader() {
	loader.classList.remove('hidden');
}

function stopLoader() {
	loader.classList.add('hidden');
}

function buildCards(element, cards, isFavourite) {
	let temp = '';
	let btnClass, btnClick;
	if (isFavourite) {
		btnClass = 'remove-from-favourites';
		btnClick = 'removeFromFavourite(this);';
		btnMsg = 'Remove from Favourites';
	} else {
		btnClass = 'add-to-favourites';
		btnClick = 'addToFavourite(this);';
		btnMsg = 'Add to Favourites';
	}

	cards.forEach((card) => {
		temp += `
        <div class="card">
            <div class="card-header">
                <img src="${card.url}" alt="apod image" onclick="openInNewTab('${card.url}');">
            </div>
            <div class="card-body">
                <h2 class="title">${card.title}</h2>
                <div class="${btnClass}" onclick="${btnClick}">${btnMsg}</div>
                <div class="explanation">${card.explanation}</div>
																<div class="date">${card.date}</div>
            </div>
        </div>  
  `;
	});
	element.insertAdjacentHTML('afterbegin', temp);
}

function loadCards(count) {
	getData(url, count)
		.then((res) => {
			buildCards(container, res, false);
			stopLoader();
		})
		.catch((err) => console.error(new Error(err)));
}

function addToFavourite(elem) {
	let selected = {
		title: elem.previousElementSibling.innerText,
		explanation: elem.nextElementSibling.innerText,
		url: elem.parentElement.previousElementSibling.firstElementChild.src,
		timestamp: new Date().getTime(),
		date: elem.parentElement.children[3].innerText
	};
	favourites.push(selected);
	tempArr[0] = selected;
	buildCards(containerFavourites, tempArr, true);
	showAddedBtn('Added!');
	localStorage.setItem('favourites', JSON.stringify(favourites));
}

function removeFromFavourite(elem) {
	let title = elem.previousElementSibling.innerText;
	let card = elem.parentElement.parentElement;
	card.remove();
	favourites = favourites.filter((favourite) => favourite.title != title);
	localStorage.setItem('favourites', JSON.stringify(favourites));
	showAddedBtn('Removed!');

	if (favourites.length == 0) showFavourites(false);
}

function showFavourites(flag = true) {
	if (favourites.length === 0 && flag) return;

	if (favouritesToggle) {
		container.classList.add('slide-left-container');
		containerFavourites.classList.add('slide-left-container-favourites');
		container.classList.remove('slide-right-container');
		containerFavourites.classList.remove('slide-right-container-favourites');
	} else {
		container.classList.add('slide-right-container');
		containerFavourites.classList.add('slide-right-container-favourites');
		container.classList.remove('slide-left-container');
		containerFavourites.classList.remove('slide-left-container-favourites');
	}

	favouritesToggle = !favouritesToggle;
}

function showAddedBtn(msg) {
	alertMessage.innerText = msg;
	alertMessage.classList.add('show');
	setTimeout(() => {
		alertMessage.classList.remove('show');
	}, 3000);
}

function openInNewTab(url) {
	window.open(url, '_blank');
}

//EVENTS
window.onload = function() {
	startLoader();
	loadCards(3);

	if (localStorage.getItem('favourites')) {
		favourites = JSON.parse(localStorage.getItem('favourites'));
		buildCards(containerFavourites, favourites, true);
	} else favourites = [];
};

loadMoreBtn.addEventListener('click', () => {
	loadCards(3);
});

showFavouritesBtn.addEventListener('click', showFavourites);
