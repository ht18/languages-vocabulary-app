/* eslint-disable no-undef */

// Déclaration des variables

const endpoint = "https://ht18.github.io/languages-vocabulary-app//data.json";
const limitItems = 30;
let data = [];
let sortData = [];
let selectedWords = [];
let level = "A1-A2";
let language = "english";
let isList = true;
let search = "";
let isSelectedWord = false;
const noData = [
  {
    id: "",
    word: "",
    translation: "",
    pronunciation: "",
    language: "",
    note: "",
    level: "",
  },
];

async function fetchApi(url) {
  const response = await fetch(url);
  const result = await response.json();
  data = result;
  return result;
}

(async function app() {
  await fetchApi(endpoint);
  const englishData = data.filter((elt) => elt.language === "english");
  const russianData = data.filter((elt) => elt.language === "russian");
  const hebrewData = data.filter((elt) => elt.language === "hebrew");
  const japaneseData = data.filter((elt) => elt.language === "japanese");

  const h1 = document.querySelector("h1");
  const find = document.querySelector(".find");
  const solution = document.getElementById("solution");
  const btnSolution = document.getElementById("btnSolution");
  const btnNext = document.getElementById("btnNext");
  const btnPronunciation = document.getElementById("btnPronunciation");
  const btnEnglish = document.getElementById("btnEnglish");
  const btnRussian = document.getElementById("btnRussian");
  const btnHebrew = document.getElementById("btnHebrew");
  const btnJapanese = document.getElementById("btnJapanese");
  const pronunciationDiv = document.querySelector("#pronunciation");
  const cardDiv = document.querySelector("#cardDiv");
  const listDiv = document.querySelector("#listDiv");
  const btnList = document.querySelector("#btnList");
  const btnCard = document.querySelector("#btnCard");
  const table = document.getElementById("table");
  const findDiv = document.getElementById("findDiv");
  const noteDiv = document.getElementById("noteDiv");
  const level0 = document.getElementById("level0");
  const level1 = document.getElementById("level1");
  const level2 = document.getElementById("level2");
  const level3 = document.getElementById("level3");
  const level4 = document.getElementById("level4");
  const searchInput = document.getElementById("search");
  const switchSelectedWords = document.getElementById("selectedWord");
  const nbrItems = document.getElementById("nbrItems");

  function setData(la, le, s) {
    if (isSelectedWord) {
      sortData = selectedWords;
    } else {
      switch (la) {
        case "english":
          data = englishData;
          break;
        case "russian":
          data = russianData;
          break;
        case "hebrew":
          data = hebrewData;
          break;
        case "japanese":
          data = japaneseData;
          break;
        default:
          data = noData;
      }
      if (search !== "") {
        sortData = data.filter(
          (word) =>
            word.word.toLowerCase().includes(s) ||
            (word.translation.toLowerCase().includes(s) && word.level === le)
        );
      } else if (le) {
        sortData = data.filter((word) => word.level === le);
      } else {
        sortData = noData;
      }
      sortData = sortData.length ? sortData : noData;
    }
  }

  function getBtnPlus() {
    const btnPlus = document.querySelectorAll(".btnPlus");
    return btnPlus;
  }

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function getRandomData(arr) {
    const randomBoolean = Math.random() < 0.5;
    const rndInt = randomIntFromInterval(0, arr.length - 1);
    const { word } = arr[rndInt];
    const { translation } = arr[rndInt];
    const { pronunciation } = arr[rndInt];
    const { note } = arr[rndInt];
    noteDiv.innerHTML = note;
    noteDiv.style.fontSize = "small";
    pronunciationDiv.innerHTML = pronunciation;
    if (randomBoolean === true) {
      find.innerHTML = word;
      solution.innerHTML = translation;
    } else {
      find.innerHTML = translation;
      solution.innerHTML = word;
    }
  }

  function btnPlusClick(e) {
    const noteRows = document.querySelectorAll(".noteRow");
    const tr = document.getElementsByTagName("tr");
    const btnId = e.target.id;
    const id = btnId.replace("btn_", "");

    for (let i = 1; i < tr.length; i++) {
      tr[i].style.fontSize = "small";
      tr[i].style.fontWeight = "normal";
    }

    if (noteRows) {
      noteRows.forEach((elt) => elt.remove());
    }

    previousNoteOpen = `note_${id}`;
    const { rowId } = e.target.dataset;
    const noteToInsert = tr[parseInt(rowId, 10) + 1].dataset.note;
    const pronunciationToInsert =
      tr[parseInt(rowId, 10) + 1].dataset.pronunciation;
    const rowNote = table.insertRow(parseInt(rowId, 10) + 2);
    rowNote.className = "noteRow";

    const noteDesc = rowNote.insertCell(0);
    noteDesc.colSpan = "4";
    noteDesc.style.fontSize = "small";
    noteDesc.id = `note_${id}`;

    if (pronunciationToInsert !== "") {
      noteDesc.innerHTML = `Prononciation :  <i>${pronunciationToInsert}</i><br>`;
    }
    if (noteToInsert !== "") {
      noteDesc.insertAdjacentHTML("beforeend", `Note : <i>${noteToInsert}</i>`);
    }

    tr[parseInt(rowId, 10) + 1].style.fontWeight = "bold";
    tr[parseInt(rowId, 10) + 1].style.fontSize = "medium";
  }

  function changeInputVisibility() {
    if (isList) {
      searchInput.style.visibility = "visible";
    } else {
      searchInput.style.visibility = "hidden";
    }
  }

  function recheckWords() {
    selectedWords.forEach((word) => {
      const radioSelected = document.getElementById(`radioSelected_${word.id}`);
      radioSelected.checked = true;
    });
  }

  function addOrRemoveWordToList(e, elt) {
    if (e.target.checked && !selectedWords.includes(elt)) {
      selectedWords.push(elt);
    }
    if (!e.target.checked && selectedWords.includes(elt)) {
      selectedWords = selectedWords.filter((word) => word !== elt);
    }
    nbrItems.innerHTML = selectedWords.length.toString();
  }

  function changeToList() {
    isList = true;
    setData(language, level, search);
    changeInputVisibility();
    listDiv.style.display = "inherit";
    cardDiv.style.display = "none";
    findDiv.style.visibility = "hidden";
    const rows = document.querySelectorAll("table tr");

    for (row of rows) {
      if (row.id !== "legend") {
        row.remove();
      }
    }

    sortData.forEach((element, index) => {
      const row = table.insertRow(-1);
      const selectedWord = row.insertCell(0);
      const word = row.insertCell(1);
      const translation = row.insertCell(2);
      const note = row.insertCell(3);

      row.dataset.note = element.note ? element.note : "";
      row.dataset.pronunciation = element.pronunciation
        ? element.pronunciation
        : "";
      selectedWord.innerHTML = `<input id="radioSelected_${element.id}" class="radioSelected" type="checkbox" />`;
      word.innerHTML = element.word;
      row.style.fontSize = "small";
      translation.innerHTML = element.translation;

      if (element.pronunciation !== "" || !typeof element.note) {
        note.innerHTML = `<button data-row-id=${index} id="btn_${element.id}" class="btnPlus">+</button>`;
      }

      const radio = document.querySelector(`#radioSelected_${element.id}`);
      radio.addEventListener("change", (e) =>
        addOrRemoveWordToList(e, element)
      );
    });

    const btnPlus = getBtnPlus();

    for (let i = 0; i < btnPlus.length; i++) {
      btnPlus[i].addEventListener("click", btnPlusClick);
    }
    recheckWords();
  }

  function distribute() {
    getRandomData(sortData);
    btnNext.addEventListener("click", getRandomData(sortData));
  }

  function nextData() {
    getRandomData(sortData);
    solution.style.visibility = "hidden";
    pronunciationDiv.style.visibility = "hidden";
    noteDiv.style.visibility = "hidden";
  }

  function changeToCard() {
    search = "";
    searchInput.value = search;
    setData(language, level, search);
    cardDiv.style.display = "inherit";
    listDiv.style.display = "none";
    findDiv.style.visibility = "visible";
    isList = false;
    changeInputVisibility();
    distribute(sortData);
    nextData();
  }

  function switchToSelectedWords(e) {
    if (e.target.checked) {
      isSelectedWord = true;
      if (isList) {
        changeToList();
      } else {
        changeToCard();
      }
    } else {
      isSelectedWord = false;
      if (isList) {
        changeToList();
      } else {
        changeToCard();
      }
    }
    if (isSelectedWord) {
      nbrItems.style.backgroundColor = "#2196F3";
    } else {
      nbrItems.style.backgroundColor = "lightgray";
    }
  }

  function searchWord(e) {
    value = e.target.value;
    search = value.toLowerCase();
    setData(language, level, search);
    changeToList();
  }

  function changeLevel(e) {
    isSelectedWord = false;
    level = e.target.value;
    setData(language, level, search);
    if (isList) {
      changeToList();
    } else {
      changeToCard();
    }
  }

  function changeLanguage(d, la, langu) {
    selectedWords = [];
    language = langu;
    h1.innerHTML = la;
    document.title = la;
    solution.style.visibility = "hidden";
    if (isList) {
      changeToList();
    } else {
      changeToCard();
    }
  }

  function seePronunciation() {
    pronunciationDiv.style.visibility = "visible";
  }

  function changeVisibility() {
    solution.style.visibility = "visible";
    noteDiv.style.visibility = "visible";
  }

  // Déclaration des events listener
  btnSolution.addEventListener("click", changeVisibility);
  btnList.addEventListener("click", changeToList);
  btnNext.addEventListener("click", nextData);
  btnPronunciation.addEventListener("click", seePronunciation);
  btnEnglish.addEventListener("click", () => {
    changeLanguage(englishData, "English", "english", "English Words");
  });
  btnRussian.addEventListener("click", () => {
    changeLanguage(russianData, "Русский", "russian", "Russian Words");
  });
  btnHebrew.addEventListener("click", () => {
    changeLanguage(hebrewData, "עִברִית", "hebrew", "Hebrew Words");
  });
  btnJapanese.addEventListener("click", () => {
    changeLanguage(japaneseData, "日本語", "japanese", "Japanese Words");
  });
  btnCard.addEventListener("click", changeToCard);
  level0.addEventListener("click", changeLevel);
  level1.addEventListener("click", changeLevel);
  level2.addEventListener("click", changeLevel);
  level3.addEventListener("click", changeLevel);
  level4.addEventListener("click", changeLevel);
  searchInput.addEventListener("input", searchWord);
  switchSelectedWords.addEventListener("change", switchToSelectedWords);

  setData(language, level, search);
  changeToList();
  getBtnPlus();
})();
