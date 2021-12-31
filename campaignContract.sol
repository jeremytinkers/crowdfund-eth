pragma solidity ^0.4.17;

contract Campaign {

    struct SpendRequest {
        string descp;
        uint expenditure;
        address vendorAddress;
        bool complete;
        mapping(address => bool) curVotersSet;
        uint yes;
        uint no;
    }

    address public manager;
    uint public minContribution;
    mapping(address => bool) public contributors;
    uint public noContributors;
    SpendRequest[] public requests;

    function Campaign(uint InitialMinContribution) public{
        manager = msg.sender;
        minContribution = InitialMinContribution;

    }

    //Allows any  caller to become a contributor to the campaign provided they meet minContribution
    function contribute() public payable {

        require(msg.value>= minContribution);
        contributors[msg.sender] = true;
        noContributors++;

    }

    function createRequest(string rDescp, uint rExpenditure,  address rVendorAddress) public {
     
     require(msg.sender == manager);

     SpendRequest memory newReq = SpendRequest({
         descp: rDescp,
         expenditure: rExpenditure,
         vendorAddress: rVendorAddress,
         complete: false,
         yes:0,
         no:0
     });

     requests.push(newReq);
         
    }

    //allows a caller to vote for a particular spend request that the manager has uploaded
    function voteRequest(uint idx , bool vote ) public {

        //check if request idx is valid
        require(idx<requests.length && idx>=0);
        //check if request is not complete
        require(!requests[idx].complete);
        //is caller a contributor?
        require(contributors[msg.sender]);
        //has the contributor already voted before?
        require(!requests[idx].curVotersSet[msg.sender]);

        //the contributor now qualifies to vote
        requests[idx].curVotersSet[msg.sender] = true;

        if(vote){
            requests[idx].yes++;
        }else{
            requests[idx].no++;
        }
  
    }

    //a manager authorized fn to transfer funds to vendors if contributors are in favour
    function completeRequest(uint idx) public payable {

        require(msg.sender == manager);
        
        if((requests[idx].yes + requests[idx].no) == noContributors && 
        requests[idx].yes > requests[idx].no){
            requests[idx].complete = true;
            //pay vendorAddress
            requests[idx].vendorAddress.transfer(requests[idx].expenditure);
            //delete this req?
        }
    
    }


}
