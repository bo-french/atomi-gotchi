// TODO: Change this to be the main branch before merging
const GIF_FOLDER =
  "https://raw.githubusercontent.com/bo-french/atomi-gotchi/main/public/gifs";
// TODO: Change this to be the main branch before merging

export const emailTemplates = {
  welcome: () => `
    <h1>🎉 Welcome to the Atomi-Gotchi! 🎉</h1>
    <p>We're thrilled to announce that you've just adopted a brand new virtual companion!</p>
    <p>Your Atomi-Gotchi can't wait to start this adventure with you. Together, you'll laugh, play, and grow as you care for your new friend.</p>
    <ul>
      <li>🍼 <strong>Feed</strong> your pet to keep it healthy and happy.</li>
      <li>🎮 <strong>Play games</strong> to boost its mood and health.</li>
      <li>⏰ <strong>Watch for reminders</strong>—your Atomi-Gotchi depends on you!</li>
    </ul>
    <p>Respond quickly when your pet is hungry, and show off your skills in fun mini-games or they won't be pleased. The better you care for your Atomi-Gotchi, the longer and happier its life will be!</p>
    <p>Ready to begin? Log in now and meet your new best friend!</p>
    <img src="${GIF_FOLDER}/happy.gif" alt="Virtual Pet" width="200" height="200" style="margin-top:16px;">
    <br>
    <p style="font-size:0.9em;color:#888;">If you have any questions or need help, just reply to this email. We're here for you and your Atomi-Gotchi!</p>

  `,
};

