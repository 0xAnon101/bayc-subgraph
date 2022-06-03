import { log, ipfs } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/BoredApeYachtClub/BoredApeYachtClub";
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

  log.info("IPFS URL: {}", [ipfsURI]);

  /**
   * load the BAYC if it exists other wise generate new BAYC entity instance
   * can also use event.params.id.toHex()
   **/
  let entityToken = BoredApeToken.load(event.transaction.from.toHex());
  if (!entityToken) {
    entityToken = new BoredApeToken(event.transaction.from.toHex());
    entityToken.tokenID = event.params.tokenId;

    // entityToken.owner = event.params.to.toHexString();
    entityToken.contentURI = `${ipfsURI}/${entityToken.tokenID}`;
    log.info("CONTENT URI {} ", [entityToken.contentURI]);
  }

  entityToken.save();

  // entity.owner = event.params.to.toHex();

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
