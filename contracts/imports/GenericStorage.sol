pragma solidity ^0.4.23;

contract GenericStorage {
    uint256 paymentLockout;
    mapping(address => Organization) public orgs;

    struct Organization {
        bytes32 details;
        uint256 total;
        uint256 stakes;
        mapping(address => Admin) admin;
        mapping(address => uint256) stakeOf;
        mapping(address => uint256) contributionOf;
        Project[] projects;
    }

    struct Admin {
        bool isValid;
        uint256 enableVotes;
        uint256 disableVotes;
        mapping(address => uint256) enableVotesOf;
        mapping(address => uint256) disableVotesOf;
    }

    struct Project {
        bytes32 details;
        uint256 total;
        uint256 distributed;
        mapping(address => uint256) contributionOf;
        Task[] tasks;
    }

    struct Task {
        bytes32 details;
        uint256 total;
        uint256 distributed;
        mapping(address => uint256) contributionOf;
        mapping(address => Payment) payments;
        Submission[] submissions;
    }

    struct Submission {
        bytes32 details;
        address creator;
    }
    struct Payment {
        uint256 amount;
        uint256 unlockTime;
    }

    modifier validDetail(bytes32 details) {
        require(details != bytes32(0));
        _;
    }

    modifier isAdmin(address _org) {
        require(orgs[_org].admin[msg.sender].isValid);
        _;
    }
}
