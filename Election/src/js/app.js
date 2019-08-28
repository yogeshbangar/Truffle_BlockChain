App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      console.log("initContract: function");
      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {



    web3.eth.getCoinbase(function(err, account) {
      console.log(err, account);
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();
    console.log("render: function");
    // Load account data

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      console.log("render: candidatesCount ...."+electionInstance.candidateConut());
      return electionInstance.candidateConut();
    }).then(function(candidatesCount) {
      console.log("render: candidatesCount "+candidatesCount);
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
      var myArray = Array();
      for (var i = 0; i < candidatesCount; i++) {
        console.log("render: candidatesCount <><> "+candidatesCount);
        electionInstance.candidates(i).then(function(candidate) {

          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
          myArray[id-1] = candidate;
          console.log(myArray.length+" "+id+" "+myArray);
          candidatesResults.empty();
          candidatesSelect.empty();
          for (var i = 0; i < myArray.length; i++) {
            var id = myArray[i][0];
            var name = myArray[i][1];
            var voteCount = myArray[i][2];
            // Render candidate Result

           var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
           candidatesResults.append(candidateTemplate);

           // Render candidate ballot option
           var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
           candidatesSelect.append(candidateOption);

          }

        });
      }
      console.log("electionInstance.voters(App.account) "+App.account);
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      console.log("hasVoted = "+hasVoted);
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      console.log("instance.vote = "+candidateId);
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
  castVoteDummy: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      console.log("castVoteDummy.vote = ");
      return instance.great();
    }).then(function(){
      console.log("can");
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
