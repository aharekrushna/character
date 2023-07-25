
function fetchCharacterData() {
    return fetch('https://swapi.dev/api/people/')
      .then(response => response.json())
      .then(data => data.results)
      .catch(error => console.error(error));
  }
  
 
  function createCharacterCard(character) {
    const container = document.querySelector('.container');
  
    const characterDiv = document.createElement('div');
    characterDiv.classList.add('character');
  
    const img = document.createElement('img');
    img.src = `https://starwars-visualguide.com/assets/img/characters/${getCharacterId(character.url)}.jpg`;
  
    const name = document.createElement('h1');
    name.textContent = character.name;
  
    const details = document.createElement('ul');
    details.innerHTML = `
      <li><strong>Gender:</strong> ${character.gender}</li>
      
      <li><strong>Age:</strong> ${character.birth_year}</li>
      
      <li><strong>Mass:</strong> ${character.mass}kg</li>
     
      <li><strong>Height:</strong> ${character.height}cm</li>
      
      <li><strong>Eye Color:</strong> ${character.eye_color}</li>
    
      <li><strong>Hair Color:</strong> ${character.hair_color}</li>
      
      <li><strong>Homeworld:</strong> <a href="${character.homeworld}">${character.homeworld}</a></li>
    
      <li><strong>Starship: </strong><a href="${character.starships[0]}">${character.starships[0]}</a></li>
    `;
  
    characterDiv.appendChild(img);
    characterDiv.appendChild(name);
    characterDiv.appendChild(details);
    container.appendChild(characterDiv);
  }
  
 
  function getCharacterId(url) {
    const pattern = /\/([0-9]+)\/$/;
    const matches = url.match(pattern);
    return matches ? matches[1] : '';
  }
  
 
  
  function populateCharacterSelect(characters) {
    const select = document.getElementById('character-select');
    select.innerHTML = '';
  
   
    characters.forEach(character => {
      const option = document.createElement('option');
      option.value = character.name;
      option.textContent = character.name;
      select.appendChild(option);
    });
  
    select.addEventListener('change', function () {
      const selectedCharacter = characters.find(character => character.name === select.value);
      if (selectedCharacter) {
        document.querySelector('.container').innerHTML = '';
        createCharacterCard(selectedCharacter);
      }
    });
  }
  
 
  fetchCharacterData().then(characters => {
    populateCharacterSelect(characters);
  });
  
  const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;

let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
  
