/*
    Documentation: https://expopulo.readthedocs.io
    Author: Brandon Chaffee
    License: MIT
*/

pragma solidity ^0.4.23;

contract GenericStorage {
    // GSs1 (Appendix)
    uint256 paymentLockout;
    // GSs2 (Appendix)
    mapping(address => Organization) public orgs;

    // GSs3 (Appendix)
    struct Organization {
        bytes32 details;
        uint256 total;
        uint256 stakes;
        mapping(address => Admin) admin;
        mapping(address => uint256) stakeOf;
        mapping(address => uint256) contributionOf;
        Project[] projects;
    }

    // GSs4 (Appendix)
    struct Admin {
        bool isValid;
        uint256 enableVotes;
        uint256 disableVotes;
        mapping(address => uint256) enableVotesOf;
        mapping(address => uint256) disableVotesOf;
    }

    // GSs5 (Appendix)
    struct Project {
        bytes32 details;
        uint256 total;
        uint256 distributed;
        mapping(address => uint256) contributionOf;
        Task[] tasks;
    }

    // GSs6 (Appendix)
    struct Task {
        bytes32 details;
        uint256 total;
        uint256 distributed;
        mapping(address => uint256) contributionOf;
        mapping(address => Payment) payments;
        Submission[] submissions;
    }

    // GSs7 (Appendix)
    struct Submission {
        bytes32 details;
        address creator;
    }

    // GSs8 (Appendix)
    struct Payment {
        uint256 amount;
        uint256 unlockTime;
    }

    // GSs9 (Appendix)
    modifier validDetail(bytes32 details) {
        require(details != bytes32(0));
        _;
    }

    // GSsA (Appendix)
    modifier isAdmin(address _org) {
        require(orgs[_org].admin[msg.sender].isValid);
        _;
    }
}
