import parseTagsString from '../src-backend/lib/parseTagsString';

describe('helper functions', () => {
  it('parseTagsString', () => {
    const tagString = 'tag1,tag2   ,tag3, ';
    const expectedTags = ['tag1', 'tag2', 'tag3'];
    const tags = parseTagsString(tagString);
    expect(tags).toEqual(expectedTags);
  });
});
