from web3 import Web3
import json
import sys

#print('Number of arguments:', len(sys.argv), 'arguments.')
#print('Argument List:', str(sys.argv))

def config():
    provider = input("Provider: ")
    matricula = input("Matrícula: ")
    data = {}
    data["provider"] = provider
    data["matricula"] = matricula
    with open("config.json", 'w') as outfile:
        json.dump(data, outfile)

if sys.argv[1] == "-c":
    config()
else:
    with open("config.json") as file:
        config_json = json.load(file)
    provider = config_json["provider"]
    matricula = config_json["matricula"]

    web3 = Web3(Web3.HTTPProvider(provider))

    web3.eth.defaultAccount = web3.eth.accounts[4]

    print(web3.isConnected())

    print(web3.eth.blockNumber)

    with open("build/Contracts/ClearMileage.json") as file:
        info_json = json.load(file)
    abi = info_json["abi"]

    ClearMileage = web3.eth.contract(abi=abi, address="0x509f1747108f652b6303124F831e0338D8d0D7D9")

    print(ClearMileage.functions.greet().call())

    tx_hash = ClearMileage.functions.setCarInfo(matricula, int(sys.argv[1])).transact()
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    print(tx_receipt.gasUsed)
# AttributeDict({
#     'blockHash': '0x4e3a3754410177e6937ef1f84bba68ea139e8d1a2258c5f85db9f1cd715a1bdd',
#     'blockNumber': 46147,
#     'contractAddress': None,
#     'cumulativeGasUsed': 21000,
#     'from': '0xA1E4380A3B1f749673E270229993eE55F35663b4',
#     'gasUsed': 21000,
#     'logs': [],
#     'root': '96a8e009d2b88b1483e6941e6812e32263b05683fac202abc622a3e31aed1957',
#     'to': '0x5DF9B87991262F6BA471F09758CDE1c0FC1De734',
#     'transactionHash': '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
#     'transactionIndex': 0,
# })

#balance = web3.eth.getBalance("0xCca69ab918b84656AF248BC93717575129629BFe")
#print(web3.fromWei(balance, "ether"))