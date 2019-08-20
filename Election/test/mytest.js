var Election = artifacts.require("Election");
contract('Election',function(accounts){
  var ins;
  var candidateId;
  it('initialize with 2 canditates',function(){
      return Election.deployed().then(function(instacnce){
        return instacnce.candidateConut();
      }).then(function(count){
        assert.equal(count,2,'check initialize with '+count+' canditates');
      });
  });
  it('canditates values',function(){
      return Election.deployed().then(function(instacnce){
        ins = instacnce;
        return ins.candidates(0);
      }).then(function(candidate){
        assert.equal(candidate[0].toNumber(),1,'candidate id not correct '+candidate[0].toNumber());
        assert.equal(candidate[1],'Candidate 1','candidate name not correct');
        // assert.equal(candidate[2],0,'candidate vateCount not correct');
        return ins.candidates(1);
      }).then(function(candidate){
        assert.equal(candidate[0].toNumber(),2,'candidate id not correct '+candidate[0].toNumber());
        assert.equal(candidate[1],'Candidate 2','candidate name not correct');
        // assert.equal(candidate[2],0,'candidate vateCount not correct');
      });
  });
  it('allow voter to cast vote',function(){
      return Election.deployed().then(function(instacnce){
        ins = instacnce;
        candidateId = 0;
        return ins.vote(candidateId,{from : accounts[0]});
      }).then(function(reciept){
        assert.equal(reciept.logs.length,1,'an event was triggered');
        assert.equal(reciept.logs[0].event,'votedEvent','the event type is corrcet');
        assert.equal(reciept.logs[0].args._candidateId.toNumber(),candidateId,'the candidate id is correct');
        return ins.voters(accounts[0]);
      }).then(function(voted){
        assert(voted," the voter mark as voted");
        return ins.candidates(candidateId);
      }).then(function(candidate){
        var voteCount = candidate[2];
        assert.equal(voteCount,1,'increamet the condidate vote count');
      });
  });
  it('Throwgh an exeption for invalide candidates',function(){
      return Election.deployed().then(function(instacnce){
        ins = instacnce;
        candidateId = 99;
        return ins.vote(candidateId,{from : accounts[0]});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert') >= 0,"Error massege must contain revert.");
        return ins.candidates(0);
      }).then(function(candidate0){
        var voteCount = candidate0[2];
        assert.equal(voteCount,1,voteCount+' increamet.. the condidate0 vote count');
        return ins.candidates(1);
      }).then(function(candidate1){
        var voteCount = candidate1[2];
        assert.equal(voteCount,0,'increamet. the condidate1 vote count');
      });
  });
  it('Throwgh an exeption for Double Voting',function(){
      return Election.deployed().then(function(instacnce){
        ins = instacnce;
        candidateId = 1;
        ins.vote(candidateId,{from : accounts[1]});
        return ins.candidates(candidateId);
      }).then(function(candidate1){
        var voteCount = candidate1[2];
        assert.equal(voteCount,1,'Accept first vote');
        //try to vote again
        return ins.vote(candidateId,{from : accounts[1]});
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert') >= 0," Error massege must contain revert.");
        return ins.candidates(0);
      }).then(function(candidate0){
        var voteCount = candidate0[2];
        assert.equal(voteCount,1,'increamet the condidate0 vote count');
        return ins.candidates(1);
      }).then(function(candidate1){
        var voteCount = candidate1[2];
        assert.equal(voteCount,1,'increamet the condidate1 vote count');
      });
  });
});
