import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import { magic } from "./utils/flow-utils";
import "./styles.css";
import { setupProjectCollections } from "./utils/fcl-helper";

// Graffle owner
// fcl.config().put("accessNode.api", "https://access-testnet.onflow.org");
// fcl
//   .config()
//   .put(
//     "challenge.handshake",
//     "http://access-001.devnet9.nodes.onflow.org:8000"
//   );

// START FROM STEP 11
export default function App() {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicAddress, setPublicAddress] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
  const [message, setMessage] = useState("");

  const login = async () => {
    // STEP 12
    // with OIDC
    /* 
      await magic.openid.loginWithOIDC({
        jwt: myJWT
      });
    */
    await magic.auth.loginWithMagicLink({ email });
    // STEP 15 user has wallet
    setIsLoggedIn(true);
    // get user public address
    try {
      // STEP 17 get user wallet
      const userInfo = await magic.user.getMetadata();
      setPublicAddress(userInfo.publicAddress);
      setUserMetadata(userInfo);
    } catch (e) {
      // EDGE CASE
      // user is not logged in, get OIDC and login again
      console.log(e);
    }
  };

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
  };

  // Graffle owner
  // const verify = async () => {
  //   // STEP 21/23 Can optionally show signing UX or just send transaction
  //   try {
  //     const getReferenceBlock = async () => {
  //       const response = await fcl.send([fcl.getLatestBlock()]);
  //       const data = await fcl.decode(response);
  //       return data.id;
  //     };

  //     console.log("SENDING TRANSACTION");
  //     setVerifying(true);
  //     var response = await fcl.send([
  //       fcl.transaction`
  //         transaction {
  //           var acct: AuthAccount

  //           prepare(acct: AuthAccount) {
  //             self.acct = acct
  //           }

  //           execute {
  //             log(self.acct.address)
  //           }
  //         }
  //       `,
  //       fcl.ref(await getReferenceBlock()),
  //       fcl.proposer(AUTHORIZATION_FUNCTION),
  //       fcl.authorizations([AUTHORIZATION_FUNCTION]),
  //       fcl.payer(AUTHORIZATION_FUNCTION),
  //       // gas limit fcl.limit(20)
  //     ]);
  //     console.log("TRANSACTION SENT");
  //     console.log("TRANSACTION RESPONSE", response);

  //     console.log("WAITING FOR TRANSACTION TO BE SEALED");
  //     var data = await fcl.tx(response).onceSealed();
  //     console.log("TRANSACTION SEALED", data);
  //     setVerifying(false);

  //     if (data.status === 4 && data.statusCode === 0) {
  //       setMessage("Congrats!!! STEP 24");
  //     } else {
  //       setMessage(`Oh No: ${data.errorMessage}`);
  //     }
  //   } catch (error) {
  //     console.error("FAILED TRANSACTION", error);
  //   }
  // };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="container">
          <h1>Please Login To Get 🏎 Pack</h1>
          <input
            type="email"
            name="email"
            required="required"
            placeholder="Enter your email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <button onClick={login}>Send</button>
        </div>
      ) : (
        <div>
          <div>
            <div className="container">
              <h1>Current user: {userMetadata.email}</h1>
              <button onClick={logout}>Logout</button>
            </div>
          </div>

          <div>
            <div className="container">
              <h2> Setup Collection</h2>
              <button onClick={setupProjectCollections}>Setup</button>
            </div>
          </div>
          <div className="container">
            <h1>Flow address</h1>
            <div className="info">{publicAddress}</div>
          </div>
          <div className="container">
            <h1>Verify Transaction</h1>
            {verifying ? (
              <div className="sending-status">STEP 19 display NFT to claim</div>
            ) : (
              ""
            )}
            <div className="info">
              <div>{message}</div>
            </div>
            <button
              id="btn-deploy"
              onClick={() =>
                console.log(
                  "commented out because this previous FCL version is so old"
                )
              }
            >
              STEP 20 CLAIM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
