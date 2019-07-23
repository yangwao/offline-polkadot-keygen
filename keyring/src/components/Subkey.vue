<template>
  <div class="subkey">  
    <div class="tabs">
      <ul>
        <li 
          v-for="tab in tabs"
          v-bind:value="tab.name"
          v-bind:key="tab.name"
          @click="setActiveTab(tab.name)">
          <a>{{tab.displayName}}</a>
        </li>
      </ul>
    </div>
    
    <div v-show="displayActiveContent('create')">
    <field 
      v-model="keyAccountName"
      label="👤name"
      classList="input is-info"
      placeholder="new account name" />

    <field 
      v-model="accountTags"
      label="🏷 tags"
      classList="input is-info"
      placeholder="tags, comma separated" />
    
    <p><strong>🧠 mnemonic seed</strong></p>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input v-model="mnemonicGenerated" 
          @input="validateMnemonic(); mainGenerateFromMnemonic()" 
          class="input" 
          v-bind:class="{ 'is-danger': !isValidMnemonic }"  
          type="text">
      </div>
      <div class="control">
        <button @click="mnemonicGenerate(); mainGenerateFromMnemonic()" 
        class="button is-info">↻ mnemonic</button><br>  
      </div>
    </div>

    <field 
      v-model="passwordKeystore"
      label="🔑 password"
      classList="input"
      type="password"
      placeholder="password" />
    <p v-show="passwordKeystore.length < 1" class="help is-danger">password is mandatory</p>

    <h3>Advanced creation options</h3>
    <div class="columns">
      <div class="column is-6 is-offset-3">
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

    <p><strong>raw hex seed - experimental</strong></p>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input v-model="hexSeed"
          @input="isHexSeed()"
          class="input"   
          type="text">
      </div>
      <div class="control">
        <button @click="mainGenerateFromRawSeed()" 
        class="button is-info"
        :disabled="!isValidRawSeed"
        >from hex seed</button><br>  
      </div>
    </div>

    <div class="columns">
      <div class="column is-10 is-offset-1">
        <br>
        <a @click="saveKeystoreToJson()" 
          :disabled="passwordKeystore.length < 1" 
          class="button is-info" 
          :href='`data:${keystoreToDownload}`' 
          :download="`${keyringPair}.json`">💾 Download Account</a>
        <br><br>
        <p>Created keyring pair</p>    
        <li>Public Key: {{keyringPairPubKey}}</li>
        <li>Address (SS58): {{keyringPair}}</li>
      </div>
    </div>
    </div>

    <div v-show="displayActiveContent('sign')">
      <field 
        v-model="toSign.data"
        @input="signData()"
        label="data to 🔑sign"
        classList="input is-info"
        :disabled="keyringPairType !== 'sr25519'" />

      <field 
        v-model="toSign.signature"
        label="generated signature (only for sr25519)"
        classList="input"
        :disabled="true" />
    </div>

    <div v-show="displayActiveContent('verify')">
      <field 
        v-model="toVerify.data"
        label="signed data"
        @input="verifySignature()"
        classList="input is-info"
        :disabled="keyringPairType !== 'sr25519'" />

      <field
        v-model="toVerify.signature"
        label="signature (only for sr25519)"
        @input="verifySignature()"
        classList="input is-info"
        :disabled="keyringPairType !== 'sr25519'" />
      <p v-show="isValidSignature" class="help is-success">signature is valid</p>
    </div>
    
    <br>
    <a @click="saveKeystoreToJson(); showKeystore = !showKeystore" 
          class="button is-info">👁 Preview Account</a><br><br>
    <p v-show="showKeystore">Keystore: {{keystoreJson}}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import field from '@/components/Field.vue';

import Keyring from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import { isHex, u8aToHex, hexToU8a, stringToU8a } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToSeed, mnemonicValidate } from '@polkadot/util-crypto';
import { naclVerify, schnorrkelVerify } from '@polkadot/util-crypto';

@Component({
  components: {
    field,
  },
})
export default class Subkey extends Vue {
  public tabs: object = [
    {
      name: 'create',
      displayName: 'Create Account',
    },
    // {
    //   name: 'load',
    //   displayName: '~Load Account~'
    // },
    {
      name: 'sign',
      displayName: 'Sign data',
    },
    {
      name: 'verify',
      displayName: 'Verify Signature',
    },
  ];
  public activeTabName: string = 'create';
  public keyring: any = '';
  public keyringPair: string = '';
  public keyringPairType: string = 'sr25519';
  public keyringPairPubKey: string = '';
  public accountTags: string = '';
  public keyAccountName: string = '';
  public passwordKeystore: string = '';
  public hexSeed: string = '';
  public keystoreJson: object = {};
  public keystoreToDownload: string = '';
  public mnemonicGenerated: string = '';
  public isValidMnemonic: boolean = false;
  public isValidRawSeed: boolean = false;
  public showKeystore: boolean = false;
  public meta: object = { name: '', tags: [], whenCreated: 0};
  public keyringPairTypes: object = [
    {text: 'Edwards (ed25519)', value: 'ed25519'},
    {text: 'Schnorrkel (sr25519)', value: 'sr25519'}];
  public isValidSignature: boolean = false;
  public signedData: string = '';
  public currentPair: any = '';
  public toVerify = { data: '' as string, signature: '' as string };
  public toSign = { data: '' as string, signature: '' as string };

  public setActiveTab(name: string): void {
    this.activeTabName = name;
  }

  public displayActiveContent(name: string): boolean {
    return this.activeTabName === name;
  }

  public signData(): void {
    this.signedData = u8aToHex(
      this.currentPair.sign(stringToU8a(this.toSign.data)));
        // isHex
        //   ? hexToU8a(this.toSign.data)
        //   : stringToU8a(this.toSign.data)

    this.toSign.signature = this.signedData;
  }

  public mnemonicGenerate(): void {
    this.mnemonicGenerated = mnemonicGenerate();
  }

  public isHexSeed(): boolean {
    this.isValidRawSeed = isHex(this.hexSeed) && this.hexSeed.length === 66;
    return isHex(this.hexSeed) && this.hexSeed.length === 66;
  }

  public verifySignature(): void {
    if (isHex(this.toVerify.signature)) {
      this.isValidSignature = schnorrkelVerify(this.toVerify.data,
        this.toVerify.signature,
        this.keyringPairPubKey);
    }
  }
  public validateMnemonic(): void {
    this.isValidMnemonic = mnemonicValidate(this.mnemonicGenerated);
  }

  public mainGenerateFromRawSeed(): void {
    this.keyring = new Keyring();
    const pairAlice = this.keyring.addFromSeed(hexToU8a(this.hexSeed), this.meta, this.keyringPairType);
    this.keyringPair = this.keyring.getPair(pairAlice.address).address;
    this.keyringPairPubKey = u8aToHex(this.keyring.getPair(pairAlice.address).publicKey);
  }

  public mainGenerateFromMnemonic(): void {
    this.validateMnemonic();
    if (this.isValidMnemonic) {
      this.keyring = new Keyring();
      this.meta = {
        name: this.keyAccountName,
        tags: this.accountTags.split(','),
        whenCreated: Date.now() };
      const pairAlice = this.keyring.addFromMnemonic(this.mnemonicGenerated, this.meta, this.keyringPairType);
      this.keyringPair = this.keyring.getPair(pairAlice.address).address;
      this.keyringPairPubKey = u8aToHex(this.keyring.getPair(pairAlice.address).publicKey);
      this.currentPair = this.keyring.getPair(pairAlice.address);
    }
  }

  public saveKeystoreToJson(): void {
    this.keystoreJson = this.keyring.toJson(this.keyringPair, this.passwordKeystore);
    this.keystoreToDownload = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.keystoreJson));
  }

  public async mountWasmCrypto(): Promise<void> {
    await waitReady();
    this.mnemonicGenerate();
    this.mainGenerateFromMnemonic();
  }

  public mounted(): void {
    this.mountWasmCrypto();
  }
}
</script>