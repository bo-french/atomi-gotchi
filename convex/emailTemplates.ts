// TODO: Change this to be the main branch before merging
const GIF_FOLDER =
  "https://raw.githubusercontent.com/bo-french/atomi-gotchi/main/public/gifs";

export const emailTemplates = {
  default: `
  <h1>🐾 Your Virtual Pet Says Hello!</h1>
  <p>Welcome to the Virtual Pet Email Game!</p>
  <img src="${GIF_FOLDER}/pet.gif" alt="Virtual Pet" width="200" height="200">
  <br>
  `,
};
