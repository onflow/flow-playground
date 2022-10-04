const getIframeBody = () => {
    return cy
      .get('iframe[id="FCL_IFRAME"]')
      .its('0.contentDocument.body').should('not.be.empty')
      .then(cy.wrap)
  }
  
describe('Flow-Playground frontend tests', () => {

    beforeEach(() => {
        cy.viewport('macbook-16')
        cy.visit('http://localhost:3000/')
        cy.waitForReact(1000, '#root')
        
    })

    it('deploys a contract', () => {
        cy.react('AccountList').children().last().children().should('have.length', 5).first().click()
        cy.react('ActionButton', {props: {type: 1}}).contains('Deploy').click()
        cy.react('ActionButton', {props: {type: 1}}).contains('Redeploy')
        cy.react('RenderResponse', {props: {resultType: 'CONTRACT'}}).should('exist')
    })

    it('sends a transaction', () =>{
        cy.react('MenuList', {props: {title: 'Transaction Templates'}}).children().first().contains('Transaction')
        cy.get('div[title=Transaction]').click()
        cy.react('EditorTitle', {props: {type: 2}}).contains('Transaction Template')
        // Ensure action button is disabled when contract not deployed yet
        cy.react('ActionButton', {props: {type: 2, active: false}}).contains('Send')

        // deploy contract
        cy.react('AccountList').children().last().children().first().click()
        cy.react('ActionButton', {props: {type: 1}}).click()
        cy.wait(5000)

        // open transaction template and successfully send transaction
        cy.get('div[title=Transaction]').click()
        cy.react('ActionButton', {props: {type: 2, active: true}}).contains('Send').click()
        cy.wait(1000)
        cy.react('Line', {props: {label: 'Transaction', tag: 1}}).should('exist')
    })

    it('executes a script', () => {
        cy.react('MenuList', {props: {title: 'Script Templates'}}).children().first().contains('Script')
        cy.get('div[title=Script]').click()
        cy.react('EditorTitle', {props: {type: 3}}).contains('Script Template')
        cy.react('ActionButton', {props: {type: 3, active: true}}).contains('Execute').click()
        cy.react('Line', {props: {label: 'Script', tag: 2}}).should('exist')
    })

    it.skip('reflects changes to imported contract after contract has been redeployed', () => {

        // deploy contract
        cy.react('AccountList').children().last().children().first().click()
        cy.react('ActionButton', {props: {type: 1}}).click()
        cy.wait(5000)

        // send transaction
        cy.get('div[title=Transaction]').click()
        cy.react('ActionButton', {props: {type: 2, active: true}}).click()
        cy.wait(1000)
        cy.react('Line', {props: {label: 'Transaction', tag: 1}}).should('exist')


        cy.react('AccountList').children().last().children().first().click()
        // select monaco editor
        cy.get('div[id=monaco-container]')

        // edit contract

        // select transaction and confirm disabled action button
        cy.get('div[title=Transaction]').click()
        cy.react('ActionButton', {props: {type: 2, active: false}}).contains('Send')

        // select monaco editor
        cy.get('div[id=monaco-container]')

        // edit transaction to reflect contract updates

        // successfully send transaction
        cy.react('ActionButton', {props: {type: 2, active: true}}).contains('Send').click()
        cy.wait(1000)
        cy.react('Line', {props: {label: 'Transaction', tag: 1}}).should('exist')

    })

})