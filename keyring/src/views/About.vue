<template>
  <div class="about">
    <h1>Keyring generator for Polkadot/Substrate-like parachains accounts</h1> 
    <p>written in Vue.js & Typescript</p>
    <p>offline-first</p>
    <p><button @click="validateMnemonic">Validate Mnemonic</button> {{isValidMnemonic}}</p>
    <div class="field">
      <label class="label">name</label>
      <div class="control">
        <input class="input is-info" type="text" placeholder="new Account name">
      </div>
    </div>
    
    <p>mnemonic Seed</p>
    <div class="field has-addons">
      <!-- <label class="label">mnemonic Seed</label> -->
      <div class="control is-expanded">
        <input v-model="mnemonicGenerated" class="input is-info" type="text">
      </div>
      <div class="control">
        <button @click="mnemonicGenerate(); mainGenerateFromMnemonic()" class="button is-info">generate Mnemonic</button><br>  
      </div>
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
          <select v-model="keyringPairType" @change="mainGenerateFromMnemonic()">
            <option
              v-for="option in keyringPairTypes"
              v-bind:value="option.value"
              v-bind:key="option.value"
              :selected ="option.value == 'ed25519'">
              {{ option.text }}
            </option>
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
    <p>{{keyringPair}}</p>
    <p>{{keyringPairType}}</p>
    <p>{{meta}}</p>
    <Credits/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Credits from '@/components/Credits.vue'; // @ is an alias to /src

import Keyring from '@polkadot/keyring';
import stringToU8a from '@polkadot/util/string/toU8a';
import { mnemonicGenerate, mnemonicToSeed, mnemonicValidate } from '@polkadot/util-crypto';

@Component({
  components: {
    Credits,
  },
})
export default class About extends Vue {
  public aliceSeed: string = '//Alice';
  public keyring: any = '';
  public keyringPair: string = '';
  public keyringPairType: string = 'ed25519';
  public meta: string = '';
  public mnemonicGenerated: string = '';
  public isValidMnemonic: boolean = false;
  public mnemonic2Seed: any;
  public keyringPairTypes: object = [
    {text: 'Edwards (ed25519)', value: 'ed25519'},
    {text: 'Schnorrkel (sr25519)', value: 'sr25519'}];

  public mnemonicGenerate(): void {
    this.mnemonicGenerated = mnemonicGenerate();
    this.mnemonic2Seed = mnemonicToSeed(this.mnemonicGenerated);
  }

  public validateMnemonic(): void {
    this.isValidMnemonic = mnemonicValidate(this.mnemonicGenerated);
  }

  //   const ALICE_SEED = this.aliceSeed.padEnd(32, ' ');
  //   const pairAlice = this.keyring.addFromSeed(stringToU8a(ALICE_SEED));

  public mainGenerateFromMnemonic(): void {
    this.keyring = new Keyring();
    const pairAlice = this.keyring.addFromMnemonic(this.mnemonicGenerated, {}, this.keyringPairType);
    this.keyringPair = this.keyring.getPair(pairAlice.address).address;
  }

  public mounted() {
    this.mnemonicGenerate();
    this.mainGenerateFromMnemonic();
  }
}
</script>