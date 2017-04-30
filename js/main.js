(function() {
    console.clear();
    "use strict";

    const HangmanModule = function() {

        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let allGuesses = [];
        let currAnswer = null;
        let currentWord = "";
        let guessArray = [];
        let turns = 10;
        let resets = 0;

        let turnContainer = document.querySelector(".turns");
        let myAlphabet = document.getElementById('letter-container');
        let wordContainer = document.getElementById('word-container');
        let resetButton = document.querySelector('.reset');


        function alphabetSetup() {
            letters = document.createElement('ul');

            for (let i = 0; i < alphabet.length; i++) {
                list = document.createElement('li');
                list.classList.add('alphabet');

                list.innerHTML = alphabet[i];
                myAlphabet.appendChild(letters);
                letters.appendChild(list);
                list.addEventListener("click", () => {
                    let guess = (alphabet[i]);
                    event.target.style.backgroundColor = '#7aa7b9';
                    event.target.style.color = '#608c9e';

                    evalGuess(guess);
                });
            }
        } //end alphabetSetup

        function getWord() {
            let http = new XMLHttpRequest();
            http.onreadystatechange = function() {
                if (http.readyState === 4 && http.status === 200) {
                    const data = JSON.parse(http.response);
                    wordSetup(data);
                }
            };
            http.open('GET', './data/words.json', true);
            http.send();

            return {
                getWord: getWord
            };
        } //end getWord

        function wordSetup(wordData) {
            while (currentWord.length < 3) {
                currentWord = (wordData[Math.floor(Math.random() * wordData.length)]).content;
            }
            console.log('currentWord: You didnt think Id actually put the word here, did you?');
            for (let i = 0; i < currentWord.length; i++) {
                guessArray[i] = '_';
            }
            wordContainer.innerHTML = guessArray.join(" ");
        } //end wordSetup

        function evalGuess(currentGuess) {
            let match = 0;
            let indexMatches = [];
            let i = 0;
            currentGuess = currentGuess.toLowerCase();

            while ((match = currentWord.indexOf(currentGuess, i)) > -1) {
                indexMatches.push(match);
                i = match + 1;

                for (j = 0; j <= indexMatches.length; j++) {
                    guessArray[indexMatches] = currentGuess;
                    wordContainer.innerHTML = guessArray.join(" ");
                    indexMatches.shift();
                }
            }
            if (currentWord.indexOf(currentGuess) < 0) {
                turns--;
                turnsCounter(turns);
            }
            if (guessArray.join('') === currentWord) {
                win();
            }
        } //end evalGuess

        function win() {
            turnContainer.textContent = 'WIN - WIN - WIN - WIN - WIN';
            turnContainer.style.color = 'white';
            resetBtn();
        } //end win

        function turnsCounter(turns) {
            turnContainer.innerHTML = `You have ${turns} turns.`;
            turnContainer.style.padding = '10px 0';
            if (turns < 1) {
                turnContainer.innerHTML = "Game Over";
                resetBtn();
            }
        } //end turnsCounter

        function resetBtn() {
            resetButton.classList.add('reset-show');
            resetButton.addEventListener('click', () => {
                myAlphabet.removeChild(letters);
                letters.removeChild(list);
                location.reload();
                //I can't figure out how to get a new random word without
                //making a new httprequest so I used location.reload which
                //is highly unsatisfying....
            });
        }

        function init() {
            alphabetSetup();
            getWord();
            turnsCounter(10);
        }

        return {
            begin: init
        };
    }; //end Hangman

    const game = new HangmanModule();
    game.begin();

})(); //end iife
