import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useState, useMemo } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../lib/const";
import { abi } from "../lib/contract-abi";

import { Button, Input, Chip } from "@nextui-org/react";

export default function IndexPage() {
  const { isConnected } = useAccount();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validationState = useMemo(() => {
    if (value === "") return undefined;
    return value.length > 12 ? "valid" : "invalid";
  }, [value]);

  const mintNFT = async () => {
    if (value.length > 12) {
      //Set Loading to True
      setLoading(true);
      //@ts-ignore
      const provider = new ethers.providers.Web3Provider(
        //@ts-ignore
        window.ethereum as ethers.providers.ExternalProvider
      );
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      console.log({ contract });

      //@ts-ignore
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Get the signer from the provider
      const signer = provider.getSigner();
      console.log({ signer });
      console.log({ contract });

      try {
        //Mint NFT
        const txDetails = await contract.connect(signer).mintNFT(value);
        console.log(txDetails);
      } catch (err: any) {
        console.log(err);
        setError("An Error occured");
      } finally {
        setLoading(false);
      }
    }
  };
  // Wallet Not Connected
  if (!isConnected) {
    return (
      <div className="flex flex-col gap-6 justify-center items-center h-screen">
        <div className="bg"></div>
        <h1 className="text-3xl text-center font-extrabold">
          Please connect your <br /> wallet to continue
        </h1>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-center h-screen">
      {error.length > 0 && (
        <Chip size="lg" color="danger" onClose={() => setError("")}>
          Could not Mint NFT
        </Chip>
      )}
      <h1 className="text-2xl text-white font-normal">Mint NFT with PassKey</h1>
      <ConnectButton />
      <Input
        isRequired
        label="PassKey"
        placeholder="Enter the secret passkey"
        value={value}
        onValueChange={setValue}
        className="max-w-xs"
        color={validationState === "invalid" ? "danger" : "default"}
        errorMessage={
          validationState === "invalid" && "Please enter a valid passkey"
        }
        validationState={validationState}
      />
      <Button color="primary" onClick={mintNFT} isLoading={loading}>
        Mint
      </Button>
    </div>
  );
}
