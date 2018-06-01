const Discord = require("discord.js");
const ChannelN = require("./Channels.json");
const commands = require("./commands.json");
const botconfig = require("./botconfig.json");
const commandsDesc = require("./commandsDesc.json");
const bot = new Discord.Client({DisableEveryone: true});
const role = require("./roles.json");
const ms = require("ms");



bot.on("ready", async () => {
  console.log(`${bot.user.username} is online !`);
  bot.user.setActivity("Maix's code", {type: "LISTENING"});
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let adminrole = message.guild.roles.find("name", `${role.admin}`);
  let Aprefix = botconfig.Aprefix;
  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(adminrole === null){
    message.guild.createRole({
      name: `${role.admin}`,
      color: `${role.adminColor}`,
      permission: "ADMINISTRATOR"
    });
  }

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
//@somethings commands : moderation commands
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
  if(cmd === `${Aprefix}${commands.kick}`){

    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You don't have the Permission to do this");
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Can't find User!");
    let kReason = args.join(" ").slice(22);
    if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send("You can't kick this person");


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

    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You don't have the Permission to do this");
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Can't find User!");
    let bReason = args.join(" ").slice(22);
    if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("You can't kick this person");


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
  if(cmd === `${Aprefix}${commands.grantKick}`){
    let kickrole = message.guild.roles.find("name", `${role.kick}`);
    if(kickrole === null){
      message.guild.createRole({
        name: `${role.kick}`,
        color: `${role.kickColor}`,
      });
    }
    if (!message.member.roles.has(adminrole.id)) {
      return message.channel.send("You don't have the Permission to do this");
    }
    let kaUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kaUser) return message.channel.send("Can't find User!");
    if(kaUser.roles.has(kickrole.id)) return message.channel.send("This user is allready allowed to kick pepole!");

    kaUser.addRole(kickrole);
    return
  }
  if(cmd === `${Aprefix}${commands.grantBan}`){
    let banrole = message.guild.roles.find("name", `${role.ban}`);
    if(banrole === null){
      message.guild.createRole({
        name: `${role.ban}`,
        color: `${role.banColor}`,
      });
    }
    if ((!message.member.roles.has(adminrole.id)) && (!message.member.roles.has(banrole.id))) {
      return message.channel.send("You don't have the Permission to do this");
    }
    let baUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!baUser) return message.channel.send("Can't find User!");
    if(baUser.roles.has(banrole.id)) return message.channel.send("This user is allready allowed to ban pepole!");
    baUser.addRole(banrole);
    return
  }
  if(cmd === `${Aprefix}${commands.grantAdmin}`){
    if ((!message.member.hasPermission("ADMINISTRATOR")) && (!message.member.roles.has(adminrole.id)))  {
      return message.channel.send("You don't have the Permission to do this");
    }
    let aUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!aUser) return message.channel.send("Can't find User!");
    if(aUser.roles.has(adminrole.id)) return message.channel.send("This user is allready allowed an admin!");
    aUser.addRole(adminrole);
    return
  }
  if(cmd === `${Aprefix}${commands.revokeKick}`){
    let kickrole = message.guild.roles.find("name", `${role.kick}`);
    if (!message.member.roles.has(adminrole.id)) {
      return message.channel.send("You don't have the Permission to do this");
    }
    let kaUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kaUser) return message.channel.send("Can't find User!");
    if(!kaUser.roles.has(kickrole.id)) return message.channel.send("This user is allready not allowed to kick pepole ,!");

    kaUser.removeRole(kickrole);
    return
  }
  if(cmd === `${Aprefix}${commands.revokeBan}`){
    let banrole = message.guild.roles.find("name", `${role.ban}`);
    if ((!message.member.roles.has(adminrole.id)) && (!message.member.roles.has(banrole.id))) {
      return message.channel.send("You don't have the Permission to do this");
    }
    let baUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!baUser) return message.channel.send("Can't find User!");
    if(!baUser.roles.has(banrole.id)) return message.channel.send("This user is allready not allowed to ban pepole!");
    baUser.removeRole(banrole);
    return
  }
  if(cmd === `${Aprefix}${commands.revokeAdmin}`){
    if ((!message.member.hasPermission("ADMINISTRATOR")) && (!message.member.roles.has(adminrole.id)))  {
      return message.channel.send("You don't have the Permission to do this");
    }
    let aUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!aUser) return message.channel.send("Can't find User!");
    if(!aUser.roles.has(adminrole.id)) return message.channel.send("This user isn't allready an admin!");
    aUser.removeRole(adminrole);
    return
  }

});
bot.login(botconfig.token);
