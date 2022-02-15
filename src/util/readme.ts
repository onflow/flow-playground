// Title and Description fields come from server in sanitized form, escaping all special characters
// for security reasons. For user friendly display we need to convert it back to readable form
//
// Original solution was found on StackOverflow: https://stackoverflow.com/a/42254787/3892712
export const decodeText = (text: string): string => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(
    `<!doctype html><body>${text}</body></html>`,
    'text/html',
  );
  return dom.body.textContent;
};
