import values from 'lodash/values';

class Database {
  constructor() {
    this.pages = {};
  }

  addPage(page) {
    this.pages[page.id] = page;
  }

  updatePhoto(id, photo) {
    if (!this.pages[id]) {
      throw new Error(`${id} not found`);
    }
    this.pages[id].screenImg = photo;
  }

  search(text) {
    return values(this.pages).slice(0, 6);
    // return [
    //   {
    //     id: 0,
    //     screenImg: '',
    //     favicon: '',
    //     title: '',
    //     url: '',
    //     label: [
    //       {
    //         id: 0,
    //         text: '',
    //         color: ''
    //         // colorId: '',
    //       }
    //     ],
    //     score: 0,
    //     highlights: [
    //       {
    //         type: 'TITLE', // LABEL, URL, OTHER
    //         start: 0,
    //         end: 0,
    //         text: '',
    //         labelId: 0
    //       }
    //     ]
    //   }
    // ];
  }
}

export const database = new Database();
