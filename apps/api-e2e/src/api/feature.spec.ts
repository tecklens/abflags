import axios from 'axios';

describe('Feature controller (e2e)', () => {
  const user = {
    email: 'diep.tv1999@gmail.com',
    password: 'Cntt@3215',
  };


  it('GET /feature/all', async () => {
    const res = await axios.get(
      `http://localhost:3232/ab/v1/feature/all?page=0&limit=10`,
      {
        headers: {
          'api_key': '55a804e660e609e4d824948f48ad82e3'
        }
      }
    );

    expect(res.status).toBe(200);
    expect(res.data?.data).toBeDefined();
  });
});
