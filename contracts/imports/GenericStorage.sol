pragma solidity ^0.4.23;

contract GenericStorage {
    mapping(address => Organization) public orgs;

    struct Submission {
        bytes32 details;
        address creator;
    }
    struct Task {
        bytes32 details;
        uint256 contributionTotal;
        mapping(address => uint256) contributionOf;
        Submission[] submissions;
    }

    struct Project {
        bytes32 details;
        uint256 childContributions;
        uint256 contributionTotal;
        mapping(address => bool) isAdmin;
        mapping(address => uint256) contributionOf;
        Task[] tasks;
    }

    struct Organization {
        bytes32 details;
        uint256 childContributions;
        uint256 contributionTotal;
        mapping(address => bool) isAdmin;
        mapping(address => uint256) contributionOf;
        Project[] projects;
    }

    modifier validDetail(bytes32 details) {
        require(details != bytes32(0));
        _;
    }
}
