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
      classList="input is-info"
      type="password"
      placeholder="password" />
    <p v-show="passwordKeystore.length < 1" class="help is-danger">
      password is mandatory</p>

    <h3>Advanced creation options</h3>
    
    <div class="columns">
      <div class="column is-12">
        <label class="label">keypair crypto type</label>
        <div class="field has-addons">
          <div class="control is-expanded">
            <div class="select is-fullwidth">
              <select v-model="pairType" @change="mainGenerateFromMnemonic()">
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
          <div class="control">
            <a @click="showAdvancedOptions = !showAdvancedOptions" 
              class="button is-info">🔩advanced options</a>
          </div>
        </div>
      </div>
    </div>

    <div v-show="showAdvancedOptions">
      <div class="field">
        <label class="label">secret derivation path</label>
        <div class="control">
          <input 
            class="input is-info" 
            type="text" 
            placeholder="'/<soft-key>//<hard-key>' The '/<soft-key>' and '//<hard-key>' maybe repeated and mixed" 
            v-model="derivePath"
            @input="generateKeyringFromSURI()">
        </div>
        <p v-show="deriveValidate(derivePath, pairType)" class="help is-danger">{{deriveValidate(derivePath, pairType)}}</p>
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
    </div>

    <div class="columns">
      <div class="column is-10 is-offset-1">
        <br>
        <a @click="saveKeystoreToJson()" 
          :disabled="passwordKeystore.length < 1" 
          class="button is-info" 
          :href='`data:${keystoreToDownload}`' 
          :download="`${keyringPairAddress}.json`">💾 Download Account</a>
      </div>
    </div>
    </div>
    
    <div v-show="displayActiveContent('load')">
      <div class="columns">
        <div class="column is-10 is-offset-1">
          <SubkeyFileLoad :accountToImport.sync="accountToImport" />
          <field 
            v-model="passwordKeystore"
            label="🔑 password"
            classList="input"
            type="password"
            placeholder="password" />
          <p v-show="passwordKeystore.length < 1" class="help is-danger">
            password is mandatory</p>
        </div>
      </div>
      <div class="columns">
        <div class="column is-10 is-offset-1">
          <a @click="importAccountFromJson"
          class="button is-info">📂 Import Account</a>
        </div>
      </div>
    </div>

    <div v-show="displayActiveContent('sign')">
      <field 
        v-model="toSign.data"
        @input="signData()"
        label="📜data to ✍️sign"
        classList="input is-info"
        placeholder="data you want to sign"
        :disabled="pairType !== 'sr25519'" />

      <field 
        v-model="toSign.signature"
        label="generated 🔏signature (sr25519 only)"
        classList="input"
        :disabled="true" />

      <field
        v-model="isHexData"
        label="hex input data"
        classList="input"
        disabled/>

    </div>

    <div v-show="displayActiveContent('verify')">
      <field 
        v-model="toVerify.data"
        label="📜🔏signed data"
        @input="verifySignature()"
        classList="input is-info"
        placeholder="insert your 🔏 signed data"
        :disabled="pairType !== 'sr25519'" />

      <field
        v-model="toVerify.signature"
        label="🔏signature (sr25519 only)"
        @input="verifySignature()"
        classList="input is-info"
        placeholder="will be green if signature is valid"
        :disabled="pairType !== 'sr25519'" />
      <p v-show="isValidSignature" class="help is-success">signature is valid</p>

      <field
        v-model="isHexSignedData"
        label="hex input data"
        classList="input"
        disabled/>

    </div>
    

    <br>
    <li>Public_Key {{keyringPairPubKey}}</li>
    <li>Address_SS58 {{keyringPairAddress}}</li>
    <br>
    <div class="columns">
      <div class="column is-5 is-offset-1">
        <a @click="saveKeystoreToJson(); showKeystore = !showKeystore" 
          class="button is-info">👁 Preview Account</a><br><br>    
      </div>
      <div class="column is-5">
        <a @click="flushMemory()"
          class="button is-black">🚽Flush 🧠 Memory</a>
      </div>
    </div>
    
    <p v-show="showKeystore">{{keystoreJson}}</p>
    
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import field from '@/components/Field.vue';

import Keyring from '@polkadot/keyring';
import createPair from '@polkadot/keyring/pair';
import { waitReady } from '@polkadot/wasm-crypto';
import { isHex, u8aToHex, hexToU8a, stringToU8a, u8aToString } from '@polkadot/util';
import { keyExtractPath, mnemonicGenerate, mnemonicToSeed,
  mnemonicValidate, schnorrkelVerify } from '@polkadot/util-crypto';
import SubkeyFileLoad from './SubkeyFileLoad.vue';

@Component({
  components: {
    field,
    SubkeyFileLoad,
  },
})
export default class Subkey extends Vue {
  public tabs: object = [
    {
      name: 'create',
      displayName: '✨Create',
    },
    {
      name: 'load',
      displayName: '📂Load',
    },
    {
      name: 'sign',
      displayName: '✍️Sign Data',
    },
    {
      name: 'verify',
      displayName: '🔏Verify Signature',
    },
  ];
  public showAdvancedOptions: boolean = false;
  public derivePath: string = '';
  public activeTabName: string = 'create';
  public keyring: any = '';
  public keyringPairAddress: string = '';
  public pairType: string = 'sr25519';
  public keyringPairPubKey: any = '';
  public accountTags: string = '';
  public keyAccountName: string = '';
  public passwordKeystore: string = '';
  public hexSeed: string = '';
  public isHexData: string = 'No';
  public isHexSignedData: string = 'No';
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
  public accountToImport: any = '';
  public restoredPair: any = '';

  // put me into component
  public setActiveTab(name: string): void {
    this.activeTabName = name;
  }

  public displayActiveContent(name: string): boolean {
    return this.activeTabName === name;
  }

  public importAccountFromJson(): void {
    // const json = JSON.parse(u8aToString(this.accountToImport));
    this.keyring.removePair(this.keyringPairAddress);
    const json = JSON.parse(this.accountToImport);
    this.keyringPairPubKey = this.keyring.decodeAddress(json.address, true);
    this.keyringPairAddress = this.keyring.encodeAddress(this.keyringPairPubKey);
    const type = Array.isArray(json.encoding.content) ? json.encoding.content[1] : 'ed25519';
    this.restoredPair = createPair(type,
      { publicKey: this.keyring.decodeAddress(json.address, true)},
      json.meta,
      hexToU8a(json.encoded));
    this.restoredPair.decodePkcs8(this.passwordKeystore);
    this.keyringPairPubKey = u8aToHex(this.keyringPairPubKey);
    this.keyring.addPair(this.restoredPair, this.passwordKeystore);
    this.currentPair = this.keyring.getPair(this.keyringPairAddress);
  }

  public signData(): void {
    this.isHexSignData();
    this.signedData = u8aToHex(
      this.currentPair.sign(
        isHex(this.toSign.data)
          ? hexToU8a(this.toSign.data)
          : stringToU8a(this.toSign.data)));
    this.toSign.signature = this.signedData;
  }
  public isHexSignData(): void {
    this.isHexData = isHex(this.toSign.data)
      ? 'Yes'
      : 'No';
  }

  public isHexSeed(): boolean {
    this.isValidRawSeed = isHex(this.hexSeed) && this.hexSeed.length === 66;
    return isHex(this.hexSeed) && this.hexSeed.length === 66;
  }

  public verifySignature(): void {
    this.isHexSignedDataF();
    if (isHex(this.toVerify.signature)) {
      this.isValidSignature = schnorrkelVerify(this.toVerify.data,
        this.toVerify.signature,
        this.keyringPairPubKey);
    }
  }

  public isHexSignedDataF(): void {
    this.isHexSignedData = isHex(this.toVerify.data)
      ? 'Yes'
      : 'No';
  }

  public mnemonicGenerate(): void {
    this.mnemonicGenerated = mnemonicGenerate();
  }

  public validateMnemonic(): void {
    this.isValidMnemonic = mnemonicValidate(this.mnemonicGenerated);
  }

  public mainGenerateFromRawSeed(): void {
    this.keyring = new Keyring();
    const pairAlice = this.keyring.addFromSeed(hexToU8a(this.hexSeed),
      this.meta, this.pairType);
    this.keyringPairAddress = this.keyring.getPair(pairAlice.address).address;
    this.keyringPairPubKey = u8aToHex(this.keyring.getPair(pairAlice.address).publicKey);
  }

  public mainGenerateFromMnemonic(): void {
    this.validateMnemonic();
    if (this.isValidMnemonic) {
      this.meta = {
        name: this.keyAccountName,
        tags: this.accountTags.split(','),
        whenCreated: Date.now() };
      // const pairAlice = this.keyring.addFromMnemonic(this.mnemonicGenerated,
      //   this.meta, this.pairType);
      const pairAlice = this.keyring.addFromUri(`${this.mnemonicGenerated}${this.derivePath}`,
        this.meta, this.pairType);
      this.keyringPairAddress = this.keyring.getPair(pairAlice.address).address;
      this.keyringPairPubKey = u8aToHex(this.keyring.getPair(pairAlice.address).publicKey);
      this.currentPair = this.keyring.getPair(pairAlice.address);
    }
  }

  // DRY
  public generateKeyringFromSURI(): void {
    this.meta = {
        name: this.keyAccountName,
        tags: this.accountTags.split(','),
        whenCreated: Date.now() };
    if (!this.deriveValidate(this.derivePath, this.pairType)) {
      const pairAlice = this.keyring.addFromUri(`${this.mnemonicGenerated}${this.derivePath}`,
        this.meta, this.pairType);
      this.keyringPairAddress = this.keyring.getPair(pairAlice.address).address;
      this.keyringPairPubKey = u8aToHex(this.keyring.getPair(pairAlice.address).publicKey);
      this.currentPair = this.keyring.getPair(pairAlice.address);
    }
  }

  public deriveValidate(derivePath: string, pairType: string): string | null {
    try {
      const { path } = keyExtractPath(derivePath);

      // we don't allow soft for ed25519
      if (pairType === 'ed25519') {
        const firstSoft = path.find(({ isSoft }): boolean => isSoft);

        if (firstSoft) {
          return 'Soft derivation paths are not allowed on ed25519';
        }
      }
    } catch (error) {
      return error.message;
    }

    return null;
  }
  public saveKeystoreToJson(): void {
    this.mainGenerateFromMnemonic();
    this.keystoreJson = this.keyring.toJson(this.keyringPairAddress, this.passwordKeystore);
    this.keystoreToDownload =
      'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.keystoreJson));
  }

  public flushMemory(): void {
    this.keyring.removePair(this.keyringPairAddress);
    this.currentPair = '';
    this.mnemonicGenerated = '';
    this.keyringPairAddress = '';
    this.keyringPairPubKey = '';
    this.keyringPairTypes = {};
    this.keystoreJson = {};
    this.passwordKeystore = '';
    this.restoredPair = '';
    this.signedData = '';
    this.meta = {};
    this.toVerify = { data: '', signature: '' };
    this.toSign = { data: '', signature: '' };
    this.accountToImport = {};
  }

  public async mountWasmCrypto(): Promise<void> {
    await waitReady();
    this.keyring = new Keyring();
    this.mnemonicGenerate();
    this.mainGenerateFromMnemonic();
  }

  public mounted(): void {
    this.mountWasmCrypto();
  }
}
</script>