import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Select from "react-select";
import axios from "axios";

function App() {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const [haveMetamask, sethaveMetamask] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [accountAddress, setAccountAddress] = useState("");
    const [accountBalance, setAccountBalance] = useState("");
    const [haveNFT, setHaveNFT] = useState(false);
    const [checked, setChecked] = useState(false);

    const [contractAddr, setContractAddr] = useState(
        "0x09aD6Fb74584fFbA72C65419c03741325CAE00a1" // Default to TeamNouns
    );

    const options = [
        {
            value: "0x09aD6Fb74584fFbA72C65419c03741325CAE00a1",
            label: "TeamNoun",
        },
        {
            value: "0x672cad0a6365c38D118603a15b5b2ca3ce7A0880",
            label: "Mayan",
        },
    ];

    // See if Metamask is installed on browser
    useEffect(() => {
        const { ethereum } = window;
        const checkMetamaskAvailability = async () => {
            if (!ethereum) {
                sethaveMetamask(false);
            }
            sethaveMetamask(true);
        };
        checkMetamaskAvailability();
    }, []);

    const checkNFTOwnership = () => {
        axios
            .get(
                `https://testnets-api.opensea.io/api/v1/assets?owner=${accountAddress}&asset_contract_address=${contractAddr}&order_direction=desc&offset=0&limit=20&include_orders=false`
            )
            .then((res) => {
                if (res.data.assets.length > 0) {
                    // Holds an asset under the contract address
                    setHaveNFT(true);

                    //console.log("Has NFT");
                } else {
                    setHaveNFT(false);
                }
                setChecked(true);
            });
    };

    const connectWallet = async () => {
        try {
            if (!ethereum) {
                sethaveMetamask(false);
            }
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            let balance = await provider.getBalance(accounts[0]);
            let bal = ethers.utils.formatEther(balance);
            setAccountAddress(accounts[0]);
            setAccountBalance(bal);
            setIsConnected(true);
        } catch (error) {
            setIsConnected(false);
        }
    };

    const handleCollectionChange = (selectedOption) => {
        setContractAddr(selectedOption.value);
        setChecked(false);
    };
    return (
        <div className="flex h-screen w-screen justify-center bg-[#ffedd5]">
            <div className="flex h-screen bg-[#fed7aa] justify-center text-grey items-center w-4/5">
                {haveMetamask ? (
                    <div className="flex w-full h-full items-center justify-center">
                        {isConnected ? (
                            <div className="flex flex-col w-full h-4/5 items-center justify-center">
                                <div className="flex bg-green-400 py-2 px-5 mt-3">
                                    <p>Connected</p>
                                </div>
                                <div className="h1">
                                    Wallet Address: {accountAddress.slice(0, 4)}
                                    ...
                                    {accountAddress.slice(38, 42)}
                                </div>
                                <div>
                                    <h3>Wallet Balance:{accountBalance}</h3>
                                </div>

                                <Select
                                    options={options}
                                    onChange={handleCollectionChange}
                                />
                                <button
                                    className="flex bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded items-center mt-2"
                                    onClick={checkNFTOwnership}
                                >
                                    <div>Check Ownership</div>
                                </button>
                                {checked ? (
                                    <div>
                                        {haveNFT ? (
                                            <p>
                                                You hold an NFT of this
                                                collection.
                                            </p>
                                        ) : (
                                            <p>
                                                You do not an NFT of this
                                                collection.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                        {isConnected ? (
                            <></>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="mb-4 font-bold">
                                    Connect your wallet to check if you owns a
                                    asset
                                </div>
                                <button
                                    className="flex bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded items-center"
                                    onClick={connectWallet}
                                >
                                    <div>Connect with Metamask</div>
                                    <img
                                        src="MetaMask_Fox.png"
                                        className="object-scale-down h-12 w-12 ml-3"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Please Install MataMask</p>
                )}
            </div>
        </div>
    );
}

export default App;
