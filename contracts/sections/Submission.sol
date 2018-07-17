pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Submission is EscrowToken  {
    event SubmissionCreated(
        address indexed org,
        uint256 indexed project,
        uint256 indexed task,
        uint256 submission
    );

    // Sf1 (Appendix)
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
        emit SubmissionCreated(_org, _project, _task, submissionID);
        return submissionID;
    }

    // Sf2 (Appendix)
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

    // Sf3 (Appendix)
    function retrievePayment(
        address _org,
        uint256 _project,
        uint256 _task
    ) public {
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        require(now > t.payments[msg.sender].unlockTime);
        uint256 _amount = t.payments[msg.sender].amount;
        depositTo(_amount, msg.sender);
        t.total = t.total.sub(_amount);
        t.payments[msg.sender].amount = 0;
    }
}
