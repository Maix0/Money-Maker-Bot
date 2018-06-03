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


  let Mprefix = botconfig.Mprefix;
  let Aprefix = botconfig.Aprefix;
  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let adminrole = message.guild.roles.find("name", `${role.admin}`);
  let staffrole = message.guild.roles.find("name", `${role.staff}`);
  let banrole = message.guild.roles.find("name", `${role.ban}`);
  let kickrole = message.guild.roles.find("name", `${role.kick}`);
  let muterole = message.guild.roles.find("name", `${role.mute}`);
  let mutedrole = message.guild.roles.find("name", `${role.muted}`);
  let defaultrole = message.guild.roles.find("name", `${role.default}`)
  let CheckerRole  = message.member.roles;

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
    .addField("Total Members", message.guild.memberCount);

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

  if(cmd === `${Mprefix}${commands.help}`){

    if(!CheckerRole.has(staffrole.id)) return message.channel.send("You don't have the Permission to do this");
    let boticon = bot.user.displayAvatarURL;
    let Mhelp = new Discord.RichEmbed()
    .setDescription("Moderation Help")
    .setColor("#70ff70")
    .setThumbnail(boticon)
    .addField(`${Mprefix}${commands.help}`, `${commandsDesc.Mhelp}`)
    .addField(`${Mprefix}${commands.ban}`, `${commandsDesc.ban}`)
    .addField(`${Mprefix}${commands.kick}`, `${commandsDesc.kick}`)
    .addField(`${Mprefix}${commands.disable}`, `${commandsDesc.disable}`)
    .addField(`${Mprefix}${commands.disable}`, `${commandsDesc.disable}`);

    return message.channel.send(Mhelp);
  }
  if(cmd === `${Mprefix}${commands.kick}`){

    if(!CheckerRole.has(kickrole.id)) return message.channel.send("You don't have the Permission to do this");
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Can't find User!");
    let kReason = args.join(" ").slice(22);
    if(kUser.roles.has(staffrole.id)) return message.channel.send("You can't kick this person");


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
  if(cmd === `${Mprefix}${commands.ban}`){

    if(!CheckerRole.has(banrole.id)) return message.channel.send("You don't have the Permission to do this");
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Can't find User!");
    let bReason = args.join(" ").slice(22);
    if(bUser.roles.has(staffrole.id)) return message.channel.send("You can't kick this person");


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
  if(cmd === `${Mprefix}${commands.mute}`){
    if(!CheckerRole.has(muterole.id)) return message.channel.send("You don't have the Permission to do this");
    let ToMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!ToMute) return message.reply("No User")
    if(ToMute.roles.has(staffrole.id)) return message.channel.send("You can't mute this person");
    if(!mutedrole){
      try{
        mutedrole = await message.guild.createRole({
          name: `${role.muted}`,
          color: `${role.mutedColor}`,
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(mutedrole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    let mutedtime = args[1];
    if(!mutedtime) return message.reply("You didn't specify a time!");

    await(ToMute.addRole(mutedrole.id));
    message.reply(`<@${ToMute.id}> has been muted for ${ms(ms(mutedtime))}`);
    let muteReason = args.join(" ").slice(22);

    let MuteEmbed = new Discord.RichEmbed()
    .setDescription("~Mute~")
    .setColor("#5a0000")
    .addField(`Muted User`, `${ToMute} with ID ${ToMute.id}`)
    .addField(`Muted By`, `<@${message.author.id}> with ID ${message.author.id}`)
    .addField(`At`, message.createdAt)
    .addField(`For`, mutedtime)
    .addField(`Reason`, muteReason);

    setTimeout(function(){
      ToMute.removeRole(mutedrole.id);
      message.channel.send(`<@${ToMute.id}> has been unmuted!`);
    }, ms(mutedtime));

    let muteChannel = message.guild.channels.find(`name`, `${ChannelN.mute}`);
    if(!muteChannel) return message.channel.send(`Can't find a channel with name of : ${ChannelN.mute}`);

    muteChannel.send(MuteEmbed)

    return
      }

  if(cmd === `${Aprefix}${commands.help}`){

    if(!CheckerRole.has(staffrole.id)) return message.channel.send("You don't have the Permission to do this");
    let boticon = bot.user.displayAvatarURL;
    let Ahelp = new Discord.RichEmbed()
    .setDescription("Admin Help")
    .setColor("#70ff70")
    .setThumbnail(boticon)
    .addField(`${Aprefix}${commands.help}`, `${commandsDesc.Ahelp}`)
    .addField(`${Aprefix}${commands.grant}`, `${commandsDesc.grant}`)
    .addField(`${Aprefix}${commands.revoke}`, `${commandsDesc.revoke}`)
    .addField(`${Aprefix}${commands.setup}`, `${commandsDesc.setup}`)
    .addField(`${Aprefix}${commands.reset}`, `${commandsDesc.reset}`);
    return message.channel.send(Ahelp);
  }
  if(cmd === `${Aprefix}${commands.setup}`){
    if ((!message.member.hasPermission("ADMINISTRATOR")) && (!message.member.roles.has(adminrole.id)))  {
      return message.channel.send("You don't have the Permission to do this");
    }
    message.guild.createRole({
      name: `${role.admin}`,
      color: `${role.adminColor}`,
      permissions: [8]
    });
    message.guild.createRole({
      name: `${role.staff}`,
      color: `${role.staffColor}`,
      permissions: []
    });
    message.guild.createRole({
      name: `${role.ban}`,
      color: `${role.banColor}`,
      permissions: []
    });
    message.guild.createRole({
      name: `${role.kick}`,
      color: `${role.kickColor}`,
      permissions: []
    });
    message.guild.createRole({
      name: `${role.mute}`,
      color: `${role.muteColor}`,
      permissions: []
    });
  }
  if(cmd === `${Aprefix}${commands.reset}`){
    if ((!message.member.hasPermission("ADMINISTRATOR")) && (!message.member.roles.has(adminrole.id)))  {
      return message.channel.send("You don't have the Permission to do this");
    }
    adminrole.delete('');
    staffrole.delete('');
    banrole.delete('');
    kickrole.delete('');
    muterole.delete('');
    mutedrole.delete('');
  }
  if(cmd === `${Aprefix}${commands.grant}`){
    if ((!message.member.hasPermission("ADMINISTRATOR")) && (!message.member.roles.has(adminrole.id)))  {
      return message.channel.send("You don't have the Permission to do this");
    }
    let grantUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let grantType = args[1];
    if (grantType === 'admin'){
      grantUser.addRole(adminrole)
      return
    }
    if (grantType === 'staff'){
      grantUser.addRole(staffrole)
      return
    }
    if (grantType === 'ban'){
      grantUser.addRole(banrole)
      return
    }
    if (grantType === 'kick'){
      grantUser.addRole(kickrole)
      return
    }
    if (grantType === 'mute'){
      grantUser.addRole(muterole)
      return
    }
  }
  if(cmd === `${Aprefix}${commands.revoke}`){
    if ((!message.member.hasPermission("ADMINISTRATOR")) && (!message.member.roles.has(adminrole.id)))  {
      return message.channel.send("You don't have the Permission to do this");
    }
    let revokeUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let revokeType = args[1];
    if (revokeType === 'admin'){
      revokeUser.removeRole(adminrole)
      return
    }
    if (revokeType === 'staff'){
      revokeUser.removeRole(staffrole)
      return
    }
    if (revokeType === 'ban'){
      revokeUser.removeRole(banrole)
      return
    }
    if (revokeType === 'kick'){
      revokeUser.removeRole(kickrole)
      return
    }
    if (revokeType === 'mute'){
      revokeUser.removeRole(muterole)
      return
    }
  }

});
bot.login(botconfig.token);
