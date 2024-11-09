const public_dev = "091495765fa5ef2725a175a57b276ec30dc9d39c22d30410f2ede68a3eab66b3";
const public_schnell = "2a6b576af31790b470f0a8442e1e9791213fa13799cbb65a9fc1436e96389574";
const rds_finetune = "97e9e1dd2f6e40af8c502a6812b05dca06e376fc46eac693f2dd598a07f9d8fe";

/**
 * @typedef {Object} Configuration
 * @property {string} model - Name of the model to use
 * @property {string} triggerWord - Word to trigger the model
 * @property {string} promptWord - Word to replace the trigger word
 * @property {string} replicateId - Replicate deployment ID
 * @property {Object} modelParams - Parameters to pass to the model
 */

/** @typedef {Record<string, Configuration>} AIConfiguration */

/** @type {AIConfiguration} */
export default {
  "aklevecz/bao-flux": {
    triggerWord: "a french bulldog",
    promptWord: "bao",
    model: "aklevecz/bao-flux",
    replicateId: public_dev,
    modelParams: {
      hf_lora: "aklevecz/bao-flux",
    },
  },
  "aklevecz/bao-flux-schnell": {
    triggerWord: "a french bulldog",
    promptWord: "bao",
    model: "aklevecz/bao-flux-schnell",
    replicateId: public_schnell,
    modelParams: {
      hf_lora: "aklevecz/bao-flux-schnell",
    },
  },
  "aklevecz/finn_flux": {
    triggerWord: "a white cat",
    promptWord: "finn",
    model: "aklevecz/finn_flux",
    replicateId: public_schnell,
    modelParams: {
      hf_lora: "aklevecz/finn_flux",
    },
  },
  "aklevecz/rds-15": {
    triggerWord: "rdsflower",
    promptWord: "flower",
    model: "aklevecz/rds-15",
    replicateId: rds_finetune,
    modelParams: {
      width: 512,
      height: 512,
    },
  },
};
