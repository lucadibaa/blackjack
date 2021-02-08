//let & const
let bjGame = {                                                                              //crea un array contenente dei valori, in modo da rendere più veloce ri-utilizzarli
    'you': {'scoreSpan': '#your-bj-score', 'div': '#you', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-bj-score', 'div': '#dealer', 'score': 0},
    'cards': ['2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', '10C', '10D', '10H', '10S', 'JC', 'JD', 'JH', 'JS', 'QC', 'QD', 'QH', 'QS', 'KC', 'KD', 'KH', 'KS', 'AC', 'AD', 'AH', 'AS'],
    'cardsValue': {'2C': 2, '2D': 2, '2H': 2, '2S': 2, '3C': 3, '3D': 3, '3H': 3, '3S': 3, '4C': 4, '4D': 4, '4H': 4, '4S': 4, '5C': 5, '5D': 5, '5H': 5, '5S': 5, '6C': 6, '6D': 6, '6H': 6, '6S': 6, '7C': 7, '7D': 7, '7H': 7, '7S': 7, '8C': 8, '8D': 8, '8H': 8, '8S': 8, '9C': 9, '9D': 9, '9H': 9, '9S': 9, '10C': 10, '10D': 10, '10H': 10, '10S': 10, 'JC': 10, 'JD': 10, 'JH': 10, 'JS': 10, 'QC': 10, 'QD': 10, 'QH': 10, 'QS': 10, 'KC': 10, 'KD': 10, 'KH': 10, 'KS': 10, 'AC': [1, 11], 'AD': [1, 11], 'AH': [1, 11], 'AS': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false
};

const hitSound = new Audio('sounds/swish.m4a');                                             //define sounds
const winSound = new Audio('sounds/cash.mp3');
const lostSound = new Audio('sounds/aww.mp3');

const YOU = bjGame['you'];
const DEALER = bjGame['dealer'];

//showCard function
function showCard(card, activePlayer) {
    if ( activePlayer['score'] <= 21 ) {
        let cardImage = document.createElement('img');
    cardImage.src = `images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
    }
}

//Hit Button
document.querySelector('#hit').addEventListener('click', blackjackHit);

function blackjackHit() {
    if ( bjGame['isStand'] === false ) {
    let card = randomCard();
    showCard(card, YOU);
    //console.log(card);
    updateScore(card, YOU);
    showScore(YOU);
    }
}

//Deal Button
document.querySelector('#deal').addEventListener('click', blackjackDeal);

function blackjackDeal() {
    /*computeWinner();
    showResult(computeWinner());*/ //remove comment for multiplayer
    if ( bjGame['isStand'] && bjGame['turnsOver'] ) {

        bjGame['isStand'] = false; 
        let yourCards = document.querySelector('#you').querySelectorAll('img');
        let dealerCards = document.querySelector('#dealer').querySelectorAll('img');

        for ( i = 0; i < yourCards.length; i++) {
            yourCards[i].remove();
        }
        for ( i = 0; i < dealerCards.length; i++) {
            dealerCards[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;
        
        document.querySelector('#your-bj-score').textContent = 0;
        document.querySelector('#dealer-bj-score').textContent = 0;
        
        document.querySelector('#your-bj-score').style.color = '#000';
        document.querySelector('#dealer-bj-score').style.color = '#000';

        document.querySelector('#bj-result').textContent = "Let's play";
        document.querySelector('#bj-result').style.color = '#000';

        bjGame['turnsOver'] = true;
    }
}

//Pick a Random Card from the Deck
function randomCard() {
    let card = Math.floor(Math.random() * 52);
    return bjGame['cards'][card];                                                                   //this returns the card in the array that is in position 'card'(Math.random)
}

//Update and Show Score
function updateScore(card, activePlayer) {
    //Ace Value
    if ( card === 'AC' || card === 'AD' || card === 'AH' || card === 'AS') {
        if ( activePlayer['score'] + bjGame['cardsValue'][card][1] <= 21 ) {
            activePlayer['score'] += bjGame['cardsValue'][card][1];
        }   else {
            activePlayer['score'] += bjGame['cardsValue'][card][0];
        }
    } else {
        activePlayer['score'] += bjGame['cardsValue'][card];
    }
}

function showScore(activePlayer) {
    if ( activePlayer['score'] > 21 ) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust!';
        document.querySelector(activePlayer['scoreSpan']).style.color = '#ff1a1a';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

//Dealer Logic (Stand Button)
document.querySelector('#stand').addEventListener('click', dealerLogic);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    bjGame['isStand'] = true;

    while ( DEALER['score'] < 15 && bjGame['isStand'] === true ) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    bjGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

//Who's the Winner? && Wins, Losses and Draws
function computeWinner() {
    let winner;
    if ( YOU['score'] <= 21 ) {
        //You have an higher score or the Dealer busted while you haven't
        if ( YOU['score'] > DEALER['score'] || (DEALER['score'] > 21) ) {
            winner = YOU;
            bjGame['wins']++;
        //The dealer has an higher score
        } else if ( YOU['score'] < DEALER['score'] ) {
            winner = DEALER;
            bjGame['losses']++;
        //You and the Dealer have the same score
        } else if ( YOU['score'] === DEALER['score'] ) {
            bjGame['draws']++;
        }
    //You busted and Dealer haven't
    } else if ( YOU['score'] > 21 && DEALER['score'] <= 21 ) {
        winner = DEALER;
        bjGame['losses']++;
    //You and Dealer busted
    } else if ( YOU['score'] > 21 && DEALER['score'] > 21 ) {
        bjGame['draws']++;
    }
    console.log('The Winner is ', winner);
    return winner;
}

//Show Result
function showResult(winner) {
    let message, messageColor;


    if ( bjGame['turnsOver']) {
        if ( winner === YOU ) {
            document.querySelector('#wins').textContent = bjGame['wins'];
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();

        } else if ( winner === DEALER ) {
            document.querySelector('#losses').textContent = bjGame['losses'];
            message = 'You Lost!';
            messageColor = '#ff1a1a';
            lostSound.play();

        } else {
            document.querySelector('#draws').textContent = bjGame['draws'];
            message = "It's a Draw!";
            messageColor = '#000';
        }

        document.querySelector('#bj-result').textContent = message;
        document.querySelector('#bj-result').style.color = messageColor;
    }
}