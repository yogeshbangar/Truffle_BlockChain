pragma solidity >=0.4.21 <0.6.0;

contract HelloWorld{

  string private name;

  constructor(string memory _name) public {
    name = _name;
  }

  function getName() public view returns (string memory){
    return name;

  }
  function setName(string memory _name) public {
    name = _name;
  }
}
