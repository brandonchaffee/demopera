pragma solidity ^0.4.23;

contract GenericStorage {
    uint256 paymentLockout;
    mapping(address => Organization) public orgs;

    struct Submission {
        bytes32 details;
        address creator;
    }
    struct Payment {
        uint256 amount;
        uint256 unlockTime;
    }

    struct Contribution {
        uint256 self;
        uint256 child;
    }

    struct Task {
        bytes32 details;
        uint256 contributionTotal;
        mapping(address => Contribution) contributionOf;
        mapping(address => Payment) payments;
        Submission[] submissions;
    }

    struct Project {
        bytes32 details;
        uint256 childContributions;
        uint256 contributionTotal;
        mapping(address => bool) isAdmin;
        mapping(address => Contribution) contributionOf;
        Task[] tasks;
    }

    struct Organization {
        bytes32 details;
        uint256 childContributions;
        uint256 contributionTotal;
        mapping(address => bool) isAdmin;
        mapping(address => Contribution) contributionOf;
        Project[] projects;
    }

    modifier validDetail(bytes32 details) {
        require(details != bytes32(0));
        _;
    }
}
