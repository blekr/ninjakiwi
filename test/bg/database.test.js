import { Database } from '../../src/bg/database';

describe('database', () => {
  test('buildRecent', () => {
    const database = new Database();
    database.pages = {
      a1: {
        id: 'a1',
        url: 'http://www.a.com/abc1'
      },
      a2: {
        id: 'a2',
        url: 'http://www.a.com/abc2'
      },
      b1: {
        id: 'b1',
        url: 'http://www.b.com/abc1'
      },
      b2: {
        id: 'b2',
        url: 'http://www.b.com/abc2'
      }
    }
    database.lastVisit = {
      a1: 100,
      a2: 101,
      b1: 200,
      b2: 201,
    };
    database.buildRecent();
    expect(database.recents[0].id).toBe('b2')
    expect(database.recents[0].time).toBe(201)
    expect(database.recents[1].id).toBe('a2')
    expect(database.recents[1].time).toBe(101)
  })
})
