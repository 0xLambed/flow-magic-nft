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

export async function getOwnedNFTs() {
  const result = await flowUtils.runScript(cadence.scripts.get_owned_NFTs);
  return result;
}

/*
    ----------------------------- Transactions -----------------------------
*/

export async function setupProjectCollections() {
  const result = await flowUtils.runTransaction(
    cadence.transactions.setup_project_collections,
    []
  );
  return result;
}
