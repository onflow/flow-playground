// @ts-ignore-start
const mb32 = a => (t) => (a+1831565813|0,t=Math.imul(a^a>>>15,1|a),t=t+Math.imul(t^t>>>7,61|t)^t,(t^t>>>14)>>>0)/2**32;

export const generateRandomSeed = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

export const generateHash = (seed: number, index: number, maxIndex: number) => {
    return (mb32(seed * (index / maxIndex))(index)).toString();
}
// @ts-ignore-stop
