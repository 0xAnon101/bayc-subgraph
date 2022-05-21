import { BigInt, Entity } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/BoredApeYachtClub/BoredApeYachtClub";
import { BoredApeYachtClub } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let entity = BoredApeYachtClub.load(event.transaction.from.toHex());
  if (!entity) {
    entity = new BoredApeYachtClub(event.transaction.from.toHex());
  }

  entity.save();
}
