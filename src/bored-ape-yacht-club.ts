import { log, ipfs, json, JSONValue } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent,
  baycToken as BaycTokenContract,
} from "../generated/baycToken/baycToken";
import { BoredApeToken, BoredApeUser } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  /**
   * load ipfs of bayc
   */
  let baseHash = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";
  let fullIPFSURI = "ipfs.io/ipfs/" + baseHash + "/";

  /**
   * load the BAYC entityif it exists other wise generate new BAYC entity instance
   **/
  let entityToken = BoredApeToken.load(event.params.tokenId.toString());
  if (!entityToken) {
    entityToken = new BoredApeToken(event.params.tokenId.toString());
    entityToken.tokenID = event.params.tokenId;
    entityToken.createdAtTimestamp = event.block.timestamp;
  }

  const baycTokenContractInstance = BaycTokenContract.bind(event.address);
  let baseURI = baycTokenContractInstance.baseURI();
  //  output - ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/10
  let contentURI = baycTokenContractInstance.tokenURI(event.params.tokenId);

  /**
   * rerouting to other dns link
   **/
  if (baseURI.includes("https")) {
    if (baseURI.includes("https")) {
      baseURI = fullIPFSURI;
    } else if (baseURI.includes("ipfs")) {
      let hash = baseURI.split("ipfs://").join("");
      baseURI = "ipfs.io/ipfs" + hash;
    }

    if (contentURI.includes("https")) {
      contentURI = fullIPFSURI + event.params.tokenId.toString();
    } else {
      let hash = contentURI.split("ipfs://").join("");
      contentURI = "ipfs.io/ipfs/" + hash + event.params.tokenId.toString();
    }

    /** Setting the content and base URI */
    entityToken.baseURI = baseURI;
    entityToken.contentURI = contentURI;

    /** fetch from IPFS */
    if (contentURI != "") {
      let hash = contentURI.split("ipfs.io/ipfs/").join("");
      let data = ipfs.cat(hash);
      if (!data) return;
      let value = json.fromBytes(data).toObject();
      if (data) {
        var image = value.get("image");
        if (image) {
          let h = image.toString();
          let imageHash = h.split("ipfs://").join("");
          entityToken.imageURI = "ipfs.io/ipfs/" + imageHash;
        }
        let attributes: JSONValue[] = [];
        let atts = value.get("attributes");
        if (atts) {
          attributes = atts.toArray();
        }
        for (let i = 0; i < attributes.length; i++) {
          let item = attributes[i].toObject();
          let trait: string = "";
          let t = item.get("trait_type");
          if (t) {
            trait = t.toString();
          }
          let value: string = "";
          let v = item.get("value");
          if (v) {
            value = v.toString();
          }
          if (trait == "Mouth") {
            entityToken.mouth = value;
          }
          if (trait == "Eyes") {
            entityToken.eyes = value;
          }
          if (trait == "Background") {
            entityToken.background = value;
          }
          if (trait == "Hat") {
            entityToken.hat = value;
          }
          if (trait == "Clothes") {
            entityToken.clothes = value;
          }
          if (trait == "Fur") {
            entityToken.fur = value;
          }
          if (trait == "Earring") {
            entityToken.earring = value;
          }
        }
      }
    }

    entityToken.owner = event.params.to.toHexString();
    entityToken.save();

    /**
     * load the BAYC if it exists other wise generate new BAYC entity instance
     * can also use event.params.id.toHex()
     **/
    let entityUser = BoredApeUser.load(event.params.to.toHexString());
    if (!entityUser) {
      entityUser = new BoredApeUser(event.params.to.toHexString());
    }
    entityUser.save();
  }
}
