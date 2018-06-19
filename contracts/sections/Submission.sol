pragma solidity ^0.4.23;

import "../imports/GenericStorage.sol";

contract Submission is GenericStorage  {
    function createSubmission(
        address _org,
        uint256 _project,
        uint256 _task,
        bytes32 _details
    ) public returns(uint256) {
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        uint256 submissionID = t.submissions.length++;
        t.submissions[submissionID].details = _details;
        t.submissions[submissionID].creator = msg.sender;
        return submissionID;
    }

    function modifySubmission(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _submission,
        bytes32 _details
    ) public {
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        require(t.submissions[_submission].creator == msg.sender);
        t.submissions[_submission].details = _details;
    }
}
