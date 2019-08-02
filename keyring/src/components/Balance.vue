<template>
  <div class="balance">  
    
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { ApiPromise, WsProvider } from '@polkadot/api';

@Component({})
export default class Balance extends Vue {
  public balance: string = '';
  public person: string = '5DFwZivYX7hEjBsVH7KGYZYCJMtb75t2aBoeJnzLSLZGPLFn';
  public api: any = '';

  public async main(): Promise<void> {
    // wss://poc3-rpc.polkadot.io/
    // wss://alex.unfrastructure.io/public/ws
    // wss://substrate-rpc.parity.io/
    // ws://127.0.0.1:9944
    const provider = new WsProvider('wss://poc3-rpc.polkadot.io/');

    this.api = await ApiPromise.create(provider);
    const [chain, nodeName, nodeVersion] = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.rpc.system.name(),
      this.api.rpc.system.version()
    ]);

    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
  }

  public async queryBalance(): Promise<void> {
    
    let previous = await this.api.query.balances.freeBalance(this.person);

    console.log(`${this.person} has a balance of ${previous}`);

    this.api.query.balances.freeBalance(this.person, (current: any) => {
    // Calculate the delta
    const change = current.sub(previous);

    // Only display positive value changes (Since we are pulling `previous` above already,
    // the initial balance change will also be zero)
    if (!change.isZero()) {
      previous = current;
      console.log(`New balance change of: ${change}`);
    }
  });
  }

  public async mounted(): Promise<void> {
    await this.main();
    this.queryBalance();
  }
}
</script>