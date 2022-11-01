# Notes
1. Can I get the execution trace for the transaction?
2. Coordinator pulls it for the block from the Sequencer
3. Execution trace then goes to the roller for the roller to produce a proof that the execution was executed correctly
    - Roller converts the execution trace to circuit witnesses
    - Generates proofs for each of the zkEVM circuits
    - Uses proof aggregation to combine proofs from multiple zkEVM circuits into a single block proof


## Scroll and zkSync
# Scroll
Deployed an ERC20Mintable contract here: https://l2scan.scroll.io/address/0xDb88Df5bE6285d2d6f6B4645884C229B73df9799 

Transfer tx: https://l2scan.scroll.io/tx/0xff2487c7528c9ac491a380589c19a4b2ae2f9b918f1b59360bb2950ec77707cb/token-transfers 

1. Execution trace for the transfer transaction
Hash: 0xff2487c7528c9ac491a380589c19a4b2ae2f9b918f1b59360bb2950ec77707cb 

Tried pinging their node, it doesn't support the `debug_traceTransaction`. From their block explorer, have got:

```
[
  {
    "action": {
      "callType": "call",
      "from": "0x64c4bffb220818f0f2ee6dae7a2f17d92b359c5d",
      "gas": "0x7512",
      "input": "0xa9059cbb000000000000000000000000803554c9cb72227d88b56495d3e92f96ad589b09000000000000000000000000000000000000000000000000000000000000000a",
      "to": "0xdb88df5be6285d2d6f6b4645884c229b73df9799",
      "value": "0x0"
    },
    "result": {
      "gasUsed": "0x7512",
      "output": "0x0000000000000000000000000000000000000000000000000000000000000001"
    },
    "subtraces": 0,
    "traceAddress": [],
    "type": "call"
  }
]
```
2. Circuit witness from the execution trace
3. Intermediate outputs of their circuits:
   - State proof
   - EVM proof
4. Final block proof that is broadcast on L1 

5. How are reverts handled?

# zkSync
Solidity code bytecode is compiled down to an intermediate representation. The intermediate representation is SNARK friendly. 

They have written their own virtual machine, which is SNARK-friendly. 

Deployed ERC20Mintable contract, minted and transferred tokens. 

Token address: 0xc46d85433868AdB9d14A369270Be2E4009a5E32C 

Mint tx: 0x232cc32004c6c37857bdd316a996bff61ced75dbb367a585237b8dc11ff9c9c3

Transfer tx: 0x3caf8e95bc0521debed152f7c727d79c3d4638c310306d4f453a327991f11abc

1. The zkSync compiler results in significantly different bytecode for the ERC20Mintable.sol contract: https://www.diffchecker.com/LGtIWQTF 
2. 


