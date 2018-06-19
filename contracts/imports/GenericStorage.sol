pragma solidity ^0.4.23;

contract GenericStorage {
    mapping(address => Organization) public orgs;

    struct Task {
        bytes32 details;
        uint256 totalContributions;
        mapping(address => uint256) contributionOf;
        Submission[] submissions;
    }

    struct Submission {
        bytes32 details;
        address creator;
    }

    struct Project {
        bytes32 details;
        uint256 totalContributions;
        mapping(address => bool) isAdmin;
        mapping(address => uint256) contributionOf;
        Task[] tasks;
    }

    struct Organization {
        bytes32 details;
        uint256 totalContributions;
        mapping(address => bool) isAdmin;
        mapping(address => uint256) contributionOf;
        Project[] projects;
    }
}
