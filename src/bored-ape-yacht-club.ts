import { log } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/BoredApeYachtClub/BoredApeYachtClub";
import { BoredApeToken, BoredApeUser } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  /**
   * load ipfs of bayc
   */
  const baseHash = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";
  const ipfsURI = `ipfs.io/ipfs/${baseHash}/`;

  /**
   * load the BAYC if it exists other wise generate new BAYC entity instance
   * can also use event.params.id.toHex()
   **/
  let entityToken = BoredApeToken.load(event.transaction.from.toHex());
  if (!entityToken) {
    entityToken = new BoredApeToken(event.transaction.from.toHex());
  }

  // entity.owner = event.params.to.toHex();

  /**
   * load the BAYC if it exists other wise generate new BAYC entity instance
   * can also use event.params.id.toHex()
   **/
  let entityUser = BoredApeUser.load(event.transaction.from.toHex());
  if (!entityUser) {
    entityUser = new BoredApeUser(event.transaction.from.toHex());
  }

  entityUser.save();
}
