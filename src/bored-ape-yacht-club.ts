import { log, ipfs, json } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent,
  baycToken as BaycTokenContract,
} from "../generated/baycToken/baycToken";
import {
  BoredApeToken,
  // BoredApeUser
} from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  /**
   * load ipfs of bayc
   */
  const baseHash = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";
  const ipfsURI = `ipfs.io/ipfs/${baseHash}/`;

  log.info("IPFS URL: {},{}", [ipfsURI, event.address.toHexString()]);

  /**
   * load the BAYC if it exists other wise generate new BAYC entity instance
   * can also use event.params.id.toHex()
   **/
  let entityToken = BoredApeToken.load(event.transaction.from.toHex());
  if (!entityToken) {
    entityToken = new BoredApeToken(event.transaction.from.toHex());
    entityToken.tokenID = event.params.tokenId;
    entityToken.createdAtTimestamp = event.block.timestamp;
    entityToken.owner = event.params.to.toHexString();
  }

  const baycTokenContractInstance = BaycTokenContract.bind(event.address);
  let baseURI = baycTokenContractInstance.baseURI();
  let contentURI = baycTokenContractInstance.tokenURI(event.params.tokenId);

  if (baseURI.includes("https://")) {
    baseURI = ipfsURI;
  } else {
    const newBaseURI = baseURI.replace("ipfs://", "ipfs.io/ipfs/");
    contentURI = `${newBaseURI}${event.params.tokenId.toString()}`;
  }

  /** Setting the content and base URI */
  entityToken.baseURI = baseURI;
  entityToken.contentURI = contentURI;

  /** fetch from IPFS */
  if (contentURI) {
    const data = ipfs.cat(baseHash);
    if (!data) return;

    const jsonData = json.fromBytes(data).toObject();
    if (jsonData) {
      const image = jsonData.get("image");
      if (image) {
        entityToken.imageURI = image.toString(); // you can convert this to dns gateway if you want
      }
    }
  }

  entityToken.save();

  /**
   * load the BAYC if it exists other wise generate new BAYC entity instance
   * can also use event.params.id.toHex()
   **/
  // let entityUser = BoredApeUser.load(event.transaction.from.toHex());
  // if (!entityUser) {
  //   entityUser = new BoredApeUser(event.transaction.from.toHex());
  // }

  // entityUser.save();
}
