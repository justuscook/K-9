import fs from 'fs/promises';
import { Command, CommandoClient, CommandoMessage, util } from 'discord.js-commando';
import path from 'path';
import IBuild from '../util/IBuild';
import fuse from 'fuse.js';
import { MessageEmbed, TextChannel } from 'discord.js';
import Pagination, { Embeds, PaginationEmbed } from 'discord-paginationembed';


export class GetCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'get',
            group: 'builds',
            memberName: 'get',
            description: 'Gets a build subbmitted by a Team Builder.',
        });
    }

    async run(message: CommandoMessage) {
        const file = await fs.readFile(path.join(__dirname, 'data', 'builds.json'), 'utf8');
        const builds: IBuild[] = JSON.parse(file);
        const fuzzy = new fuse(builds, {
            keys: ['name']
        })
        if (message.argString !== null) {
            let embeds: MessageEmbed[] = [];
            const found: IBuild[] = fuzzy.search(message.argString).map(x => x.item);
            if (found.length !== 0) {
                for (const f of found) {
                    const embed: MessageEmbed = new MessageEmbed()
                        .setAuthor(`${found.length} builds found for you search:`)
                        .setTitle(f.name)
                        .setImage(f.allImages)
                        .setColor('BLURPLE')
                        ?.setDescription(f.note);
                    if (message.guild.members.cache.get(f.authorID.toString()) !== undefined) {
                        embed.setFooter(`Build by ${message.guild.members.cache.get(f.authorID.toString())?.displayName} \nGUID: ${f.guid}`);
                    }
                    else {
                        embed.setFooter(`GUID: ${f.guid}`);
                    }
                    embeds.push(embed);
                }

                await new Embeds()
                    .setArray(embeds)
                    .setChannel(message.channel as TextChannel)
                    .setDeleteOnTimeout(true)
                    .setTimeout(60000)
                    .build();
                    
            }
            else return message.reply(`I coudln't find a champion named ${message.argString}, please try again!`)
        }
        else {
            return message.reply('You didn\'t give me a champion to look up, please try again.');
        }
        return null;
    }
}