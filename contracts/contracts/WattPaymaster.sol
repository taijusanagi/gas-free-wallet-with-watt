// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract WATTPaymaster is BasePaymaster {

    // WATTContract
    IERC20 public watt;
    uint256 public threshold;

    constructor(
        IEntryPoint _entryPoint,
        IERC20 _watt,
        uint256 _threshold
    ) BasePaymaster(_entryPoint) {
        watt = _watt;
        threshold = _threshold;
    }

    function _validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    )
        internal
        view
        override
        returns (bytes memory context, uint256 validationData)
    {
        // validate WATT amount
        // https://developer.newcoin.org/docs/getting-started/using-watts/querying-watts/
        uint256 balance = watt.balanceOf(userOp.sender);
        require(balance >= threshold, "watt balance is not enough");
        return (abi.encode(), 0);
    }

    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) internal override {}

}
