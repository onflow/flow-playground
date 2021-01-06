import path from "path";
import {
    init,
    sendTransaction,
    deployContractByName,
    getTransactionCode,
} from "flow-js-testing/dist";
import { getScriptCode } from "flow-js-testing/dist/utils/file";
import { executeScript } from "flow-js-testing/dist/utils/interaction";
import { Int, Address } from "@onflow/types";
import { getContractAddress } from "flow-js-testing/dist/utils/contract";
import { getAccountAddress } from "flow-js-testing/dist/utils/create-account";

const basePath = path.resolve(__dirname, "../cadence");

beforeAll(() => {
    init(basePath);
});

describe("Deployment", () => {
    test("Create accounts", async ()=>{

        // Playground project support 4 accounts, but nothing stops you from creating more by following the example
        // laid out below
        const Alice = await getAccountAddress("Alice")
        const Bob = await getAccountAddress("Bob")
        const Charlie = await getAccountAddress("Charlie")
        const Dave = await getAccountAddress("Dave")

        console.log("Four Playground accounts were created with following addresses");
        console.log("Alice:", Alice)
        console.log("Bob:", Bob)
        console.log("Charlie:", Charlie)
        console.log("Dave:", Dave)
    })

    // ##DEPLOYMENT-TESTS##
})