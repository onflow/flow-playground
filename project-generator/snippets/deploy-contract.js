// TODO: allow addressMap to be injected
// TODO: allow target account to be injected
test("Deploy ##CONTRACT-NAME## contract", async () => {
    let deployContract;
    try {
        deployContract = await deployContractByName({
            name: "##CONTRACT-NAME##",
        });
    } catch (e) {
        console.log(e);
    }
    expect(deployContract.errorMessage).toBe("");
});