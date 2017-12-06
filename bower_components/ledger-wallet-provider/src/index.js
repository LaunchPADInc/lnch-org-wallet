import HookedWalletSubprovider from "web3-provider-engine/subproviders/hooked-wallet.js";
import LedgerWallet from "./LedgerWallet";
import Web3 from "web3";
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";

export default async function (opts) {
    if (!opts) {
      opts = {};
    }

    const ledger = new LedgerWallet(
      {
        onSubmit: opts.onSubmit,
        onSigned: opts.onSigned,
        getChainID: opts.getChainID
      }
    );
    await ledger.init();
    const LedgerWalletSubprovider = new HookedWalletSubprovider(ledger);

    // This convenience method lets you handle the case where your users browser doesn't support U2F
    // before adding the LedgerWalletSubprovider to a providerEngine instance.
    LedgerWalletSubprovider.isSupported = ledger.isU2FSupported;
    LedgerWalletSubprovider.ledger = ledger;

    var engine = new ProviderEngine();
    var web3 = new Web3(engine);
    engine.addProvider(LedgerWalletSubprovider);
    // Node optional, not used on offline mode
    if (opts.rpcUrl) {
      engine.addProvider(new RpcSubprovider(
        {
          rpcUrl: opts.rpcUrl
        }
      ));
    }
    engine.start();
    return web3;
};
