import helper from '../src-backend/lib/helper';

describe('helper functions', () => {
  it('parseTagsString', () => {
    const tagString = 'tag1,tag2   ,tag3, ';
    const expectedTags = ['tag1', 'tag2', 'tag3'];
    const tags = helper.parseTagsString(tagString);
    expect(tags).toEqual(expectedTags);
  });
});
