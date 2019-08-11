

class Database {
  add() {

  }
  search(key) {
    return [
      {
        id: 0,
        screenImg: '',
        favicon: '',
        title: '',
        url: '',
        label: [
          {
            id: 0,
            text: '',
            colorId: '',
          }
        ],
        score: 0,
        highlights: [
          {
            type: 'TITLE', // LABEL, URL, OTHER
            start: 0,
            end: 0,
            text: '',
            labelId: 0,
          }
        ]
      }
    ]
  }
}

export const database = new Database();
