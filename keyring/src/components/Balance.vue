<template>
  <div class="balance">  
    <div class="columns">
      <div class="column">
        Chain: {{chain}}<br>
        NodeName: {{nodeName}} v{{nodeVersion}}
      </div>
    </div>
    <div class="columns">
      <div class="column">
        Address: {{person}}<br>
        Balance: {{balance}}<br>
        Change: {{change}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { ApiPromise, WsProvider } from '@polkadot/api';

@Component({})
export default class Balance extends Vue {
  public balance: string = '';
  public change: any = '';
  public chain: any = '';
  public nodeName: any = '';
  public nodeVersion: any = '';
  public person: string = '5DFwZivYX7hEjBsVH7KGYZYCJMtb75t2aBoeJnzLSLZGPLFn';
  public api: any = '';

  public async main(): Promise<void> {
    // wss://poc3-rpc.polkadot.io/
    // wss://alex.unfrastructure.io/public/ws
    // wss://substrate-rpc.parity.io/
    // ws://127.0.0.1:9944
    const provider = new WsProvider('wss://poc3-rpc.polkadot.io/');

    this.api = await ApiPromise.create(provider);
    [this.chain, this.nodeName, this.nodeVersion] = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.rpc.system.name(),
      this.api.rpc.system.version(),
    ]);

    // console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
  }

  public async queryBalance(): Promise<void> {
    this.balance = await this.api.query.balances.freeBalance(this.person);
    this.api.query.balances.freeBalance(this.person, (current: any) => {
    // Calculate the delta
    this.change = current.sub(this.balance);

    // Only display positive value changes (Since we are pulling `previous` above already,
    // the initial balance change will also be zero)
    if (!this.change.isZero()) {
      this.balance = current;
    }
  });
  }

  public async mounted(): Promise<void> {
    await this.main();
    this.queryBalance();
  }
}
</script>