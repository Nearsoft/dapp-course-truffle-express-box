// Imports truffle-contract module and TecV4 compiled version of the contract.
const contract = require('truffle-contract');
const tecV4Contract = require('../build/contracts/TecV4.json');
var TecV4 = contract(tecV4Contract);
module.exports = {
  // Function that fetch the accounts of web3 instance.
  start: function(callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    TecV4.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      console.log({err, accs});
      if (err != null) {
        console.log("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  // Function that get the deployed contract and the triggers the newWritter contract function.
  newWritter: async function(writterSign, userId) {
    try {
      var self = this;
      TecV4.setProvider(self.web3.currentProvider);
      const tecV4Instance = await TecV4.deployed();
      try {
        console.log('tecV4Instance ', tecV4Instance.address);
        const senderAccount = self.accounts[self.accounts.length - 1];
        const answer = await tecV4Instance.newWritter(writterSign, userId, { from: senderAccount, gas: 150000 });
        console.log('answer ', JSON.parse(JSON.stringify(answer)));
        return answer.tx;
      } catch (err) {
        throw new Error('Error while deploying ' + err);
      }
    } catch (err) {
      throw new Error('Error while deploying ' + err);
    }
  },
  // Function that get the deployed contract and the call the validateWritter contract function.
  validateWritter: async function (writterSign, writterId) {
    try {
      var self = this;
      TecV4.setProvider(self.web3.currentProvider);
      const tecV4Instance = await TecV4.deployed();
      try {
        return await tecV4Instance.validateWritter(writterSign, writterId);
      } catch (err) {
        throw new Error('Error while callinf function ' + err);
      }
    } catch (err) {
      throw new Error('Error while deploying ' + err);
    }
  },
  // Function that get the deployed contract and the triggers the newCertificate contract function.
  newCertificate: async function(writterId, writterSign, certificate, studentId) {
    try {
      var self = this;
      TecV4.setProvider(self.web3.currentProvider);
      const tecV4Instance = await TecV4.deployed();
      try {
        const senderAccount = self.accounts[self.accounts.length - 1];
        const answer = await tecV4Instance.newCertificate(writterId, writterSign, certificate, studentId, { from: senderAccount });
        console.log('answer ', answer);
        return answer.tx;
      } catch (err) {
        throw new Error('Error while sending transaction ' + err);
      }
    } catch (err) {
      throw new Error('Error while deploying ' + err);
    }
  },
  // Function that get the deployed contract and the call the validateCertificate contract function.
  validateCertificate: async function (certificate, studentId) {
    try {
      var self = this;
      TecV4.setProvider(self.web3.currentProvider);
      const tecV4Instance = await TecV4.deployed();
      try {
        return await tecV4Instance.validateCertificate(studentId, certificate);
      } catch (err) {
        throw new Error('Error while calling function ' + err);
      }
    } catch (err) {
      throw new Error('Error while deploying ' + err);
    }
  },
}
