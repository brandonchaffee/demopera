pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Moderation is EscrowToken {
    function voteOnEnableAdmin(
        address _org,
        address _target,
        bool enable
    ) public {
        uint256 senderStake = orgs[_org].stakeOf[msg.sender];
        Admin storage a = orgs[_org].admin[_target];
        //Remove previous votes (if any)
        a.enableVotes = a.enableVotes.sub(a.enableVotesOf[msg.sender]);
        //If voting to enable, add to total and account sender votes
        //Else set senders votes as zero
        if(enable){
            a.enableVotes = a.enableVotes.add(senderStake);
            a.enableVotesOf[msg.sender] = senderStake;
        } else {
            a.enableVotesOf[msg.sender] = 0;
        }
        //Check vote count against total stakes
        a.isValid = a.enableVotes * 2 >= orgs[_org].stakes;
    }

    function voteOnDisableAdmin(
        address _org,
        address _target,
        bool disable
    ) public {
        uint256 senderStake = orgs[_org].stakeOf[msg.sender];
        Admin storage a = orgs[_org].admin[_target];
        //Remove previous votes (if any)
        a.disableVotes = a.disableVotes.sub(a.disableVotesOf[msg.sender]);
        //If voting to disable, add to total and account sender votes
        //Else set senders votes as zero
        if(disable){
            a.disableVotes = a.disableVotes.add(senderStake);
            a.disableVotesOf[msg.sender] = senderStake;
        } else {
            a.disableVotesOf[msg.sender] = 0;
        }
        //Check vote count against total stakes
        a.isValid = a.disableVotes * 2 <= orgs[_org].stakes;
    }
}
