<template>
  <div class="about">
    <h1>Keyring generator for Polkadot/Substrate-like parachains accounts</h1> 
    <p>written in Vue.js & Typescript</p>
    <p>offline-first</p>
    <div class="field">
      <label class="label">name</label>
      <div class="control">
        <input v-model="keyAccountName" class="input is-info" type="text" placeholder="new Account name">
      </div>
    </div>
    
    <p><strong>mnemonic Seed</strong></p>
    <div class="field has-addons">
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
        <input v-model="passwordKeystore" class="input is-info" type="password" placeholder="password" value="">
      </div>
      <p v-show="passwordKeystore < 1" class="help is-danger">password is mandatory</p>
    </div>

    <h3>Advanced creation options</h3>
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
        <input class="input is-info" type="text" placeholder="secret derivation path" disabled>
      </div>
    </div>

    <button @click="mainGenerateFromMnemonic()" class="button is-info">Generate Keyring</button>
    <button @click="saveKeystoreToJson()" class="button is-info">Save Account</button>
    <a @click="saveKeystoreToJson()" :disabled="passwordKeystore < 1" class="button is-info" :href='`data:${keystoreToDownload}`' :download="`${keyringPair}.json`">Download Account</a>
    <p>Created keyring pair from mnemonic address:</p>
    <p>{{keyringPair}}</p>
    <p>{{keyringPairType}}</p>
    <p>{{keystoreJson}}</p>
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
  public keyring: any = '';
  public keyringPair: string = '';
  public keyringPairType: string = 'ed25519';
  public keyAccountName: string = '';
  public meta: object = { name: '', tags: [], whenCreated: 0};
  public keystoreJson: object = {};
  public keystoreToDownload: string = '';
  public passwordKeystore: string = '';
  public mnemonicGenerated: string = '';

  public mnemonic2Seed: any;
  public keyringPairTypes: object = [
    {text: 'Edwards (ed25519)', value: 'ed25519'},
    {text: 'Schnorrkel (sr25519)', value: 'sr25519'}];

  public mnemonicGenerate(): void {
    this.mnemonicGenerated = mnemonicGenerate();
    this.mnemonic2Seed = mnemonicToSeed(this.mnemonicGenerated);
  }
  //   const ALICE_SEED = this.aliceSeed.padEnd(32, ' ');
  //   const pairAlice = this.keyring.addFromSeed(stringToU8a(ALICE_SEED));
  public mainGenerateFromMnemonic(): void {
    const isValidMnemonic = mnemonicValidate(this.mnemonicGenerated);
    if (isValidMnemonic) {
      this.keyring = new Keyring();
      this.meta = {
        name: this.keyAccountName,
        tags: [],
        whenCreated: Date.now() };
      const pairAlice = this.keyring.addFromMnemonic(this.mnemonicGenerated, this.meta, this.keyringPairType);
      this.keyringPair = this.keyring.getPair(pairAlice.address).address;
    }
  }

  public saveKeystoreToJson(): void {
    this.mainGenerateFromMnemonic();
    this.keystoreJson = this.keyring.toJson(this.keyringPair, this.passwordKeystore);
    this.keystoreToDownload = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.keystoreJson));
  }

  public mounted() {
    this.mnemonicGenerate();
    this.mainGenerateFromMnemonic();
  }
}
</script>