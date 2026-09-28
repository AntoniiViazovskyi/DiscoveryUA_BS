import assert from 'node:assert/strict';
import test from 'node:test';

process.env.NODE_ENV = 'test';
process.env.MONGO_URL = 'mongodb://127.0.0.1:27017/test';

const { app } = await import('../server.js');
const { Location } = await import('../models/location.js');

test('GET /api/feedbacks returns paginated feedbacks for a location', async () => {
  const originalFindById = Location.findById;
  const locationId = '507f1f77bcf86cd799439011';
  const allFeedbacks = [
    { _id: '1', userName: 'Anna', rate: 5, description: 'Perfect stay', isApproved: true },
    { _id: '2', userName: 'Bohdan', rate: 4, description: 'Nice place', isApproved: false },
    { _id: '3', userName: 'Maria', rate: 5, description: 'Loved the view', isApproved: true },
    { _id: '4', userName: 'Oleh', rate: 3, description: 'Older feedback' },
    { _id: '5', userName: 'Iryna', rate: 5, description: 'Great location', isApproved: true },
  ];

  Location.findById = (id) => {
    assert.equal(id, locationId);

    return {
      populate: async () => ({
        _id: id,
        feedbacksId: allFeedbacks,
      }),
    };
  };

  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(
      `http://127.0.0.1:${port}/api/feedbacks?locationId=${locationId}&page=2&limit=2`,
    );

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.equal(body.page, 2);
    assert.equal(body.limit, 2);
    assert.equal(body.total, 3);
    assert.equal(body.totalPages, 2);
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].userName, 'Iryna');
  } finally {
    server.close();
    Location.findById = originalFindById;
  }
});
