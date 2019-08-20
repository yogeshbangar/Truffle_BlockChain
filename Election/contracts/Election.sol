pragma solidity ^0.5.0;

contract Election {
  //Model a Candidate
  struct Candidate{
    uint id;
    string name;
    uint vateCount;
  }
  //store a candidate
  //Fetch a candidates
  mapping (address => bool) public voters;
  mapping (uint => Candidate) public candidates;
  event votedEvent(uint indexed _candidateId);
  //store candidates count
  uint public candidateConut;
  constructor() public {
    candidateConut = 0;
    addCandidate("Candidate 1");
    addCandidate("Candidate 2");
  }
  function addCandidate(string memory _name) private {
    candidates[candidateConut] = Candidate(candidateConut + 1,_name,0);
    candidateConut++;
  }
  function vote(uint _candidateId) public {
    require(!voters[msg.sender]);
    require(_candidateId >= 0 && _candidateId < candidateConut);
    voters[msg.sender] = true;
    candidates[_candidateId].vateCount ++;
    emit votedEvent(_candidateId);
  }
}
