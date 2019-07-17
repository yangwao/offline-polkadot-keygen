<template>
  <div class="about">
    <div class="intro">
      <About/>
    </div>
    <div class="field">
      <label class="label">name</label>
      <div class="control">
        <input v-model="keyAccountName" 
        class="input is-info" 
        type="text" 
        placeholder="new account name">
      </div>
    </div>

    <div class="field">
      <label class="label">tags</label>
      <div class="control">
        <input v-model="accountTags" 
        class="input is-info" 
        type="text" 
        placeholder="tags, comma separated">
      </div>
    </div>
    
    <p><strong>mnemonic seed</strong></p>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input v-model="mnemonicGenerated" 
          @input="isValidMnemonic()" 
          class="input " 
          v-bind:class="{ 'is-danger': !validMnemonic }"  
          type="text">
      </div>
      <div class="control">
        <button @click="mnemonicGenerate(); mainGenerateFromMnemonic()" 
        class="button is-info">↻ mnemonic</button><br>  
      </div>
    </div>

    <div class="field">
      <label class="label">password</label>
      <div class="control">
        <input v-model="passwordKeystore" 
        class="input" 
        v-bind:class="{ 'is-danger': !passwordKeystore}" 
        type="password" 
        placeholder="password">
      </div>
      <p v-show="passwordKeystore.length < 1" class="help is-danger">password is mandatory</p>
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
              :selected ="option.value == 'sr25519'">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">secret derivation path</label>
      <div class="control">
        <input class="input" 
          type="text" 
          placeholder="secret derivation path" 
          disabled>
      </div>
    </div>

    <p><strong>raw seed - experimental</strong></p>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input v-model="keyringPairHexSeed"
          class="input"   
          type="text"
          disabled>
      </div>
      <div class="control">
        <button @click="mainGenerateFromHex()" 
        class="button is-info" disabled>Preview from raw seed</button><br>  
      </div>
    </div>

    <button @click="saveKeystoreToJson()" class="button is-info">Preview Account</button>
    <a @click="saveKeystoreToJson()" 
      :disabled="passwordKeystore.length < 1" 
      class="button is-info" 
      :href='`data:${keystoreToDownload}`' 
      :download="`${keyringPair}.json`">Download Account</a>
    <br>
    <br>
    <p>Created keyring pair from mnemonic address:</p>    
    <li>Public Key: {{keyringPairPubKey}}</li>
    <li>Address (SS58): {{keyringPair}}</li>
    <li>Keystore: {{keystoreJson}}</li>
    <Credits/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import About from '@/components/About.vue';
import Credits from '@/components/Credits.vue';

import Keyring from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import { u8aToHex, hexToU8a } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToSeed, mnemonicValidate } from '@polkadot/util-crypto';

@Component({
  components: {
    About,
    Credits,
  },
})
export default class Subkey extends Vue {
  public init: boolean = false;
  public keyring: any = '';
  public keyringPair: string = '';
  public keyringPairType: string = 'sr25519';
  public keyringPairPubKey: string = '';
  public accountTags: string = '';
  public keyAccountName: string = '';
  public keyringPairHexSeed: string = '';
  public meta: object = { name: '', tags: [], whenCreated: 0};
  public keystoreJson: object = {};
  public keystoreToDownload: string = '';
  public passwordKeystore: string = '';
  public mnemonicGenerated: string = '';
  public validMnemonic: boolean = false;
  public keyringPairTypes: object = [
    {text: 'Edwards (ed25519)', value: 'ed25519'},
    {text: 'Schnorrkel (sr25519)', value: 'sr25519'}];

  public mnemonicGenerate(): void {
    this.mnemonicGenerated = mnemonicGenerate();
  }
  // public generateSeedFromMnemonic(): void {
  //   this.keyringPairHexSeed = u8aToHex(mnemonicToSeed(this.mnemonicGenerated));
  // }
  public isValidMnemonic(): void {
    this.validMnemonic = mnemonicValidate(this.mnemonicGenerated);
  }
  public mainGenerateFromHex(): void {
    this.keyring = new Keyring();
    const pairAlice = this.keyring.addFromSeed(hexToU8a(this.keyringPairHexSeed), this.meta, this.keyringPairType);
    this.keyringPair = this.keyring.getPair(pairAlice.address).address;
    this.keyringPairPubKey = u8aToHex(this.keyring.getPair(pairAlice.address).publicKey);
  }

  public mainGenerateFromMnemonic(): void {
    this.isValidMnemonic();
    if (this.validMnemonic) {
      this.keyring = new Keyring();
      this.meta = {
        name: this.keyAccountName,
        tags: this.accountTags.split(','),
        whenCreated: Date.now() };
      const pairAlice = this.keyring.addFromMnemonic(this.mnemonicGenerated, this.meta, this.keyringPairType);
      this.keyringPair = this.keyring.getPair(pairAlice.address).address;
      this.keyringPairPubKey = u8aToHex(this.keyring.getPair(pairAlice.address).publicKey);
    }
  }

  public saveKeystoreToJson(): void {
    this.mainGenerateFromMnemonic();
    this.keystoreJson = this.keyring.toJson(this.keyringPair, this.passwordKeystore);
    this.keystoreToDownload = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.keystoreJson));
  }

  public async mountWasmCrypto(): Promise<void> {
    await waitReady();
    this.mnemonicGenerate();
    this.mainGenerateFromMnemonic();
    this.init = true;
  }

  public mounted(): void {
    this.mountWasmCrypto();
  }
}
</script>
<style scoped lang="scss">
.intro {
  padding: 80px 0 80px;
}
</style>