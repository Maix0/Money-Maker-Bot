const Discord = require("discord.js");
const ChannelN = require("./Channels.json");
const commands = require("./commands.json");
const botconfig = require("./botconfig.json");
const commandsDesc = require("./commandsDesc.json");
const bot = new Discord.Client({DisableEveryone: true});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online !`);
  bot.user.setActivity("Maix's code", {type: "LISTENING"});
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let Aprefix = botconfig.Aprefix;
  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(cmd === `${prefix}${commands.hello}`){
    return message.channel.send("Hello");
  } //!hello -- say hello
  if(cmd === `${prefix}${commands.botinfo}`){

    let boticon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor("#70ff70")
    .setThumbnail(boticon)
    .addField("Bot Name", bot.user.username)
    .addField("Created on", bot.user.createdAt)
    .addField("Created by", "Maix");

    return message.channel.send(botembed);
  }//!botinfo -- show the bot information
  if(cmd === `${prefix}${commands.help}`){

    let boticon = bot.user.displayAvatarURL;
    let help = new Discord.RichEmbed()
    .setDescription("Help")
    .setColor("#70ff70")
    .setThumbnail(boticon)
    .addField(`${prefix}${commands.help}`, `${commandsDesc.help}`)
    .addField(`${prefix}${commands.botinfo}`, `${commandsDesc.botinfo}`)
    .addField(`${prefix}${commands.serverinfo}`, `${commandsDesc.serverinfo}`)
    .addField(`${prefix}${commands.hello}`, `${commandsDesc.hello}`)
    .addField(`${prefix}${commands.report}`, `${commandsDesc.report}`);

    return message.channel.send(help);
  }//!help -- show the help message
  if(cmd === `${Aprefix}${commands.help}`){

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the Permission to do this");
    let boticon = bot.user.displayAvatarURL;
    let Ahelp = new Discord.RichEmbed()
    .setDescription("AdmiHelp")
    .setColor("#70ff70")
    .setThumbnail(boticon)
    .addField(`${Aprefix}${commands.Ahelp}`, `${commandsDesc.Ahelp}`)
    .addField(`${Aprefix}${commands.ban}`, `${commandsDesc.ban}`)
    .addField(`${Aprefix}${commands.kick}`, `${commandsDesc.kick}`)
    .addField(`${Aprefix}${commands.disable}`, `${commandsDesc.disable}`)
    .addField(`${Aprefix}${commands.disable}`, `${commandsDesc.disable}`);

    return message.channel.send(Ahelp);
  }
  if(cmd === `${prefix}${commands.serverinfo}`){

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Server Information")
    .setColor("#ff7070")
    .setThumbnail(sicon)
    .addField("Server Name", message.guild.name)
    .addField("Created On", message.guild.createdAt)
    .addField("You Joined", message.member.joinedAt)
    .addField("Total Members", message.guild.memebrCount);

    return message.channel.send(serverembed);
  } //!serverinfo -- show the server information
  if(cmd === `${prefix}${commands.report}`){
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't Find user");
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#550000")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", reason);

    let reportschannel = message.guild.channels.find(`name`, `${ChannelN.report}`);
    if(!reportschannel) return message.channel.send("Couldn't find reports channel");

    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);

    message

    return;
  }
  if(cmd === `${Aprefix}${commands.kick}`){

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the Permission to do this");
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Can't find User!");
    let kReason = args.join(" ").slice(22);
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You can't kick this person");


    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#e56b00")
    .addField(`Kicked User`, `${kUser} with ID ${kUser.id}`)
    .addField(`Kicked By`, `<@${message.author.id}> with ID ${message.author.id}`)
    .addField(`Kicked in`, message.channel)
    .addField(`Time`, message.createdAt)
    .addField(`Reason`, kReason);

    let kickChannel = message.guild.channels.find(`name`, `${ChannelN.kick}`);
    if(!kickChannel) return message.channel.send(`Can't find a channel with name of : ${ChannelN.kick}`);

    message.guild.member(kUser).kick(kReason);

    kickChannel.send(kickEmbed)
    return
  }
  if(cmd === `${Aprefix}${commands.ban}`){

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the Permission to do this");
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Can't find User!");
    let bReason = args.join(" ").slice(22);
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You can't kick this person");


    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#5a0000")
    .addField(`Banned User`, `${bUser} with ID ${bUser.id}`)
    .addField(`Banned By`, `<@${message.author.id}> with ID ${message.author.id}`)
    .addField(`Time`, message.createdAt)
    .addField(`Reason`, bReason);

    let banChannel = message.guild.channels.find(`name`, `${ChannelN.ban}`);
    if(!banChannel) return message.channel.send(`Can't find a channel with name of : ${ChannelN.ban}`);

    message.guild.member(bUser).ban(bReason);

    banChannel.send(banEmbed)
    return
  }
});

bot.login(botconfig.token);
