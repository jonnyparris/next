import {
  getName,
  getSlug,
  getPrice,
  getGallery,
  getVariants,
  getAttributes,
  getCategories,
  getId
} from '../../src/getters/productHelpers';

const product = {
  _name: 'variant 1',
  _slug: 'variant-1',
  _id: 1234,
  price: {
    value: { centAmount: 1200 }
  },
  attributeList: [
    {
      name: 'articleNumberManufacturer',
      stringValue: 'H805 C195 85072',
      __typename: 'StringAttribute'
    }
  ],
  images: [{ url: 'imageV11/url.jpg' }, { url: 'imageV12/url.jpg' }],
  _categoriesRef: [
    'catA',
    'catB'
  ]
} as any;

describe('[commercetools getters] product helpers', () => {
  it('returns default values', () => {
    expect(getName(null)).toBe('');
    expect(getSlug(null)).toBe('');
    expect(getPrice(null)).toBe(null);
    expect(getGallery(null)).toEqual([]);
    expect(getVariants(null)).toEqual([]);
  });

  it('returns name', () => {
    expect(getName(product)).toBe('variant 1');
  });

  it('returns slug', () => {
    expect(getSlug(product)).toBe('variant-1');
  });

  it('returns price', () => {
    expect(getPrice(product)).toBe(12);
  });

  it('returns gallery', () => {
    expect(getGallery(product)).toEqual([
      {
        small: 'imageV11/url.jpg',
        big: 'imageV11/url.jpg',
        normal: 'imageV11/url.jpg'
      },
      {
        small: 'imageV12/url.jpg',
        big: 'imageV12/url.jpg',
        normal: 'imageV12/url.jpg'
      }
    ]);
  });

  it('returns master variant', () => {
    const variants = [
      { _name: 'variant 1',
        _master: false },
      { _name: 'variant 2',
        _master: true }
    ];
    expect(getVariants(variants as any, { master: true })).toEqual([{
      _name: 'variant 2',
      _master: true
    }]);
  });

  it('returns master variants', () => {
    const variants = [
      { _name: 'variant 1_1',
        _master: false },
      { _name: 'variant 1_2',
        _master: true },
      { _name: 'variant 2_1',
        _master: true },
      { _name: 'variant 2_2',
        _master: false }
    ];
    expect(getVariants(variants as any, { master: true })).toEqual([
      { _name: 'variant 1_2',
        _master: true },
      { _name: 'variant 2_1',
        _master: true }
    ]);
  });

  it('returns all variants', () => {
    const variants = [
      { _name: 'variant 1',
        _master: false },
      { _name: 'variant 2',
        _master: true }
    ];
    expect(getVariants(variants as any)).toEqual(variants);
  });

  it('returns product by given attributes', () => {
    const variant1 = {
      ...product,
      attributeList: [
        {
          name: 'size',
          stringValue: '36',
          __typename: 'StringAttribute'
        },
        {
          name: 'color',
          stringValue: 'white',
          __typename: 'StringAttribute'
        }
      ]
    };
    const variant2 = {
      ...product,
      attributeList: [
        {
          name: 'size',
          stringValue: '38',
          __typename: 'StringAttribute'
        },
        {
          name: 'color',
          stringValue: 'black',
          __typename: 'StringAttribute'
        }
      ]
    };

    const variants = [variant1, variant2];

    const attributes = { color: 'black',
      size: '38' };
    expect(getVariants(variants, { attributes })).toEqual([variant2]);
  });

  // Attributes

  it('returns product attributes', () => {
    expect(getAttributes([product])).toEqual({
      articleNumberManufacturer: [{ label: 'H805 C195 85072',
        value: 'H805 C195 85072' }]
    });
  });

  it('returns attributes of single product', () => {
    expect(getAttributes(product)).toEqual({ articleNumberManufacturer: 'H805 C195 85072' });
  });

  it('returns product unique attributes', () => {
    const prod = {
      ...product,
      attributeList: [
        {
          name: 'articleNumberManufacturer',
          stringValue: 'H805 C195 85072',
          __typename: 'StringAttribute'
        },
        {
          name: 'articleNumberManufacturer',
          stringValue: 'H805 C195 85072',
          __typename: 'StringAttribute'
        }
      ]
    } as any;

    expect(getAttributes([prod])).toEqual({
      articleNumberManufacturer: [{ label: 'H805 C195 85072',
        value: 'H805 C195 85072' }]
    });
  });

  it('returns filtered product attributes', () => {
    const product = {
      attributeList: [
        {
          name: 'articleNumberManufacturer',
          stringValue: 'H805 C195 85072',
          __typename: 'StringAttribute'
        },
        {
          name: 'color',
          stringValue: 'H805 C195 85072',
          __typename: 'StringAttribute'
        }
      ]
    } as any;

    expect(getAttributes([product], ['color'])).toEqual({
      color: [{ value: 'H805 C195 85072',
        label: 'H805 C195 85072' }]
    });
  });

  it('returns product categories', () => {
    expect(getCategories(product)).toEqual([
      'catA',
      'catB'
    ]);
  });

  it('returns product ID', () => {
    expect(getId(product)).toEqual(1234);
  });

  it('returns empty array if there is no product', () => {
    expect(getAttributes(null)).toEqual({});
  });
});
