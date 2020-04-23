from web3 import Web3
import json
import sys

#print('Number of arguments:', len(sys.argv), 'arguments.')
#print('Argument List:', str(sys.argv))

def config():
    provider = input("Provider: ")
    public_key = input("Public key: ")
    private_key = input("Private key: ")
    contract_address = input("Contract address: ")
    matricula = input("Matrícula: ")
    data = {}
    data["provider"] = provider
    data["public_key"] = public_key
    data["private_key"] = private_key
    data["contract_address"] = contract_address
    data["matricula"] = matricula
    with open("config.json", 'w') as outfile:
        json.dump(data, outfile)

if sys.argv[1] == "-c":
    config()
else:
    try:
        with open("config.json") as file:
            config_json = json.load(file)
    except IOError:
        print("Config not created")
        config()
        exit()
    provider = config_json["provider"]
    public_key = config_json["public_key"]
    private_key = config_json["private_key"]
    contract_address = config_json["contract_address"]
    matricula = config_json["matricula"]

    web3 = Web3(Web3.HTTPProvider(provider))

    #web3.eth.defaultAccount = web3.eth.accounts[1]

    print(web3.isConnected())

    print(web3.eth.blockNumber)

    # print(web3.eth.accounts)

    with open("build/Contracts/ClearMileage.json") as file:
        info_json = json.load(file)
    abi = info_json["abi"]

    # ClearMileage = web3.eth.contract(abi=abi, address="0x06E131Aee4F75aE10b6fe9D0cD126A01BE714CfD")
    ClearMileage = web3.eth.contract(abi=abi, address=contract_address)

    print(ClearMileage.functions.greet().call())

    print(web3.eth.defaultBlock)

    # nonce = web3.eth.getTransactionCount('0x1C8c73e52b4D85C47813771C30CdF326ACFd33F8')
    # print(web3.eth.getTransactionCount('0x1C8c73e52b4D85C47813771C30CdF326ACFd33F8'))
    nonce = web3.eth.getTransactionCount(public_key)
    # print(web3.eth.getTransactionCount('0xe62549DDeCF2C0319497DAd71c4F8595A6259ca9'))
    if len(sys.argv) > 2 and sys.argv[2] == "dev":
        web3.eth.defaultAccount = public_key
        tx_hash = ClearMileage.functions.setCarInfo(matricula, int(sys.argv[1])).transact()
    # txn = ClearMileage.functions.setCarInfo(matricula, int(sys.argv[1])).buildTransaction({'nonce': web3.eth.getTransactionCount('0x1C8c73e52b4D85C47813771C30CdF326ACFd33F8')})
    else:
        txn = ClearMileage.functions.setCarInfo(matricula, int(sys.argv[1])).buildTransaction({'nonce': nonce})
    # tx_signed = web3.eth.account.sign_transaction(txn, '0x64A5760A6F7A391DC4251B876EC360B57370C06FCE1CE920F95CFA320C19801F')
        tx_signed = web3.eth.account.sign_transaction(txn, private_key)
        print(tx_signed)
        tx_hash = web3.eth.sendRawTransaction(tx_signed.rawTransaction) 
        print(tx_hash)
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    print(tx_receipt.gasUsed)
    
    # tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    # print(tx_receipt.gasUsed)
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