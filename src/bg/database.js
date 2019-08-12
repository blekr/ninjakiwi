class Database {
  add() {}

  search(text) {
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
            color: ''
            // colorId: '',
          }
        ],
        score: 0,
        highlights: [
          {
            type: 'TITLE', // LABEL, URL, OTHER
            start: 0,
            end: 0,
            text: '',
            labelId: 0
          }
        ]
      }
    ];
  }
}

export const database = new Database();
