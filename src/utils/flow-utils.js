const fcl = require("@onflow/fcl");
const cadence = require("./cadence.json");
const { send } = require("@onflow/transport-grpc");
const { Magic } = require("magic-sdk");
const { FlowExtension } = require("@magic-ext/flow");
const fclConfig = fcl.config();

// Magic owner
export const magic = new Magic("pk_live_06D5F65BB9CDD2F0", {
  extensions: [
    new FlowExtension({
      rpcUrl: "https://access-testnet.onflow.org",
      network: "testnet",
    }),
    // OIDC support
    // new OpenIdExtension()
  ],
});

Object.keys(cadence.vars[process.env.REACT_APP_FLOW_NETWORK]).forEach(
  (contractAddressKey) => {
    fclConfig.put(
      contractAddressKey,
      cadence.vars[process.env.REACT_APP_FLOW_NETWORK][contractAddressKey]
    );
  }
);

fclConfig
  .put("env", "testnet")
  .put("accessNode.api", "https://access-testnet.onflow.org") // Configure FCL's Access Node
  .put("sdk.transport", send);

// similar to evm provider
export const AUTHORIZATION_FUNCTION = magic.flow.authorization;

// -----------------------------------------------------------------------
// Generic Script Runner
// -----------------------------------------------------------------------
export async function runScript(script, args) {
  return fcl
    .send([fcl.script(script), fcl.args(args)])
    .then(fcl.decode)
    .catch((e) => {
      throw e;
    });
}

// -----------------------------------------------------------------------
// Generic Transaction Runner
// -----------------------------------------------------------------------
export async function runTransaction(transaction, args) {
  try {
    const getReferenceBlock = async () => {
      const response = await fcl.send([fcl.getLatestBlock()]);
      const data = await fcl.decode(response);
      return data.id;
    };
    var transactionId = await fcl
      .send([
        fcl.transaction`import NonFungibleToken from 0x631e88ae7f1d7c20
        import MetadataViews from 0x631e88ae7f1d7c20
        import FungibleToken from 0x9a0766d93b6608b7
        import FlowToken from 0x7e60df042a9c0868
        import NewFunThing from 0xcbf10523da1a9ee9
        import NewFunThingPack from 0xcbf10523da1a9ee9
        
        
        transaction() {
            
            prepare(acct: AuthAccount) {
                if acct.borrow<&NewFunThing.Collection>(from: NewFunThing.CollectionStoragePath) == nil {
                    let collection <- NewFunThing.createEmptyCollection()
                    acct.save(<-collection, to: NewFunThing.CollectionStoragePath)
                }
                if acct.getCapability<&NewFunThing.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, NewFunThing.NewFunThingCollectionPublic, MetadataViews.ResolverCollection}>(NewFunThing.CollectionPublicPath).borrow() == nil {
                    acct.link<&NewFunThing.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, NewFunThing.NewFunThingCollectionPublic, MetadataViews.ResolverCollection}>(NewFunThing.CollectionPublicPath, target: NewFunThing.CollectionStoragePath)
                }
        
                if acct.borrow<&NewFunThingPack.Collection>(from: NewFunThingPack.CollectionStoragePath) == nil {
                    let collection <- NewFunThingPack.createEmptyCollection()
                    acct.save(<-collection, to: NewFunThingPack.CollectionStoragePath)
                }
                if acct.getCapability<&NewFunThingPack.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, NewFunThingPack.PackCollectionPublic, MetadataViews.ResolverCollection}>(NewFunThingPack.CollectionPublicPath).borrow() == nil {
                    acct.link<&NewFunThingPack.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, NewFunThingPack.PackCollectionPublic, MetadataViews.ResolverCollection}>(NewFunThingPack.CollectionPublicPath, target: NewFunThingPack.CollectionStoragePath)
                }
            }
            execute {
            }
        }`,
        // fcl.args(args),
        fcl.ref(await getReferenceBlock()),
        fcl.payer(AUTHORIZATION_FUNCTION), // current user is responsible for paying for the transaction
        fcl.proposer(AUTHORIZATION_FUNCTION), // current user acting as the nonce
        fcl.authorizations([AUTHORIZATION_FUNCTION]), // current user will be first AuthAccount
        fcl.limit(9999), // set the compute limit
      ])
      .then(fcl.decode);
    return await fcl.tx(transactionId).onceSealed();
  } catch (error) {
    const errorLink = `${flowScanLink(
      await fcl.config().get("env"),
      transactionId
    )}`;
    console.error(errorLink, error);
    throw [errorLink, error];
  }
}

export async function getTransactionStatus(transactionId) {
  return fcl
    .send([fcl.getTransactionStatus(transactionId)])
    .then(fcl.decode)
    .catch((e) => {
      throw e;
    });
}

function flowScanLink(env, txId) {
  if (env === "testnet") {
    return `https://testnet.flowscan.org/transaction/${txId}`;
  } else {
    return `https://flowscan.org/transaction/${txId}`;
  }
}
