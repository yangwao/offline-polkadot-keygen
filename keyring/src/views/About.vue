<template>
  <div class="about">
    <h1>Keyring generator for Polkadot/Substrate-like parachains accounts</h1>
    <input v-model="mnemonicGenerated">
    <p>{{mnemonicGenerated}}</p>
    <button @click="mnemonicGenerate()">Generate Mnemonic</button><br>
    <p><button @click="validateMnemonic">Validate Mnemonic</button> {{isValidMnemonic}}</p>
    <!-- <p>{{this.mnemonic2Seed}}</p> -->
    <!-- <input v-model="aliceSeed"> -->
    <!-- <button @click="mainGenerate()">Generate Keyring</button> -->
    <button @click="mainGenerateFromMnemonic()">Generate Keyring</button>
    <p>Created keyring pair from mnemonic address:</p>
    <p>{{keyRingPair}}</p>
    <p>{{keyRingPairType}}</p>
    <p>{{meta}}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Keyring from '@polkadot/keyring';
import stringToU8a from '@polkadot/util/string/toU8a';
import { mnemonicGenerate, mnemonicToSeed, mnemonicValidate } from '@polkadot/util-crypto';

@Component
export default class About extends Vue {
  public aliceSeed: string = '//Alice';
  public keyring: any = '';
  public keyRingPair: string = '';
  public keyRingPairType: string = '';
  public meta: string = '';
  public mnemonicGenerated: string = '';
  public isValidMnemonic: boolean = false;
  public mnemonic2Seed: any;

  public mnemonicGenerate(): void {
    this.mnemonicGenerated = mnemonicGenerate();
    this.mnemonic2Seed = mnemonicToSeed(this.mnemonicGenerated);
  }

  public validateMnemonic(): void {
    this.isValidMnemonic = mnemonicValidate(this.mnemonicGenerated);
  }

  // public mainGenerate(): void {
  //   // Create account seed for Alice
  //   const ALICE_SEED = this.aliceSeed.padEnd(32, ' ');
  //   // Create an instance of the Keyring
  //   this.keyring = new Keyring();
  //   // Create pair and add Alice to keyring pair dictionary (with account seed)
  //   const pairAlice = this.keyring.addFromSeed(stringToU8a(ALICE_SEED));
  //   this.keyRingPair = this.keyring.getPair(pairAlice.address).address;
  //   this.keyRingPairType = this.keyring._type;
  //   }

  public mainGenerateFromMnemonic(): void {
    this.keyring = new Keyring();
    const pairAlice = this.keyring.addFromMnemonic(this.mnemonicGenerated);
    this.keyRingPair = this.keyring.getPair(pairAlice.address).address;
    this.keyRingPairType = this.keyring._type;
  }
}
</script>