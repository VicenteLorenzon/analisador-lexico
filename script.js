let Tokens = [];
let currentIndex = 0;
let currentCellContent = "";
let automatonStates = [];

function wordChange(value) {
  if (value.trim().length > 0 && automatonStates.length > 0) {
    const letter = value[value.length - 1].toLowerCase();
    const state = automatonStates[currentIndex];
    const index = letter.charCodeAt() - 97;

    if (index >= 0) {
      const nextIndex = state[letter];

      if (nextIndex) {
        resetAutomatonStates();
        currentCellContent = `td${currentIndex}.${index}`;
        setRowClassById(`tr${currentIndex}`, "row");

        

        if (currentIndex >= 0) {
          const rowId = `tr${currentIndex}`;
          setRowClassById(rowId, "rowHighlight");
          handleCellClassModification("add", currentCellContent, "cellHighlight");
        }
      }
      
      currentIndex = nextIndex === -1 ? 0 : nextIndex;
    } else if (index === -65) {
      if (currentCellContent.trim().length > 0) {
        handleCellClassModification("remove", currentCellContent, "cellHighlight");
      }

      if (!state["&"]) {
      } else {
        setRowClassById(`tr${currentIndex}`, "row");
        currentIndex = 0;
        currentCellContent = "";
      }
    }
  } else {
    if (value.trim().length === 0 || automatonStates.length === 0) {
      resetAutomatonStates();
      currentCellContent = "";
      currentIndex = 0;
    }
  }
}

document.getElementById("inputPalavra").onkeydown = function (event) {
  const key = event.keyCode || event.charCode;

  if (key === 32) {
    const inputToken = document.getElementById("inputPalavra").value.trim();

    if (inputToken.length > 0) {
      const TokenFound = Tokens.includes(inputToken);

      if (TokenFound) {
        alert('Token reconhecido');
      } else {
        alert('Token não reconhecido');
      }

      clearInput();
      populateTokenList();
    }

    event.preventDefault();

    resetAutomatonStates();
    currentCellContent = "";
    currentIndex = 0;
  }
};

function clearInput() {
  document.getElementById("inputToken").value = "";
  document.getElementById("inputPalavra").value = "";
}

function createAutomatonTableHeader() {
  const header = tableAutomato.createTHead();
  const tableRow = header.insertRow(-1);

  for (let i = 0; i < 27; i++) {
    const cellHeader = document.createElement("th");
    cellHeader.className = "TokenHeader";

    if (i === 0) {
      cellHeader.innerHTML = " ";
    } else {
      cellHeader.innerHTML = String.fromCharCode(96 + i);
    }

    tableRow.appendChild(cellHeader);
  }
}

function createAutomatonTableBody() {
  for (let i = 0; i < automatonStates.length; i++) {
    const state = automatonStates[i];
    const row = tableAutomato.insertRow(-1);

    row.id = `tr${i}`;
    row.className = "row";

    const tableCell = row.insertCell(-1);

    if (state.hasOwnProperty("&")) {
      tableCell.innerHTML = `*q${i}`;
    } else {
      tableCell.innerHTML = `q${i}`;
    }

    for (let j = 0; j < 26; j++) {
      const tableCell = row.insertCell(-1);
      tableCell.innerHTML = "-";

      const key = String.fromCharCode(97 + j);

      if (state.hasOwnProperty(key)) {
        const value = state[key];

        if (value) {
          tableCell.innerHTML = `q${value}`;
        }
      }

      tableCell.id = `td${i}.${j}`;
    }
  }
}

function populateTokenList() {
  const TokenListDiv = document.getElementById("divTokens");

  while (TokenListDiv.hasChildNodes()) {
    TokenListDiv.removeChild(TokenListDiv.lastChild);
  }

  document.getElementById("inputPalavra").className = "inputText black";
  automatonStates = [];

  if (Tokens.length > 0) {
    automatonStates[0] = {};
    for (const Token of Tokens) {
      addTokenToList(Token, TokenListDiv);
      const statesValue = createTokenAutomaton(Token);
      automatonStates = insertAutomatonIntoList(statesValue, automatonStates);
    }
  }

  createAutomatonTable();
}

function createTokenAutomaton(Token) {
  const statesValue = new Array(Token.length);

  for (let i = 0; i < Token.length; i++) {
    const letter = Token[i].toLowerCase();
    statesValue[i] = {};
    statesValue[i][letter] = i + 1;

    if (i === Token.length - 1) {
      statesValue[i + 1] = { "&": 0 };
    }
  }

  return statesValue;
}

function createAutomatonTable() {
  const automatonTable = document.getElementById("tableAutomato");

  while (automatonTable.hasChildNodes()) {
    automatonTable.removeChild(automatonTable.lastChild);
  }

  createAutomatonTableHeader();
  createAutomatonTableBody();
}

function insertAutomatonIntoList(statesValue, states) {
  let indexLetter = 0;

  for (let i = 0; i < statesValue.length; i++) {
    const key = Object.keys(statesValue[i])[0];
    const last = i === statesValue.length - 1;

    if (states[indexLetter] && states[indexLetter].hasOwnProperty(key)) {
      indexLetter = states[indexLetter][key];
    } else {
      if (last) {
        states[indexLetter][key] = -1;
      } else {
        states[indexLetter][key] = states.length;
        indexLetter = states.length;
        states[indexLetter] = {};
      }
    }
  }

  return states;
}

function addTokenToTokenList(value) {
  Tokens.push(value);
  populateTokenList();
  clearInput();
}

function addTokenToList(Token, TokenListDiv) {
  const TokenButton = document.createElement("BUTTON");
  TokenButton.className = "btn";
  TokenButton.innerHTML = Token;

  TokenButton.addEventListener("click", function () {
    Tokens.splice(Tokens.indexOf(Token), 1);
    clearInput();
    populateTokenList();
  });

  TokenListDiv.appendChild(TokenButton);
}

function resetAutomatonStates() {
  const automatonTable = document.getElementById("tableAutomato");

  for (const row of automatonTable.rows) {
    if (row.rowIndex > 0) {
      row.className = "row";

      for (const cell of row.cells) {
        cell.className = "";
      }
    }
  }
}

function setRowClassById(id, className) {
  document.getElementById(id).className = className;
}

function handleCellClassModification(action, id, className) {
  const element = document.getElementById(id);

  if (action === "add") {
    element.classList.add(className);
  } else if (action === "remove") {
    element.classList.remove(className);
  }
}

populateTokenList();
