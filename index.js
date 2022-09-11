import dotenv from "dotenv";
import { Client, Collection, GatewayIntentBits, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import fetch from "node-fetch";
dotenv.config();

const token = process.env.CLIENT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once("ready", () => {
  console.log(`Client is ready`);
});

const searchSpell = async (spellName) => {
  spellName = spellName.replace(" ", "+");
  spellName = spellName.toLowerCase();

  const dndTools = await fetch(
    `https://www.dnd5eapi.co/api/spells/?name=${spellName}`
  );
  const response = await dndTools.json();

  if (response.count <= 0) return {};
  if (!response.results[0] || !response.results[0].url) return {};

  const spellInfo = await fetch(
    `https://www.dnd5eapi.co${response.results[0].url}`
  );
  const spellInfoRes = await spellInfo.json();

  return spellInfoRes;
};

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  switch (commandName.toLowerCase()) {
    case "spell":
      const spellName = interaction.options.get("name");
      if (!spellName || !spellName.value) return;
      const spell = await searchSpell(spellName.value);

      if (Object.keys(spell).length == 0)
        return await interaction.reply(
          `My bot brain isn't big enough to find ${spellName.value}, sorry!`
        );

      await interaction.reply(
        `Basic description of ${spell.name}: ${spell.desc[0]}`
      );
  }
});

client.login(token);
