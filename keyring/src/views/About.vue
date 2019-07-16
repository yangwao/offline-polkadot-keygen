<template>
  <div class="about">
    <h1>Keyring generator for Polkadot/Substrate-like parachains accounts</h1>
    <p><button @click="validateMnemonic">Validate Mnemonic</button> {{isValidMnemonic}}</p>
    <div class="field">
      <label class="label">name</label>
      <div class="control">
        <input class="input" type="text" placeholder="new Account name">
      </div>
    </div>

    <div class="field">
      <label class="label">mnemonic Seed</label>
      <div class="control">
        <input v-model="mnemonicGenerated" class="input" type="text">
        
      </div>
      <button @click="mnemonicGenerate()" class="button is-info">generate Mnemonic</button><br>  
    </div>

    <div class="field">
      <label class="label">password</label>
      <div class="control">
        <input class="input is-info" type="text" placeholder="password" value="">
      </div>
      <p class="help is-danger">password is mandatory</p>
    </div>

    <div class="field">
      <label class="label">keypair crypto type</label>
      <div class="control">
        <div class="select">
          <select>
            <option>Edwards (ed25519)</option>
            <option>Schnorrkel (sr25519)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">secret derivation path</label>
      <div class="control">
        <input class="input is-info" type="text" placeholder="secret derivation path" value="">
      </div>
    </div>

    <button @click="mainGenerateFromMnemonic()" class="button is-info">Generate Keyring</button>
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