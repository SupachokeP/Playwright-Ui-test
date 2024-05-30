const randomNumber = Math.floor(Math.random() * 9000) + 1000;
const serverId = "5ftroqqw";

const agentEmail = `agent${randomNumber}@${serverId}.mailosaur.net`;
const companyEmail = `company${randomNumber}@${serverId}.mailosaur.net`;

export { agentEmail, companyEmail };