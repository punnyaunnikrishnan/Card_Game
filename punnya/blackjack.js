let blackjackGame = {
    you: {
      scoreSpan: "#Player-Result",
      div: "#Player-Box",
      score: 0,
    },
    dealer: {
      scoreSpan: "#Dealer-Result",
      div: "#Dealer-box",
      score: 0,
    },
    cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
    cardMap: {
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      J: 10,
      Q: 10,
      K: 10,
      A: [1, 11],
    },
    suites: ["♠", "♦", "♣", "♥"],
    wins: 0,
    losses: 0,
    draws: 0,
    isStand: false,
    turnsOver: false,
  };
  
  const YOU = blackjackGame["you"];
  const DEALER = blackjackGame["dealer"];
  
  document.querySelector("#hitButton").addEventListener("click", blackjackHit);
  
  document.querySelector("#standButton").addEventListener("click", dealerLogic);
  
  document.querySelector("#dealButton").addEventListener("click", blackjackDeal);
  
  function blackjackHit() {
    if (blackjackGame["isStand"] === false) {
      let card = randomCard();
      showCard(card, YOU);
      updateScore(card, YOU);
      showScore(YOU);
    }
  }
  
  function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame["cards"][randomIndex];
  }
  
  function showCard(card, activePlayer) {
    //function to display card on webpage
    if (activePlayer["score"] <= 21) {
      let cardImage = document.createElement("div");
      let randomIndexSuit = Math.floor(Math.random() * 4);
      let singleSuit = blackjackGame["suites"][randomIndexSuit];
      cardImage.className = "card";
      let objkeys = Object.keys(blackjackGame["cardMap"]);
      for (let i = 0; i < objkeys.length; i++) {
        if (objkeys[i] == card) {
          if(randomIndexSuit===1 || randomIndexSuit===3){
            cardImage.innerHTML=
            card + `<div id=suites style="color:red"> ${singleSuit}</div>`;
          cardImage.style.color="red";
          }else{

            cardImage.innerHTML =
              card + `<div id=suites style="color:black"> ${singleSuit}</div>`;
              cardImage.style.color="black";
          }
        }
      }
  
      document.querySelector(activePlayer["div"]).appendChild(cardImage);
    }
  }
  
  function blackjackDeal() {
    // function to start next set of the game (resets everthing except points)
    if (blackjackGame["turnsOver"] === true) {
      blackjackGame["isStand"] = false;
  
      let yourImages = document
        .querySelector("#Player-Box")
        .querySelectorAll("div");
      let dealerImages = document
        .querySelector("#Dealer-box")
        .querySelectorAll("div");
  
      for (var i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
      }
  
      for (var i = 0; i < dealerImages.length; i++) {
        dealerImages[i].remove();
      }
  
      YOU["score"] = 0;
      DEALER["score"] = 0;
  
      document.querySelector("#Player-Result").textContent = 0;
      document.querySelector("#Dealer-Result").textContent = 0;
  
      document.querySelector("#Player-Result").style.color = "#ffffff";
      document.querySelector("#Dealer-Result").style.color = "#ffffff";
  
      document.querySelector("#result").textContent = "Let's play!";
      document.querySelector("#result").style.color = "black";
  
      blackjackGame["turnsOver"] = false;
    }
  }
  
  function updateScore(card, activePlayer) {
    // function to add the score of cards displayed.
    // If adding 11 keeps me below 21 then add 11. Otherwise, add 1.
    if (card === "A") {
      if (activePlayer["score"] + blackjackGame["cardMap"][card][1] <= 21) {
        activePlayer["score"] += blackjackGame["cardMap"][card][1];
      } else {
        activePlayer["score"] += blackjackGame["cardMap"][card][0];
      }
    } else {
      activePlayer["score"] += blackjackGame["cardMap"][card];
    }
  }
  
  function showScore(activePlayer) {
    // function to display the score
    if (activePlayer["score"] > 21) {
      document.querySelector(activePlayer["scoreSpan"]).textContent = "Ooops..!";
      document.querySelector(activePlayer["scoreSpan"]).style.color = "darkred";
    } else {
      document.querySelector(activePlayer["scoreSpan"]).textContent =
        activePlayer["score"];
    }
  }
  
  function sleep(ms) {
    // function for setting the timer of dealer game
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  async function dealerLogic() {
    // function for the dealer game
    blackjackGame["isStand"] = true;
  
    while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
      let card = randomCard();
      showCard(card, DEALER);
      updateScore(card, DEALER);
      showScore(DEALER);
      await sleep(800);
    }
    // BOT LOGIC: Automate such that it shows cards untill score > 15
    blackjackGame["turnsOver"] = true;
    showResult(computeWinner());
  }
  // compute winner
  // Update wins, losses, and draws
  function computeWinner() {
    // display points after each game
    let winner;
  
    if (YOU["score"] <= 21) {
      if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
        blackjackGame["wins"]++;
        winner = YOU;
      } else if (YOU["score"] < DEALER["score"]) {
        blackjackGame["losses"]++;
        winner = DEALER;
      } else if (YOU["score"] === DEALER["score"]) {
        blackjackGame["draws"]++;
      }
    } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
      blackjackGame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
      blackjackGame["draws"]++;
    }
  
    return winner;
  }
  
  function showResult(winner) {
    // display the result of Game
    let message, messageColor;
  
    if (blackjackGame["turnsOver"] === true) {
      if (winner === YOU) {
        document.querySelector("#wins").textContent = blackjackGame["wins"];
        message = "You won..!";
        messageColor = "darkblue";
      } else if (winner === DEALER) {
        document.querySelector("#losses").textContent = blackjackGame["losses"];
        message = "You lost..!";
        messageColor = "brown";
      } else {
        document.querySelector("#draws").textContent = blackjackGame["draws"];
        message = "Its a draw..!";
        messageColor = "darkgreen";
      }
  
      document.querySelector("#result").textContent = message;
      document.querySelector("#result").style.color = messageColor;
    }
  }
  let alertOnce = false;
  let limitFunc = function () {
    // function to alert rotate device when the webpage is opened in smaller devices
    if (window.innerWidth <= 1000 && alertOnce === false) {
      alert("Rotate Device.");
      alertOnce = true;
    }
  };
  
  window.addEventListener("resize", limitFunc);
  window.addEventListener("onload", limitFunc);