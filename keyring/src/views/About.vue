<template>
  <div class="about">
    <h1>Keyring generator for Polkadot/Substrate-like parachains accounts</h1>
    <button @click="mainGenerate()">Generate Keyring</button>
    <input v-model="aliceSeed">
    <p>Created keyring pair for Alice with address:</p>
    <p>{{keyRingPair}}</p>
    <p>{{keyRingPairType}}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Keyring from '@polkadot/keyring';
import stringToU8a from '@polkadot/util/string/toU8a';

@Component
export default class About extends Vue {
  public aliceSeed: string = '//Alice';
  public keyring: any = '';
  public keyRingPair: string = '';
  public keyRingPairType: string = '';

  public mainGenerate(): void {
    // Create account seed for Alice
    const ALICE_SEED = this.aliceSeed.padEnd(32, ' ');

    // Create an instance of the Keyring
    this.keyring = new Keyring();

    // Create pair and add Alice to keyring pair dictionary (with account seed)
    const pairAlice = this.keyring.addFromSeed(stringToU8a(ALICE_SEED));

    this.keyRingPair = this.keyring.getPair(pairAlice.address).address;
    this.keyRingPairType = this.keyring._type;
    }
  }
</script>