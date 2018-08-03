/**
 * @jest-environment node
 */

import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

jest.setMock('react-dom', {
  createPortal: children => <>{children}</>,
});

describe('HeadProvider', () => {
  const { HeadProvider, HeadTag } = require('../');

  it('adds HeadTags to given array from component tree', () => {
    const arr = [];
    renderToStaticMarkup(
      <HeadProvider headTags={arr}>
        <div>
          <HeadTag tag="tag1" name="name1" another="value1" />
          <HeadTag tag="tag2" test="test2" third="value2" />
        </div>
      </HeadProvider>
    );

    expect(arr.length).toBe(2);
    expect(arr).toMatchSnapshot();
  });
});
