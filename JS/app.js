class Storage {
    constructor(key) {
        this.key = key;
    }
    getStorage() {
        const data = window.localStorage.getItem(this.key);
        if (data) {
            return JSON.parse(data);
        }
        return data;
    }
    save(data) {
        window.localStorage.setItem(this.key, JSON.stringify(data))
    }
}
//--------STATE----------
let state = {
    start: false,
    cards: [],
    deck_id: '',
    remaining: '',
    infoBottom: true,

}

const storage = new Storage('app-state');

const GETRequest = (url, cb) => {
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', response => {
        const data = JSON.parse(response.currentTarget.response);
        cb(data)
    });
    request.send();
}



//-----HTML Objects---------

const newDeckButton = document.querySelector('.js-newdeck-button');
const drawButton = document.querySelector(".js-draw-button");
const deckInfoContainer = document.querySelector(".js-deck-info-container");
const cardContainer = document.querySelector(".js-card-container");
const idInput = document.querySelector(".js-add-id");
const remainingValue = document.querySelector(".js-add-remaning");
const cardInfoTop = document.querySelector('div p .js-card-info-top');
const cardInfoBottom = document.querySelector('div p .js-card-info.bottom');

//--------Events----------

newDeckButton.addEventListener('click', (e) => {
    state.start = true;
    state.cards = [];
    let url = 'https://deckofcardsapi.com/api/deck/new/shuffle/';

    GETRequest(url, data => {

        const deckId = data.deck_id;
        const remainingCards = data.remaining;
        state.remaining = remainingCards;
        console.log(remainingCards)
        state.deck_id = deckId;
        idInput.innerHTML = state.deck_id;
        remainingValue.innerHTML = state.remaining;

        console.log('this state', state)
        storage.save(state);
        render(state)
    })

});

drawButton.addEventListener('click', (e) => {
    //add card to state.cards[]
    let url = `https://deckofcardsapi.com/api/deck/${state.deck_id}/draw/?count=1`;
    GETRequest(url, data => {
        console.log('this is data', data)

        state.remaining = data.remaining;

        remainingValue.innerHTML = state.remaining;
        console.log("this remaining", state.remaining)
        let card = data.cards[0]

        const cardImg = card.image;
        const cardValue = card.value;
        const cardSuit = card.suit;

        const cardObj = {};
        cardObj.image = cardImg;
        cardObj.value = cardValue;
        cardObj.suit = cardSuit;

        state.cards.unshift(cardObj);
        storage.save(state);
        render(state);

        if (state.remaining === 0) {
            return alert("NO MORE CARDS!, GET NEW DECK");
        }
        storage.save(state);
        render(state);

    })

    storage.save(state);
    render(state);

});

cardContainer.addEventListener('click', (e) => {
    if (e.target.matches('img')) {
        console.log(e.target)
        const index = e.target.getAttribute('data-index');
        console.log('index', index);
e.target.classList.add('color');
console.log(state.infoBottom);
console.log(cardInfoBottom);
        storage.save(state);
        render(state)
    }
    storage.save(state);
    render(state);
    
})


const cardtoHTML = (card, value, suit, i) => {
    return `<div class= "card"> 
    <p class= "js-card-info-top card-info hidden">${value} ${suit}</p>
 <img src= ${card} data-index= ${i}></p>
 <p class= "js-card-info-bottom card-info">${value} ${suit}</p>
 </div>`;
}

//------Render--------

const render = state => {

    if (state.start === false) {
        drawButton.classList.add('hidden');
        newDeckButton.classList.add('center-button');
        deckInfoContainer.classList.add('hidden');

    }
    else if (state.start === true) {
        drawButton.classList.remove('hidden');
        newDeckButton.classList.remove('center-button');
        deckInfoContainer.classList.remove('hidden');
    }
    
    let cardsDrawnToHTML = '';
    for (let i = 0; i < state.cards.length; i++) {

        cardsDrawnToHTML += cardtoHTML(state.cards[i].image, state.cards[i].value, state.cards[i].suit, i);
     
    }
    cardContainer.innerHTML = cardsDrawnToHTML;

    // if (state.infoBottom = false){
    //     cardInfoTop.classList.remove('hidden');
    //     cardInfoBottom.classList.add('hidden');
    // }

}

const stored_state = storage.getStorage();
if (stored_state) {

    state = stored_state;
}
storage.save(state)
render(state);