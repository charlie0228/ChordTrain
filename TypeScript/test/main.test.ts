import { classify } from '@/main'

test('First classify', () => {
	jest.spyOn(console, 'log');

	classify(['d', 'g', 'e', 'dm']);

  expect(console.log).toBeCalledWith({
    easy: 2.023094827160494,
    medium: 1.855758613168724,
    hard: 1.855758613168724,
  });
});

test('Second classify', () => {
	jest.spyOn(console, 'log');

  classify(['f#m7', 'a', 'dadd9', 'dmaj7', 'bm', 'bm7', 'd', 'f#m']);

  expect(console.log).toBeCalledWith({
    easy: 1.3433333333333333,
    medium: 1.5060259259259259,
    hard: 1.6884223991769547,
  });
});

