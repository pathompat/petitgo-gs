// Constant 
const boardMember = [
  {
      "id": "61dd75fccca3d52612a23e30",
      "fullName": "Jirayu timanon",
      "username": "jirayutimanon"
  },
  {
      "id": "65bf66515112179a68546041",
      "fullName": "Supakan Prasopkaew",
      "username": "ployskn"
  },
  {
      "id": "5b9a30bd95201128b5a85390",
      "fullName": "Pathompat Sungpankhao",
      "username": "pathompat"
  },
  {
      "id": "61ddb1081e50e18e4b3a0b2d",
      "fullName": "Tuck Phanupong",
      "username": "tuckphanupong"
  },
  {
      "id": "5d3011e4b86e930c91b3e058",
      "fullName": "Nattapong Vinyunuluk",
      "username": "jobnattapong"
  }
]

const boardList = [
  {
      "id": "61dd41de595e175aa2535f05",
      "name": "BACKLOG 🤔"
  },
  {
      "id": "61dd41de595e175aa2535f06",
      "name": "TODO 📚"
  },
  {
      "id": "61dd41de595e175aa2535f07",
      "name": "DOING ⚙️"
  },
  {
      "id": "61e12ce60916ae43c7ba1c67",
      "name": "IN REVIEW 📖"
  },
  {
      "id": "61dd41de595e175aa2535f08",
      "name": "DONE! 🙌🏽"
  },
  {
      "id": "61f69e72ebb7e720e852f6c2",
      "name": "CENTRE"
  },
  {
      "id": "624bd10d5bc51f3c9a6a81d0",
      "name": "DASHBOARD"
  }
]

const point = {
  'Issues': 3,
  'Urgent': 3,
  'Medium': 2,
  'Low': 1
}

// =========================================================
// Get all card & detail from trello
// =========================================================

function callApiGetTrelloCard () {
  // Call trello card api
  var response = UrlFetchApp.fetch("https://api.trello.com/1/boards/61dd41de595e175aa2535f04/cards/all?key=" + TRELLO_API_KEY);

  // Parse the JSON reply
  var json = response.getContentText();
  var data = JSON.parse(json);

  Logger.log(response.getContentText());

  return data
}

// =========================================================
// Convert api card information for show on sheet
// =========================================================

function displayTrelloCard () {
  
  // call api and prepare colummn
  const response = callApiGetTrelloCard()
  var column = ['ID', 'Name', 'Label', 'Member', 'List', 'Comment', 'Progress', 'Due date', 'Close', 'Point', 'Link']
  
  return [
    column,
    ...response.filter(card => card.idMembers.length > 0).map((card) => {
      const detail = card.badges
      const label = card.labels.map(label => label.name).join(',')
      const dueDate = detail.due ? new Date(detail.due) : null
      const members = boardMember.filter(member => card.idMembers.includes(member.id)).map(member => member.fullName).join(',')
      const cardPriority = card.labels.find(label => ['Issues','Urgent','Medium','Low'].includes(label.name))?.name
      const currentList = boardList.find(list => list.id === card.idList)?.name
      const progress = detail.checkItems > 0 ? detail.checkItemsChecked / detail.checkItems : (currentList === "DONE! 🙌🏽" ? 1 : 0)

      return [
        card.idShort, card.name, label, members, currentList, detail.comments, 
        progress, dueDate, card.closed, point[cardPriority] || 1, card.shortUrl
      ]
    })
  ]
}