import { decodeText } from '../../src/util/readme';

describe('Decoding', () => {
  test('properly decodes input - multiple special characters', () => {
    const input = `&#39;&amp;&#34;/\\\\~`;
    const expected = `'&"/\\\\~`;
    const result = decodeText(input);
    expect(result).toBe(expected);
  });

	test('properly decodes input - human readable text', () => {
		const input = `We&#39;re just a @silver-boy &amp; /bilbo-baggins\\`;
		const expected = `We're just a @silver-boy & /bilbo-baggins\\`;
		const result = decodeText(input);
		expect(result).toBe(expected);
	});
});
