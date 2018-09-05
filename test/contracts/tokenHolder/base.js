let authorizeSession = require('./authorizeSession');
executeRule = require('./executeRule');

contract('Token holder', function(accounts) {
  describe('authorize session', async () => authorizeSession.perform(accounts));
  describe('execute rule', async () => executeRule.perform(accounts));
});
