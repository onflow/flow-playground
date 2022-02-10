export const collapseSpaces = (input: string) => input.replace(/\s+/g, " ");
export const stripNewLines = (input: string) => input.replace(/\r\n|\n|\r/g, " ");

export const generateSchema = (argsDefinition: string) =>
    argsDefinition
        .split(",")
        .map((item) => item.replace(/\s*/g, ""))
        .filter((item) => item !== "");

export const stripComments = (code: string) => {
    const commentsRegExp = /(\/\*[\s\S]*?\*\/)|(\/\/.*)/g;
    return code.replace(commentsRegExp, "");
};

export const extract = (code: string, keyWord: string) => {
    const noComments = stripComments(code);
    const target = collapseSpaces(noComments.replace(/[\n\r]/g, ""));

    if (target) {
        const regexp = new RegExp(keyWord, "g");
        const match = regexp.exec(target);

        if (match) {
            if (match[1] === "") {
                return [];
            }
            return generateSchema(match[1]);
        }
    }
    return [];
};

export const extractSigners = (code: string) => {
    return extract(code, `(?:prepare\\s*\\(\\s*)([^\\)]*)(?:\\))`);
};
