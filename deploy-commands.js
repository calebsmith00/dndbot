import { SlashCommandBuilder, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import dotenv from "dotenv";
dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName("spell")
    .setDescription("Utilize DND's API to search spells!")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the spell to search for.")
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const token = process.env.CLIENT_TOKEN;
const guildID = process.env.GUILD_ID;
const clientID = process.env.CLIENT_ID;
const rest = new REST({ version: "10" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`)
  )
  .catch(console.error);
