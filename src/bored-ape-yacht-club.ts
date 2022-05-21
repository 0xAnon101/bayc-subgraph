import { BigInt, Entity } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/BoredApeYachtClub/BoredApeYachtClub";
import { BoredApeYachtClub } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let entity = BoredApeYachtClub.load(event.transaction.from.toHex());
  if (!entity) {
    entity = new BoredApeYachtClub(event.transaction.from.toHex());
  }

  /**
   * load ipfs of bayc
   */

  const baseHash = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";
  const ipfsURI = `ipfs.io/ipfs/${baseHash}/`;

  entity.save();
}
