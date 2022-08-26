const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const flowUtils = require("./flow-utils");
const cadence = require("./cadence.json");

/*
    How do I know which transactions/scripts are available for use within the `cadence.scripts` and
    `cadence.transactions` variables??
        Check out the contracts package in the `cadence/transactions` folder, and the `cadence/scripts` folder
        The variables here are created by the filenames in that package, and compiled to JSON when you run
        `npm run prepare` within that package
    
    How do I know which arguments and types are needed for each script/transaction ??
        In the individual scripts/transactions files mentioned above, you can see the parameters required
        for each script. Also in the testing, there are example usages for all scripts and transactions
        that are possible, which can be used as a reference.
*/

/*
    ----------------------------- Scripts -----------------------------
*/

export async function getSaleInfo() {
  const result = await flowUtils.runScript(cadence.scripts.get_sale_info);
  return result;
}

export async function getGoatSaleInfo() {
  const result = await flowUtils.runScript(
    cadence.scripts.get_goated_goats_sale_info
  );
  return result;
}

export async function getFlowBalance(address) {
  const result = await flowUtils.runScript(cadence.scripts.get_flow_balance, [
    fcl.arg(address, t.Address),
  ]);
  return result;
}

export async function getOwnedGoatVouchers(address) {
  const result = await flowUtils.runScript(
    cadence.scripts.get_owned_goated_goat_vouchers,
    [fcl.arg(address, t.Address)]
  );
  return result;
}

export async function getOwnedPackVouchers(address) {
  const result = await flowUtils.runScript(
    cadence.scripts.get_owned_trait_pack_vouchers,
    [fcl.arg(address, t.Address)]
  );
  return result;
}

export async function getOwnedGoats(address) {
  const result = await flowUtils.runScript(
    cadence.scripts.get_owned_goated_goats,
    [fcl.arg(address, t.Address)]
  );
  return result;
}

export async function getOwnedPacks(address) {
  const result = await flowUtils.runScript(
    cadence.scripts.get_owned_goated_goat_trait_packs,
    [fcl.arg(address, t.Address)]
  );
  return result;
}

export async function getOwnedTraits(address) {
  const result = await flowUtils.runScript(
    cadence.scripts.get_owned_goated_goat_traits,
    [fcl.arg(address, t.Address)]
  );
  return result;
}

/*
    ----------------------------- Transactions -----------------------------
*/

export async function setupProjectCollections() {
  // fcl.authz refers to utilizing the current signed in user's authorization for signing the transaction

  console.log(fcl.authz);
  const result = await flowUtils.runTransaction(
    cadence.transactions.setup_project_collections,
    []
  );
  return result;
}

export async function setupGoatedVoucherCollection() {
  // fcl.authz refers to utilizing the current signed in user's authorization for signing the transaction
  const result = await flowUtils.runTransaction(
    cadence.transactions.setup_voucher_collections,
    [],
    fcl.authz
  );
  return result;
}
export async function batchPurchaseGoatVouchers(quantity) {
  // fcl.authz refers to utilizing the current signed in user's authorization for signing the transaction
  const result = await flowUtils.runTransaction(
    cadence.transactions.v2_batch_mint_goat_vouchers,
    [fcl.arg(quantity, t.UInt64)],
    fcl.authz
  );
  return result;
}

export async function batchPurchaseTraitVouchers(quantity) {
  // fcl.authz refers to utilizing the current signed in user's authorization for signing the transaction
  const result = await flowUtils.runTransaction(
    cadence.transactions.v2_batch_mint_pack_vouchers,
    [fcl.arg(quantity, t.UInt64)],
    fcl.authz
  );
  return result;
}
export async function redeemGoatVoucher(goatVoucherID) {
  // fcl.authz refers to utilizing the current signed in user's authorization for signing the transaction
  const result = await flowUtils.runTransaction(
    cadence.transactions.redeem_goat_voucher,
    [fcl.arg(goatVoucherID, t.UInt64)],
    fcl.authz
  );
  return result;
}

export async function redeemPackVoucher(packVoucherID) {
  // fcl.authz refers to utilizing the current signed in user's authorization for signing the transaction
  const result = await flowUtils.runTransaction(
    cadence.transactions.redeem_trait_pack_voucher,
    [fcl.arg(packVoucherID, t.UInt64)],
    fcl.authz
  );
  return result;
}

export async function redeemPack(packID) {
  // fcl.authz refers to utilizing the current signed in user's authorization for signing the transaction
  const result = await flowUtils.runTransaction(
    cadence.transactions.redeem_trait_pack,
    [fcl.arg(packID, t.UInt64)],
    fcl.authz
  );
  return result;
}

export async function updateGoatTraits(
  goatEditionId,
  traitsIdsToEquip,
  traitSlotsToUnequip
) {
  // fcl.authz refers to utilizing the current signed in user's authorization for signing the transaction
  const result = await flowUtils.runTransaction(
    cadence.transactions.update_goat_traits,
    [
      fcl.arg(goatEditionId, t.UInt64),
      fcl.arg(traitsIdsToEquip, t.Array(t.UInt64)),
      fcl.arg(traitSlotsToUnequip, t.Array(t.String)),
    ],
    fcl.authz
  );
  return result;
}
