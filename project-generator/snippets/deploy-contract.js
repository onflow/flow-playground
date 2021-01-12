test("Deploy ##GENERATE-CONTRACT-NAME## contract", async () => {
    let deployContract;
    // ##GENERATE-TO-ADDRESS##
    // ##GENERATE-ADDRESS-MAP##
    try {
        deployContract = await deployContractByName({
            name: "##CONTRACT-NAME##",
            // ##GENERATE-TO-ADDRESS-INJECT##
            // ##GENERATE-ADDRESS-MAP-INJECT##
        });
    } catch (e) {
        console.log(e);
    }
    expect(deployContract.errorMessage).toBe("");
});