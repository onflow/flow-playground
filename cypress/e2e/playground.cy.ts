describe('Flow-Playground frontend tests', () => {

    beforeEach(() => {
        cy.viewport('macbook-16')
        cy.visit('/')
    })

    it('deploys a contract', () => {
        cy.get('[data-test="account-list"]').children().should('have.length', 5).first().click()
        cy.get('[data-test="action-button"]').contains('Deploy').click()
        cy.get('[data-test="control-panel-status-message"]').should(
        'have.text',
        'Please, wait...',
        );
        cy.get('[data-test="action-button"]').contains('Redeploy')
        cy.get('[data-test="deployment-result"]').contains('Deployed Contract To: 0x01')
    })

    it('sends a transaction', () =>{
        cy.get('div[title=Transaction]').click()
        cy.get('[data-test="editor-heading"]').contains('Transaction Template')
        // Ensure action button is disabled when contract not deployed yet
        cy.get('[data-test="action-button"]').contains('Send')

        // deploy contract
        cy.get('[data-test="account-list"]').children().first().click()
        cy.get('[data-test="action-button"]').contains('Deploy').click()
        cy.get('[data-test="action-button"]').contains('Redeploy')

        // open transaction template and successfully send transaction
        cy.get('div[title=Transaction]').click()
        cy.get('[data-test="action-button"]').contains('Send').click()
        cy.get('[data-test="transaction-result"]').contains('Hello, World!')
    })

    it('executes a script', () => {
        cy.get('div[title=Script]').click()
        cy.get('[data-test="editor-heading"]').contains('Script Template')
        cy.get('[data-test="action-button"]').contains('Execute').click()
        cy.get('[data-test="script-result"]').contains('{"type":"Int","value":"1"}')
    })

    it('reflects changes to imported contract after contract has been redeployed', () => {

        // deploy contract
        cy.get('[data-test="account-list"]').children().first().click()
        cy.get('[data-test="action-button"]').contains('Deploy').click()
        cy.get('[data-test="control-panel-status-message"]').should(
        'have.text',
        'Please, wait...',
        );
        cy.get('[data-test="action-button"]').contains('Redeploy')

        // send transaction
        cy.get('div[title=Transaction]').click()
        cy.get('[data-test="action-button"]').contains('Send').click()
        cy.get('[data-test="transaction-result"]').contains('Hello, World!')

        // edit contract
        cy.get('[data-test="account-list"]').children().first().click()
        cy.get( '.monaco-editor textarea:first' ).click().focused().type('{cmd}a').clear()
        cy.get( '.monaco-editor textarea:first' ).should('have.value', '')
        cy.get( '.monaco-editor textarea:first' ).click().focused().type('access(all) contract HelloWorld { access(all) let greeting: String init() { self.greeting = "Hello, Other World!"} access(all) fun other_hello(): String {return self.greeting}}', {parseSpecialCharSequences: false});
        cy.get('[data-test="action-button"]').contains('Redeploy').click()
        cy.get('[data-test="control-panel-status-message"]').should(
        'have.text',
        'Please, wait...',
        );
        cy.get('[data-test="control-panel-status-message"]').should(
            'not.have.text',
            'Please, wait...',
            );
        cy.get('[data-test="action-button"]').contains('Redeploy')

        // select transaction and confirm disabled action button
        cy.get('div[title=Transaction]').click()
        cy.get('[data-test="action-button"]').contains('Send').should('be.disabled')

        // edit transaction to reflect contract updates
        cy.get( '.monaco-editor textarea:first' ).click().focused().type( '{cmd}a' ).type('import HelloWorld from 0x01 transaction { prepare(acct: AuthAccount) {} execute { log(HelloWorld.other_hello())}}', {parseSpecialCharSequences: false})
        cy.get('[data-test="action-button"]').contains('Send').click()

        // successfully send transaction
        cy.get('[data-test="action-button"]').contains('Send').click()
        cy.get('[data-test="transaction-result"]').contains('Hello, Other World!')

    })

})