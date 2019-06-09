const app = document.getElementById('root');
const container = document.createElement('div');
const baseUrl = 'https://image.tmdb.org/t/p/w200/';
container.setAttribute('class', 'container');
const movieListOverlay = document.getElementById('movieList');
const movieContainer = document.createElement('div');
movieContainer.setAttribute('id', 'movieContainer');
movieListOverlay.appendChild(movieContainer);
app.appendChild(container);
var allMovies = [],
	addList = [];
const constMovies = [];
var request = new XMLHttpRequest();
request.open('GET', 'https://api.themoviedb.org/3/movie/popular?api_key=699aa1f6bb0b3f6a60e074824770ac61', true);
request.onload = function() {
	// Begin accessing JSON data here
	if (request.status >= 200 && request.status < 400) {
		var data = JSON.parse(this.response);
		allMovies = data.results;
		sort();
	} else {
		const errorMessage = document.createElement('marquee');
		errorMessage.textContent = `Gah, it's not working!`;
		app.appendChild(errorMessage);
	}
};

request.send();

function domForMovies(movies, containerBox) {
	movies.forEach((movie) => {
		// Create Dom Card for movies
		const card = document.createElement('div');
		card.setAttribute('class', 'card');
		const overview = document.createElement('div');
		overview.setAttribute('class', 'overlayImg');
		const add = document.createElement('button');
		add.textContent = 'ADD';
		add.setAttribute('class', 'add ' + movie.id);
		const x = document.createElement('IMG');
		x.setAttribute('src', baseUrl + movie.poster_path);
		x.setAttribute('alt', movie.title);
		const h1 = document.createElement('h1');
		h1.textContent = movie.title;
		const p = document.createElement('p');
		p.textContent = `Release: ${movie.release_date}`;
		if (containerBox == movieContainer) {
			p.setAttribute('class', 'addedMovieTitle');
			h1.setAttribute('class', 'addedMovieTitle');
		}
		containerBox.appendChild(card);
		card.appendChild(overview);
		overview.appendChild(add);
		card.appendChild(x);
		card.appendChild(h1);
		card.appendChild(p);
		add.addEventListener('click', function() {
			addMovie(movie);
		});
	});
}

function addMovie(movie) {
	if (addList.indexOf(movie) === -1) {
		//check for Duplicate
		addList.push(movie);
	}
	// empty old add list
	movieContainer.innerHTML = '';
	domForMovies(addList, movieContainer);
}

function openNav() {
	// open side Nav for added movies
	document.getElementById('myNav').style.width = '50%';
}

function closeNav() {
	// close side Nav for added movies
	document.getElementById('myNav').style.width = '0%';
}

// search for movies
function search(e) {
	var allMoviesList = allMovies,
		newList;
	newList = allMovies.filter((item) => {
		// change current item to lowercase
		const fn = item.title.toLowerCase();
		// change search term to lowercase
		const filter = e.toLowerCase();
		// check to see if the current list item includes the search term return based on that
		return fn.includes(filter);
	});
	//make container empty
	container.innerHTML = '';
	// recreate Dom
	domForMovies(newList, container);
}

//sort by Year and Title
function sort() {
	var x = document.getElementById('mySelect').value,
		newList;
	if (x == 'year') {
		newList = allMovies.sort(function(a, b) {
			a = new Date(a.release_date);
			b = new Date(b.release_date);
			return a > b ? -1 : a < b ? 1 : 0;
		});
	} else {
		// id sort by title
		newList = allMovies.sort(function(a, b) {
			var x = a.title.toLowerCase();
			var y = b.title.toLowerCase();
			if (x < y) {
				return -1;
			}
			if (x > y) {
				return 1;
			}
			return 0;
		});
	}
	//make container empty
	container.innerHTML = '';
	// recreate Dom
	domForMovies(newList, container);
}
